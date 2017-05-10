<template>
    <div id="app">
        <img src="./assets/img/logo.png">
        <h1 class="content-box">
            <router-link to="/Datepicker">DatePicker</router-link>
        </h1>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'app'
}
</script>

<style>
@import url('./assets/css/public.css');
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
.content-box{padding: 20px 0;}
</style>
