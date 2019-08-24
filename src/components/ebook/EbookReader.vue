<template>
    <div class="ebook-reader">
        <div id="read"></div>
    </div>
</template>

<script>
import Epub from 'epubjs'
import { mapGetters } from 'vuex'
global.ePub = Epub

  export default {
    name: '',
    computed: {
      ...mapGetters(['fileName'])
    },
    // Laws|2015_Book_ProtectingTheRightsOfPeopleWit
    methods: {
      initEpub () {
        const baseUrl = 'http://192.168.1.62:8081/epub/' + this.fileName + '.epub'
        this.book = new Epub(baseUrl)
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight,
          method: 'default'
        })
        this.rendition.display()
      }
    },
    mounted () {
      const fileName = this.$route.params.fileName.split('|').join('/')
      this.$store.dispatch('setFileName', fileName).then(() => {
        this.initEpub()
      })
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
    @import "../../assets/styles/global.scss";

</style>
