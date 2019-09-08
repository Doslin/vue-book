<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <book-mark :color="color" :height="15" :width="35"></book-mark>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BookMark from '../common/BookMark'
  import { realPx } from '../../utils/utils'
  import { ebookMixin } from '../../utils/mixin'
  import { getBookmark, saveBookmark } from '../../utils/localStorage'

  const BLUE = '#346cbc'
  const WHITE = '#fff'
  export default {
    data () {
      return {
        text: '',
        color: WHITE,
        isFixed: false
      }
    },
    mixins: [ebookMixin],
    components: {
      BookMark
    },
    computed: {
      height () {
        return realPx(35)
      },
      threshold() {
        return realPx(55)
      },
      fixedStyle() {
        return {
          position: 'fixed',
          right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`,
          top: 0
        }
      }
    },
    watch: {
      offsetY (v) {
        if (!this.bookAvailable || this.menuVisible || this.settingVisible > 0) {
          return
        }
        if (v >= this.height && v < this.threshold) {
          this.beforeThreshold(v)
        } else if (v >= this.threshold) {
          this.afterThreshold(v)
        } else if (v > 0 && v < this.offsetY) {
          // 状态1
          this.beforeHeight()
        } else if (v === 0) {
          this.restore()
        }
      }
    },
    methods: {
      beforeHeight () {
        if (this.isBookmark) {
          this.text = this.$t('book.pulldownDeleteMark')
          this.color = BLUE
          this.isFixed = true
        } else {
          this.text = this.$t('book.pulldownAddMark')
          this.color = WHITE
          this.isFixed = false
        }
        this.isFixed = false
      },
      beforeThreshold(v) {
        // 状态2: 未到达临界状态
        this.$refs.bookmark.style.top = `${-v}px`
        this.beforeHeight()
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === 'rotate(180deg)') {
          iconDown.style.transform = 'rotate(0deg)'
        }
      },
      afterThreshold(v) {
        // 状态3: 超越临界状态
        if (this.isBookmark) {
          this.text = this.$t('book.releaseDeleteMark')
          this.color = WHITE
          this.isFixed = false
        } else {
          this.text = this.$t('book.releaseAddMark')
          this.color = BLUE
          this.isFixed = true
        }
        this.$refs.bookmark.style.top = `${-v}px`
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === 'rotate(0deg)' || iconDown.style.transform === 'rotate(180deg)') {
          iconDown.style.transform = 'rotate(180deg)'
        }
      },
      restore () {
        setTimeout(() => {
          this.$refs.bookmark.style.top = `${-this.height}px`
          this.$refs.iconDown.style.transform = 'rotate(0deg)'
        }, 200)
        if (this.isFixed) {
          this.setIsBookmark(true)
          this.addBookMark()
        } else {
          this.setIsBookmark(false)
          this.removeBookmark()
        }
      },
      addBookMark() {
        this.boomark = getBookmark(this.fileName)
        if (!this.bookmark) {
          this.bookmark = []
        }
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfibase = currentLocation.start.cfi.replace(/!.*/, '').replace('epubcfi(', '')
        const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)/, '')
        const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)/, '')
        const cfiRange = `epubcfi(${cfibase}!,${cfistart},${cfiend})`
        this.currentBook.getRange(cfiRange).then(range => {
          const text = range.toString().replace(/\s\s/g, '')
          this.bookmark.push({
            cfi: currentLocation.start.cfi,
            text: text
          })
          saveBookmark(this.fileName, this.bookmark)
        })
      },
      removeBookmark() {
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfi = currentLocation.start.cfi
        this.bookmark = getBookmark(this.fileName)
        if (this.bookmark) {
          this.bookmark = this.bookmark.filter(item => item.cfi !== cfi)
          saveBookmark(this.fileName, this.bookmark)
          this.setIsBookmark(false)
        }
      }
    }
  }
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss"  scoped>
  @import "../../assets/styles/global.scss";
  .ebook-bookmark {
    position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 200;
    width: 100%;
    height: px2rem(35);
    background: #d7d7d7;
    .ebook-bookmark-text-wrapper {
      position: absolute;
      right: px2rem(35);
      bottom: 0;
      display: flex;
      .ebook-bookmark-down-wrapper {
        font-size: px2rem(14);
        color: white;
        transition: all .2s linear;
        @include center;
      }
      .ebook-bookmark-text {
        font-size: px2rem(14);
        color: white;
      }
    }
    .ebook-bookmark-icon-wrapper {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(15);

    }
  }

</style>
