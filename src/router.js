import Vue from 'vue'
import Router from 'vue-router'
import DashboardLayout from '@/layout/DashboardLayout'
import IndexLayout from '@/layout/IndexLayout'
import AuthLayout from '@/layout/AuthLayout'
import Store from './store'
import IndexLayoutNew from '@/layout/IndexLayoutNew'

Vue.use(Router)

const router = new Router({
  // linkExactActiveClass: 'active',
  mode: 'history',
  routes: [
    {
      path: '/auth0callback',
      name: 'auth0callback',
      // redirect: 'Perfil',
      component: IndexLayout,
      children: [
        {
          path: '/auth0callback',
          name: 'Perfil',
          component: () => import('./views/perfil/perfil.vue')
        }
      ]
    },
    {
      path: '/layout',
      // redirect: 'perfil',
      component: IndexLayout,
      children: [
        {
          path: '/perfil',
          name: 'perfil',
          component: () => import('./views/perfil/perfil.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'mascota/registro',
          name: 'registroMascota',
          component: () => import('./views/mascota/formulario.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/mascota',
          name: 'mascota',
          component: () => import('./views/mascota/index.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'mascota/modificar',
          name: 'modificarMascota',
          component: () => import('./views/mascota/formulario.vue'),
          props: (route) => ({ mascota: route.params.mascota })
        },
        {
          path: 'usuario/registro',
          name: 'registroUsuario',
          component: () => import('./views/usuario/formulario.vue')
        },
        {
          path: 'usuario/',
          name: 'usuario',
          component: () => import('./views/usuario/index.vue')
        },
        {
          path: 'usuario/modificar',
          name: 'modificarUsuario',
          component: () => import('./views/usuario/formulario.vue'),
          props: (route) => ({ usuario: route.params.usuario })
        },
        {
          path: 'donacion/registro',
          name: 'registroDonacion',
          component: () => import('./views/donacion/formulario.vue')
        },
        {
          path: 'donacion/',
          name: 'donaciones',
          component: () => import('./views/donacion/index.vue')
        },
        {
          path: 'donacion/modificar',
          name: 'modificarDonacion',
          component: () => import('./views/donacion/formulario.vue'),
          props: (route) => ({ donacion: route.params.donacion })
        },
        {
          path: 'albergue/registro',
          name: 'registroAlbergue',
          component: () => import('./views/albergue/formulario.vue')
        },
        {
          path: 'albergue/',
          name: 'albergues',
          component: () => import('./views/albergue/index.vue')
        },
        {
          path: 'albergue/modificar',
          name: 'modificarAlbergue',
          component: () => import('./views/albergue/formulario.vue'),
          props: (route) => ({ albergue: route.params.albergue })
        }
      ]
    },
    {
      path: '/',
      redirect: 'login',
      component: IndexLayout,
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import(/* webpackChunkName: "demo" */ './views/Login.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.path === '/auth0callback')) {
    Store.dispatch('auth0HandleAuthentication')
    next(false)
  }
  let routerAuthcheck = false
  if (localStorage.getItem('access_token') && localStorage.getItem('id_token')
      && localStorage.getItem('expires_at')) {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    routerAuthcheck = new Date().getTime() < expiresAt;
    console.log(new Date().getTime())
    console.log(expiresAt)
  }
  Store.commit('setUserIsAuthenticated', routerAuthcheck)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (routerAuthcheck) {
      next()
    } else {
      router.replace('/login')
    }

  } else {
    console.log(6)
    next() // make sure to always call next()!
  }
})

export default router;
