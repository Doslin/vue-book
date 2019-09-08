<template>
    <div class="ebook" ref="ebook">
        <ebook-bookmark></ebook-bookmark>
        <ebook-reader></ebook-reader>
        <ebook-title></ebook-title>
        <ebook-menu></ebook-menu>
    </div>
</template>
<script>
    import EbookReader from '../../components/ebook/EbookReader'
    import EbookTitle from '../../components/ebook/EbookTitle'
    import EbookMenu from '../../components/ebook/EbookMenu'
    import EbookBookmark from '../../components/ebook/EbookBookmark'
    import { getReadTime, saveReadTime } from '../../utils/localStorage'
    import { ebookMixin } from '../../utils/mixin'

    export default {
    components: {
      EbookMenu,
      EbookTitle,
      EbookReader,
      EbookBookmark
    },
    mixins: [ebookMixin],
    methods: {
      startLoopReadTime () {
        let readTime = getReadTime(this.fileName)
        console.log('挺好：' + this.fileName)
        if (!readTime) {
          readTime = 0
        }
        this.task = setInterval(() => {
          readTime++
          if (readTime % 30 === 0) {
            saveReadTime(this.fileName, readTime)
          }
        }, 1000)
      },
      move (v) {
        this.$refs.ebook.style.top = v + 'px'
      },
      restore () {
        this.$refs.ebook.style.top = 0
        this.$refs.ebook.style.transition = 'all .2s linear'
        setTimeout(() => {
          this.$refs.ebook.style.transition = ''
        }, 200)
      }
    },
    mounted() {
      this.startLoopReadTime()
    },
    watch: {
      offsetY(v) {
        if (!this.menuVisible && this.bookAvailable) {
          if (v > 0) {
            this.move(v)
          } else if (v === 0) {
            this.restore()
          }
        }
      }
    },
    beforeDestroy() {
      if (this.task) {
        clearInterval(this.task)
      }
    }
  }

</script>
<style lang="scss" type="text/scss" scoped>
    @import '../.././assets/styles/global.scss';
  .ebook {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
