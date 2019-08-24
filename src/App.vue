<template>
    <div id="app">
        <span class="test">ABCDEFG</span>
        <router-view/>
    </div>
</template>
<script>
export default {}
document.addEventListener('DOMContentLoaded', () => {
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 50 ? 50 : fontSize
  const html = document.querySelector('html')
  html.style.fontSize = fontSize + 'px'
})
</script>
<style lang="scss" type="text/scss">
    @import './assets/styles/global';
    #app {
        .test {
            font-family: 'Days One';
            font-size: px2rem(20);
        }
    }
</style>
