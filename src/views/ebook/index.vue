<template>
    <div class="ebook">
        <ebook-reader></ebook-reader>
        <ebook-title></ebook-title>
        <ebook-menu></ebook-menu>
    </div>
</template>
<script>
    import EbookReader from '../../components/ebook/EbookReader'
    import EbookTitle from '../../components/ebook/EbookTitle'
    import EbookMenu from '../../components/ebook/EbookMenu'
    import { getReadTime, saveReadTime } from '../../utils/localStorage'
    import { ebookMixin } from '../../utils/mixin'

    export default {
    components: {
      EbookMenu,
      EbookTitle,
      EbookReader
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
      }
    },
    mounted() {
      this.startLoopReadTime()
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
</style>
