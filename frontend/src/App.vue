<template>
<div id="app">
    <h1>App Root</h1>
    <RawAudioView></RawAudioView>
</div>
</template>

<script>
import RawAudioView from "./components/RawAudioView.vue";
export default {
  name: "app",
  components: {
    RawAudioView
  }
};
</script>


<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
