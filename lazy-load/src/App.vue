<template>
  <div id="app">
    <Lazyload :imgList="imgList"></Lazyload>
  </div>
</template>

<script>
import Lazyload from './components/lazy-load.vue'
export default {
  name: 'App',
  components: {
    Lazyload
  },
  data() {
    return {
      imgList: ['https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1625872005,2504897446&fm=26&gp=0.jpg',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fattachments.gfan.com%2Fforum%2Fattachments2%2Fday_110915%2F1109151356c0717d7e6a91e985.jpg&refer=http%3A%2F%2Fattachments.gfan.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614416759&t=86d72105fe7326ac44d50fa9b7426643',
        'https://ss2.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/adaf2edda3cc7cd968cd92783801213fb90e91ab.jpg',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ffile01.16sucai.com%2Fd%2Ffile%2F2011%2F0801%2F20110801111724537.jpg&refer=http%3A%2F%2Ffile01.16sucai.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614416811&t=eb616ec05b46c31b30663ad1c6f64615',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fattachments.gfan.com%2Fforum%2Fattachments2%2Fday_111217%2F1112171558233558c2f271940b.jpg&refer=http%3A%2F%2Fattachments.gfan.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614416811&t=8f853c5b089f1bbe3619f46edb376d22',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic31.nipic.com%2F20130701%2F7447430_090226035000_2.jpg&refer=http%3A%2F%2Fpic31.nipic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614416811&t=d402b74824712ec594aa92847ff6eab6',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fattach.bbs.miui.com%2Fforum%2F201507%2F22%2F234801ubecewkwlecgbqvl.jpg&refer=http%3A%2F%2Fattach.bbs.miui.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614416811&t=a34634fdbb61053b8b31a76a219179b8',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbenyouhuifile.it168.com%2Fforum%2F201201%2F09%2F204425wkhzcdrods6bcsr9.jpg&refer=http%3A%2F%2Fbenyouhuifile.it168.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614416811&t=e7af069e32f27fa47d93d83b1fcfd3dc',
        'https://gss0.baidu.com/70cFfyinKgQFm2e88IuM_a/forum/w%3d580/sign=09db88acc0cec3fd8b3ea77de689d4b6/2c820a7b02087bf4ba182289f1d3572c10dfcff5.jpg',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi4.qhimg.com%2Ft01dadc71c75c8d8533.jpg&refer=http%3A%2F%2Fi4.qhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614416811&t=a9d3691291324f0cf156f81ad2803c72',
        'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2311714271,2273783689&fm=26&gp=0.jpg',
        'https://ss1.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/9d82d158ccbf6c8199159fabb73eb13533fa4056.jpg',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fattach.bbs.miui.com%2Fforum%2F201309%2F15%2F102658c5blvktv4lrsvkkz.jpg&refer=http%3A%2F%2Fattach.bbs.miui.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614416811&t=15b840faa6d91203734a16bef8968aa3',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.52qingyin.cn%2Fwp-content%2Fuploads%2F2013%2F09%2Fqingyoushuilian3.jpg&refer=http%3A%2F%2Fwww.52qingyin.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614416811&t=4131a2c31d8ae8534f60614ace46aa1e',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi2.sinaimg.cn%2Fent%2Fs%2Fj%2Fk%2Fp%2F2013-03-14%2FU1345P28T3D3876793F329DT20130314104453.jpg&refer=http%3A%2F%2Fi2.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614416811&t=a08fa0b2ab5e2b5730a81dd8617d1e22',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fs6.sinaimg.cn%2Forignal%2F7376b3dftc0a23682b115%26690&refer=http%3A%2F%2Fs6.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614416922&t=e502e4940d2c7f07821642342297a3b3',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ffile.mumayi.com%2Fforum%2F201207%2F23%2F2036148p7pf03uiex3xi1u.jpg&refer=http%3A%2F%2Ffile.mumayi.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614416922&t=2a410fc79bb16fdc428eb1cb531a51f0',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic3.nipic.com%2F20090717%2F2658142_092857095_2.jpg&refer=http%3A%2F%2Fpic3.nipic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614416922&t=69e075b9854d3e0f7e7eb1313171ea07',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.jj20.com%2Fup%2Fallimg%2F1114%2F0F620093053%2F200F6093053-6-1200.jpg&refer=http%3A%2F%2Fpic.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614416922&t=4819af91c7379526cdd8b0f713043a50',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg1.efu.com.cn%2Fupfile%2Fnews%2Fcommonly%2F2011%2F2011-07-07%2Fcd25c95d-0392-4022-b64d-7273ed463ef7.jpg&refer=http%3A%2F%2Fimg1.efu.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614416922&t=346450fc7e81901ced21458f734abeb7',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201307%2F22%2F20130722173939_PKzt4.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614416922&t=1c8771ffc701a6f9f706592b608c2340']
    }
  },
  mounted() {
    // let fileIds = [101, 105, 107, 109, 113, 115, 187, 281, 283, 213, 
    //   249, 357, 359, 361, 363, 165, 369, 381, 385, 169]

    //   this.imgList = fileIds.map(item => {
    //     return `http://60.174.249.206:48080/epms-core/static/file/getFile?fileId=${item}`;
    //   })
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
