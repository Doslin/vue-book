<template>
  <div>
    <transition name="slide-up">
      <div class="menu-wrapper" :class="{'hide-box-shadow': !menuVisible || settingVisible >= 0 }"
           v-show="menuVisible">
        <div class="icon-wrapper">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-a" @click="showSetting(0)">A</span>
        </div>
      </div>
    </transition>
    <ebook-setting-font></ebook-setting-font>
    <ebook-setting-font-popup></ebook-setting-font-popup>
    <ebook-setting-theme></ebook-setting-theme>
    <ebook-setting-progress></ebook-setting-progress>
    <ebook-slide></ebook-slide>
  </div>
</template>

<script>
  import EbookSettingFont from './EbookSettingFont'
  import { ebookMixin } from '../../utils/mixin'
  import EbookSettingFontPopup from './EbookSettingFontPopup'
  import EbookSettingTheme from './EbookSettingTheme'
  import EbookSettingProgress from './EbookSettingProgress'
  import EbookSlide from './EbookSlide'

  export default {
    name: 'EbookMenu',
    mixins: [ebookMixin],
    methods: {
      showSetting(key) {
        console.log(key)
        this.setSettingVisible(key)
      }
    },
    components: {
      EbookSlide,
      EbookSettingProgress,
      EbookSettingFont,
      EbookSettingFontPopup,
      EbookSettingTheme
    }
  }
</script>

<style scoped lang='scss' type="text/scss">
  @import "../../assets/styles/global.scss";

  .menu-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 102;
    display: flex;
    width: 100%;
    height: 48px;
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);

    &.hide-box-shadow {
      box-shadow: none;
    }

    .icon-wrapper {
      flex: 1;
      @include center;

      .icon-progress {
        font-size: 22px;
      }

      .icon-bright {
        font-size: 24px;
      }
    }
  }
</style>
