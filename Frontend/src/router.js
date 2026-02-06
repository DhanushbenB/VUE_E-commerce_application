import Vue from 'vue'
import Router from 'vue-router'
import LoginView from './components/LoginView.vue'
import DashboardView from './components/DashboardView.vue'
import RegisterView from './components/RegisterView.vue'
import AddProduct from './components/AddProduct.vue'
import CartView from './components/CartView.vue'
import MyProfile from './components/MyProfile.vue'
import MyStore from './components/MyStore.vue'
import AdminRegisterView from './components/AdminRegister.vue'
import MyOrders from './components/MyOrders.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',    // Use history mode to avoid hash in URLs
  routes: [
    {path: '/', component: DashboardView},
    { path: '/login', component: LoginView },
    {path: '/Register', component: RegisterView},
    {path: '/add-product', component: AddProduct},
    {path: '/cart', component: CartView},
    {path: '/my-profile', component: MyProfile},
    {path: '/MyStore', component: MyStore},
    {path: '/admin-register', component: AdminRegisterView},
    {path: '/orders', component: MyOrders}
  ]
})
