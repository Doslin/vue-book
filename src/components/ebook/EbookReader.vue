<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="ebook-reader-mask"
         @click="onMaskClick"
         @touchmove="move"
         @touchend="end" ></div>
  </div>
</template>

<script>
  import Epub from 'epubjs'
  import { ebookMixin } from '../../utils/mixin'
  import {
    getFontFamily,
    saveFontFamily,
    saveFontSize,
    getFontSize,
    getTheme,
    saveTheme,
    getLocation
  } from '../../utils/localStorage'

  global.ePub = Epub

  export default {
    name: '',
    mixins: [ebookMixin],
    // /Laws|2015_Book_ProtectingTheRightsOfPeopleWit
    methods: {
      initEpub() {
        // http://192.168.52.33:8081/epub
        // http://192.168.52.33:8081/
        const baseUrl = process.env.VUE_APP_RES_URL + '/epub/' + this.fileName + '.epub'
        this.book = new Epub(baseUrl)
        this.setCurrentBook(this.book)
        this.initRendition()
        this.initGesture()
        this.parseBook()
        this.book.ready.then(() => {
          return this.book.locations.generate(750 * (window.innerWidth / 375) *
            (getFontSize(this.fileName) / 16))
        }).then(locations => {
          this.setBookAvailable(true)
          this.refreshLocation()
        })
      },
      initFontFamily() {
        let font = getFontFamily(this.fileName)
        if (!font) {
          saveFontFamily(this.fileName, this.defaultFontFamily)
        } else {
          this.rendition.themes.font(font)
          this.setDefaultFontFamily(font)
        }
      },
      initTheme() {
        let defaultTheme = getTheme(this.fileName)
        if (!defaultTheme) {
          defaultTheme = this.themeList[0].name

          saveTheme(this.fileName, defaultTheme)
        }
        this.setDefaultTheme(defaultTheme.name)
        this.themeList.forEach(theme => {
          // 先进行注册
          this.rendition.themes.register(theme.name, theme.style)
        })
        // 不从vuex中取出数据， 因为vuex是异步的
        this.rendition.themes.select(defaultTheme.name)
      },
      initFontSize() {
        let fontSize = getFontSize(this.fileName)
        if (!fontSize) {
          saveFontSize(this.fileName, this.defaultFontSize)
        } else {
          this.rendition.themes.font(fontSize)
          this.setDefaultFontSize(fontSize)
        }
      },
      initRendition () {
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight,
          method: 'default'
        })
        const location = getLocation(this.fileName)
        if (location) {
          this.disPlay(location, () => {
            this.initFontSize()
            this.initFontFamily()
            this.initTheme()
            this.initGlobalStyle()
          })
        } else {
          this.disPlay(null, () => {
            this.initFontSize()
            this.initFontFamily()
            this.initTheme()
            this.initGlobalStyle()
          })
        }
        this.rendition.hooks.content.register(contents => {
          Promise.all([
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`)
          ]).then(() => {
          })
        })
      },
      initGesture () {
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
          // event.preventDefault()
          event.stopPropagation()
        })
      },
      parseBook () {
        this.book.loaded.cover.then(cover => {
          this.book.archive.createUrl(cover).then(url => {
            this.setCover(url)
          })
        })
        this.book.loaded.metadata.then(metadata => {
          this.setMetadata(metadata)
        })
        this.book.loaded.navigation.then(nav => {
          console.log(nav)
          const navItem = (function flatten(arr) {
            return [].concat(...arr.map(v => [v, ...flatten(v.subitems)]))
          })(nav.toc)

          function find(item, v = 0) {
            const parent = navItem.filter(it => it.id === item.parent)[0]
            return !item.parent ? v : (parent ? find(parent, ++v) : v)
          }

          navItem.forEach(item => {
            item.level = find(item)
            item.total = 0
            item.pagelist = []
            if (item.href.match(/^(.*)\.html$/)) {
              item.idhref = item.href.match(/^(.*)\.html$/)[1]
            } else if (item.href.match(/^(.*)\.xhtml$/)) {
              item.idhref = item.href.match(/^(.*)\.xhtml$/)[1]
            }
          })
          this.setNavigation(navItem)
        })
      },
      prevPage() {
        if (this.rendition) {
          this.rendition.prev().then(() => {
            this.refreshLocation()
          })
          this.hideTitleAndMenu()
        }
      },
      nextPage () {
        if (this.rendition) {
          this.rendition.next().then(() => {
            this.refreshLocation()
          })
          this.hideTitleAndMenu()
        }
      },
      toggleTitleAndMenu() {
        if (this.menuVisible) {
          this.setSettingVisible(-1)
          this.setFontFamilyVisible(false)
        }
        this.setMenuVisible(!this.menuVisible)
      },
      onMaskClick (e) {
        const offsetX = e.offsetX
        const width = window.innerWidth
        if (offsetX > 0 && offsetX < width * 0.3) {
          this.prevPage()
        } else if (offsetX > 0 && offsetX > width * 0.7) {
          this.nextPage()
        } else {
          this.toggleTitleAndMenu()
        }
      },
      move (e) {
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = e.changedTouches[0].clientY - this.firstOffsetY
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = e.changedTouches[0].clientY
        }
        e.preventDefault()
        e.stopPropagation()
      },
      end (e) {
        this.setOffsetY(0)
        this.firstOffsetY = null
      }
    },
    mounted() {
      const fileName = this.$route.params.fileName.split('|').join('/')
      this.$store.dispatch('setFileName', fileName).then(() => {
        this.initEpub()
      })
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/styles/global.scss";
  .ebook-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .ebook-reader-mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 150;
      width: 100%;
      height: 100%;
      background: transparent;
    }
  }
</style>
