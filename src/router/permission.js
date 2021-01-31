import router from '.'
import store from '../store'
import {Message} from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/getPageTitle'
import {resetRouter} from '@/router'
import {getRefreshToken, getAccessToken} from '../utils/auth'

NProgress.configure({showSpinner: false})

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  document.title = getPageTitle(to.meta.title);

  const hasToken = getAccessToken() && getRefreshToken();
  if (hasToken) {
    // 登录成功
    if (to.path === '/login') {
      // next({path: '/'});
      next();
      NProgress.done();
    } else {
      // 获取用户信息(权限)
      const mainRoutes = store.getters.mainRoutes;
      const hasPermission = mainRoutes && mainRoutes.length > 0;
      if (hasPermission) {
        next();
      } else {
        // 没有权限（第一次登陆 or 刷新）
        try {
          // 获取用户信息
          await Promise.all([
            store.dispatch('user/getInfo'),
            store.dispatch('user/getMenuList')
          ])
          const menuCodeList = store.getters.menuCodeList;
          // 生成路由
          store.dispatch('permission/generateRoutes', menuCodeList)
            .then((mainRoutes) => {
              // 解决再次登录路由重复添加的问题
              resetRouter();
              router.addRoutes(mainRoutes);
              next({...to, replace: true});
            });
        } catch (error) {
          // 失败，说明有错
          await store.dispatch('user/resetToken');
          Message.error(error);
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    // 没有token，判断是否是白名单路由
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      // 不是，跳转到登录页
      next('/login');
      NProgress.done();
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
