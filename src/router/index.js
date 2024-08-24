import { createRouter, createWebHistory} from 'vue-router'
import MenuDisplayView from '../views/MenuDisplayView.vue'
import UserAuthorizationView from '../views/UserAuthorizationView.vue'
import IndexView from '../views/IndexView.vue'
import CatalogView from '../views/CatalogView.vue'
import ProductView from '../views/ProductView.vue'

const routes = [
  { path: '/menu', component: MenuDisplayView },
  { path: '/login', component: UserAuthorizationView },
  { path: '/home', component: IndexView },
  { path: '/catalog', component: CatalogView },
  { path: '/catalog/:productName/:productPrice?/:productId?', component: ProductView },
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
