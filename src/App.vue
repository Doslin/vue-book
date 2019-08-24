<template>
    <div id="app">
        <span class="test">ABCDEFG</span>
        <div></div>
        <span class="text">QWETYY</span>
        <router-view/>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['test'])
  },
  mounted () {
    this.$store.dispatch('setTest', 111).then(() => {
      console.log(this.test)
    })
  }
}
document.addEventListener('DOMContentLoaded', () => {
  let fontSize = window.innerWidth / 10
  // fontSize = fontSize > 50 ? 50 : fontSize
  const html = document.querySelector('html')
  html.style.fontSize = fontSize + 'px'
})
</script>
<style lang="scss" type="text/scss">
    @import './assets/styles/global.scss';
    #app {
        .test {
            font-family: 'Days One';
            font-size: 35px;
        }
    }
</style>
