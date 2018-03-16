require('../node_modules/vuetify/src/stylus/app.styl')

import Vue from 'vue'
import {
  Vuetify,
  VApp,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VTextField,
  VSubheader,
  VAlert,
  VProgressLinear,
  VRadioGroup,
  VExpansionPanel,
  VCard,
  transitions
} from 'vuetify'
import App from './App.vue'

Vue.use(Vuetify, {
  components: {
    VApp,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VTextField,
    VSubheader,
    VAlert,
    VProgressLinear,
    VRadioGroup,
    VExpansionPanel,
    VCard,
    transitions
  },
  theme: {
    primary: '#2196F3',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  }
})

new Vue({
  el: '#app',
  render: h => h(App)
})
