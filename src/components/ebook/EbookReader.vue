<template>
    <div class="ebook-reader">
        <div id="read"></div>
    </div>
</template>

<script>
import Epub from 'epubjs'
import { ebookMixin } from '../../utils/mixin'

global.ePub = Epub

  export default {
    name: '',
    mixins: [ebookMixin],
    // /Laws|2015_Book_ProtectingTheRightsOfPeopleWit
    methods: {
      initEpub () {
        // http://192.168.52.33:8081/epub
        // http://192.168.52.33:8081/
        const baseUrl = 'http://192.168.1.62:8081/epub/' + this.fileName + '.epub'
        this.book = new Epub(baseUrl)
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight,
          method: 'default'
        })
        this.rendition.display()
        // rendition
        this.rendition.on('touchstart', event => {
          this.touchStartX = event.changedTouches[0].clientX
          event.passive = false
          this.touchStartTime = event.timeStamp
        })
        this.rendition.on('touchend', event => {
          event.passive = false
          const offetX = event.changedTouches[0].clientX - this.touchStartX
          const time = event.timeStamp - this.touchStartTime
          if (time < 500 && offetX > 400) {
            this.prevPage()
          } else if (time < 500 && offetX < -40) {
            this.nextPage()
          } else {
            this.toggleTitleAndMenu()
          }
          // 禁止事件进行传播 禁用事件的默认方法调用
          event.preventDefault()
          event.stopPropagation()
          console.log(offetX, time)
        })
      },
      prevPage () {
        if (this.rendition) {
          this.rendition.prev()
          this.hideTitleAndMenu()
        }
      },
      nextPage () {
        if (this.rendition) {
          this.rendition.next()
          this.hideTitleAndMenu()
        }
      },
      toggleTitleAndMenu () {
        this.setMenuVisible(!this.menuVisible)
      },
      hideTitleAndMenu () {
        this.$store.dispatch('setMenuVisible', false)
      }
    },
    mounted () {
      const fileName = this.$route.params.fileName.split('|').join('/')
      this.$store.dispatch('setFileName', fileName).then(() => {
        console.log(fileName + 'console.log(fileName)')
        this.initEpub()
      })
      console.log(fileName)
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
    @import "../../assets/styles/global.scss";
</style>
