/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

// Install `electron-debug` with `devtron`
const path = require('path');
const electron = require('electron');
const { BrowserWindow } = electron;

require('electron-debug')({ showDevTools: true })

// Install `vue-devtools`
electron.app.on('ready', () => {
  // let installExtension = require('electron-devtools-installer')
  // installExtension.default(installExtension.VUEJS_DEVTOOLS, true)
  //   .then((name) => console.log(`Added Extension:  ${name}`))
  //   .catch(err => {
  //     console.log('Unable to install `vue-devtools`: \n', err)
  //   })
  if (!BrowserWindow.getDevToolsExtensions()['Vue.js devtools']) {
    BrowserWindow.addDevToolsExtension(path.resolve(__dirname, '../extensions/vue-devtools-5.1.0'));
  }

  console.log(BrowserWindow.getDevToolsExtensions());
})

// Require `main` process to boot app
require('./index')