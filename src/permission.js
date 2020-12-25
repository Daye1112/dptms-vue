import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/getPageTitle'
import {resetRouter} from '@/router'

NProgress.configure({showSpinner: false})

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  document.title = getPageTitle(to.meta.title);

  const userRoutes = store.getters.userRoutes;
  if (userRoutes && userRoutes.length > 0) {
    next();
    return;
  }
  // 生成路由
  store.dispatch('permission/generateRoutes', [])
    .then((mainRoutes) => {
      // 解决再次登录路由重复添加的问题
      resetRouter();
      router.addRoutes(mainRoutes);
      next({...to, replace: true});
    });
})

router.afterEach(() => {
  NProgress.done()
})
