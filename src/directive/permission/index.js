import store from '@/store'

export default {
  install(Vue) {
    Vue.directive('permission', {
      bind(el, binding, vnode) {
        const {value} = binding;
        const menuCodeList = store.getters && store.getters.menuCodeList;
        if (value && value instanceof Array && value.length > 0) {
          const hasPermission = value.every(item =>
            menuCodeList.includes(item)
          )
          if (!hasPermission) {
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            } else {
              el.style.display = 'none';
            }
          }
        } else {
          throw new Error(`need permissions! Like v-permission="[STUDENT_ADD]"`)
        }
      }
    })
  }
}
