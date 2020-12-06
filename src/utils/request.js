import axios from 'axios'
import {Message} from 'element-ui'
import {stringify} from 'qs'
import router from '@/router'
import {getRefreshToken, getToken} from '@/utils/auth'

const baseApi = process.env.VUE_APP_BASE_API // '/auth/vCode'

// 自动转换data格式
const service = axios.create({
  baseURL: baseApi,
  timeout: 10000,
  responseType: 'json'
})

// 拦截处理
service.interceptors.request.use(
  config => {
    let token = getToken();
    let refresh = getRefreshToken();
    if (token && refresh) {
      // 添加token
      config.headers['DptmsAccessToken'] = token;
      config.headers['DptmsRefreshToken'] = refresh;
    }
    return config;
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    // console.log('请求成功')
    return response.data
  },
  async error => {
    // console.log('请求失败', error)
    const {response} = error
    const {code, message} = response.data
    if (code) {
      switch (code) {
        case 400:
          Message.error(message || '业务处理异常')
          break
        case 401:
          // await store.dispatch('user/logout')
          router.push('/login')
          Message.error(message || '请先登陆')
          break
        case 403:
          router.push('/')
          Message.error(message || '权限不足')
          break
        case 500:
          Message.error(message || '服务异常')
          break
      }
    } else {
      Message.error('服务访问异常')
    }
    return Promise.reject(error)
  }
)

const request = {
  post(url, params) {
    return service.post(url, params, {
      transformRequest: [(params) => {
        return stringify(params);
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  get(url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (const key in params) {
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return service.get(`${url}${_params}`)
  }
}

export default request
export const { get: axiosGet } = request
export const { post: axiosPost } = request
