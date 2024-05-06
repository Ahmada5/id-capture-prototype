import { createRouter, createWebHistory } from 'vue-router'
//import Trymultipart from '../components/Trymultipart.vue'
//import TrymultipartBase from '../components/TrymultipartBase.vue'
import PhotocaptureTry from '../components/PhotocaptureTry.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      //component: Trymultipart,
      //component: TrymultipartBase,
      component: PhotocaptureTry,

    },
  ],
})