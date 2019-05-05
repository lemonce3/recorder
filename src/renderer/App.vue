<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import getScreenshot from "../../../../or-change/electron-screenshot";
import { ipcRenderer } from 'electron';

export default {
  name: "recorder",
  mounted() {
    ipcRenderer.on("LEMONCE3_RECORDER::get-screenshot", this.onGetScreenshot);
  },
  destroyed() {
    ipcRenderer.removeAllListeners("LEMONCE3_RECORDER::get-screenshot", this.onGetScreenshot);
  },
  methods: {
    async onGetScreenshot() {
      ipcRenderer.send("LEMONCE3_RECORDER::screenshot-data", await getScreenshot());
    }
  }
};
</script>

<style>
/* CSS */
</style>
