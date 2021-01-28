<template>
  <div class="app">
    <ul class="img-area">
      <li class="img-item" v-for="(item, index) in imgList" :key="index">
        <img v-lazy="item" />
      </li>
    </ul>
  </div>
</template>
<script>
import Vue from 'vue'
// import VueLazyload from 'vue-lazyload'
import VueLazyload from '@/components/vue-lazyload.js'
import loadingImg from '@/assets/logo.png'
Vue.use(VueLazyload, {
  loading: loadingImg,
  preload: 1.3
});
export default {
  props: {
    imgList: {
      required: true,
      type: Array
    }
  },
  mounted() {
    // let windowHeight = window.innerHeight;
  }
}
</script>
<style scoped>
.img-area {
  width:400px;
  height: 400px;
  /* display: flex;
  flex-direction:row; */
  overflow: auto;
}

.img-item img{
  width:200px;
  height: 150px;
  margin-bottom: 10px;
  margin-left: 10px;
  border: 1px solid #cccccc
}
</style>