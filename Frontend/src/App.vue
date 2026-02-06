<template>
  <div id="app">
    <HeaderView v-if="showHeader"  />
    <router-view @toggle-header="showHeader = $event"></router-view>    
        <notifications group="foo" position="top right" />
            <Toaster richColors position="top-right" />

    <FooterView />
  </div>
</template>

<script>
import FooterView from './components/FooterView.vue';
import HeaderView from './components/HeaderView.vue';


export default {
  name: 'App',
  components: {
    HeaderView,
    FooterView
  },
  data() {
    return {
      showHeader: true
    };
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
