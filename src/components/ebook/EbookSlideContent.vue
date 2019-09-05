<template>
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input type="text" class="slide-contents-search-input"
               @click="showSearchPage()"
               v-model="searchText"
               @keyup.enter.exact="search()"
               :placeholder="$t('book.searchHint')">
      </div>
      <div class="slide-contents-search-cancel" v-if="searchVisible"
           @click="hideSearchPage()">{{$t('book.cancel')}}
      </div>
    </div>
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
        <img :src="cover" alt="" class="slide-contents-book-img">
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">{{metadata.title}}</div>
        <div class="slide-contents-book-author">{{metadata.creator}}</div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{progress + '%'}}</span>
          <span class="progress-text">{{$t('book.haveRead2')}}</span>
        </div>
        <div class="slide-contents-book-time">{{getReadTimeTest()}}</div>
      </div>
    </div>
    <scroll class="slide-contents-list"
            :top="156" :bottom="48" v-show="!searchVisible" ref="srcoll">
      <div class="slide-contents-item" v-for="(item, index) in navigation" :key="index">
          <span class="slide-contents-item-label"
                :class="{'selected': section === index}"
                @click="disPlayContent(item.href)"
                :style="contentItemStyle(item)">{{item.label}}</span>
        <span class="slide-contents-item-page"></span>
      </div>
    </scroll>
    <scroll class="slide-search-list" :top="66" :bottom="48" v-show="searchVisible">
      <div class="slide-search-item" v-for="(item, index) in  searchList" @click="disPlayContent(item.cfi, true)"
           :key="index" v-html="item.excerpt"></div>
    </scroll>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import Scroll from '../Scroll'
  import { px2rem } from '../../utils/utils'

  export default {
    name: 'EbookSlideContents',
    components: { Scroll },
    data() {
      return {
        searchVisible: false,
        searchList: null,
        searchText: null
      }
    },
    mixins: [ebookMixin],
    methods: {
      showSearchPage() {
        this.searchVisible = true
      },
      hideSearchPage() {
        this.searchVisible = false
        this.searchText = ''
        this.searchList = ''
      },
      contentItemStyle(item) {
        return {
          marginLeft: `${px2rem(item.level * 15)}rem`
        }
      },
      disPlayContent(target, highlight = false) {
        this.disPlay(target, () => {
          this.hideTitleAndMenu()
          if (highlight) {
            this.currentBook.rendition.annotations.highlight(target)
          }
        })
      },
      doSearch(q) {
        return Promise.all(
          this.currentBook.spine.spineItems.map(
            item => item.load(this.currentBook.load.bind(this.currentBook)).then(item.find.bind(item, q)).finally(item.unload.bind(item)))
        ).then(results => Promise.resolve([].concat.apply([], results)))
      },
      search() {
        this.currentBook.ready.then(() => {
          if (this.searchText && this.searchText.length > 0) {
            this.doSearch(this.searchText).then(list => {
              this.searchList = list
               this.searchList.map(item => {
                 item.excerpt = item.excerpt.replace(this.searchText, `<span
                     class="content-search-text">${this.searchText}</span>`)
                 return item
               })
            })
          }
        })
      }
    },
    mounted() {
    }
  }
</script>

<style scoped lang='scss' type="text/scss">
  @import "../../assets/styles/global.scss";

  .ebook-slide-contents {
    width: 100%;

    .slide-contents-search-wrapper {
      display: flex;
      height: px2rem(36);
      margin: px2rem(20) 0 px2rem(10) 0;
      padding: 0 px2rem(15);
      box-sizing: border-box;

      .slide-contents-search-input-wrapper {
        flex: 1;
        @include center;

        .slide-contents-search-icon {
          flex: 0 0 px2rem(28);
          @include center;
        }

        .slide-contents-search-input {
          flex: 1;
          width: 100%;
          height: px2rem(32);
          font-size: px2rem(14);
          border: none;
          background: transparent;

          &:focus {
            outline: none;
          }
        }
      }

      .slide-contents-search-cancel {
        flex: 0 0 px2rem(50);
        font-size: px2rem(14);
        @include right;
      }
    }

    .slide-contents-book-wrapper {
      height: px2rem(90);
      display: flex;
      padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
      box-sizing: border-box;
      font-size: 0;

      .slide-contents-book-img-wrapper {
        flex: 0 0 px2rem(45);

        .slide-contents-book-img {
          width: px2rem(45);
          height: px2rem(60);
        }
      }

      .slide-contents-book-info-wrapper {
        flex: 1;
        padding: 0 px2rem(10);

        .slide-contents-book-title {
          width: px2rem(153.75);
          line-height: px2rem(16);
          font-size: px2rem(14);
          @include ellipsis2(2);
        }

        .slide-contents-book-author {
          font-size: px2rem(12);
          width: px2rem(153.75);
          margin-top: px2rem(5);
          @include ellipsis;
        }
      }

      .slide-contents-book-progress-wrapper {
        flex: 0 0 px2rem(70);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;

        .slide-contents-book-progress {
          .progress {
            font-size: px2rem(14);
          }

          .progress-text {
            font-size: px2rem(14);
          }
        }

        .slide-contents-book-time {
          font-size: px2rem(12);
        }
      }
    }

    .slide-contents-list {
      padding: 0 px2rem(15);
      box-sizing: border-box;

      .slide-contents-item {
        padding: px2rem(20) 0;
        box-sizing: border-box;
        width: px2rem(270);
        display: flex;

        .slide-contents-item-label {
          flex: 1;
          font-size: px2rem(14);
          line-height: px2rem(16);
          @include ellipsis;
        }

        .slide-contents-item-page {
          flex: 0 0 px2rem(30);
          font-size: px2rem(10);
          @include right;
        }
      }
    }

    .slide-search-list {
      padding: 0 px2rem(25);
      box-sizing: border-box;

      .slide-search-item {
        font-size: px2rem(14);
        line-height: px2rem(16);
        padding: px2rem(20) 0;
        box-sizing: border-box;
      }
    }
  }
</style>
