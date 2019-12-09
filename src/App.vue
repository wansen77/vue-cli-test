<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
  //   created(){
  //     console.log(process.env.API_PATH,process.env.CUSTOM_PATH)
  //     const api=`${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/products`
  //     this.$http.get(api).then((response) => {
  //   console.log(response.data)
  //   // 客戶端(免驗證)的API格式: https://站點/api/:api_path/products
  //   // get的內容是"遠端主機(API)伺服器的路徑+所申請的API_path"
  // })
  //   }
};
</script>

<style lang='scss'>
/*<#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
@import "./assets/all";
</style>
