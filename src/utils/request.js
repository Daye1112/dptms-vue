import axios from 'axios'
import {Message} from 'element-ui'
import {stringify} from 'qs'
import router from '@/router'
import {getAccessToken, getRefreshToken} from '@/utils/auth'

const baseApi = process.env.VUE_APP_BASE_API;

// 自动转换data格式
const service = axios.create({
  baseURL: baseApi,
  timeout: 180000,
  responseType: 'json'
});

// 拦截处理
service.interceptors.request.use(
  config => {
    let accessToken = getAccessToken();
    let refreshToken = getRefreshToken();
    if (accessToken && refreshToken) {
      // 添加token
      config.headers['DptmsAccessToken'] = accessToken;
      config.headers['DptmsRefreshToken'] = refreshToken;
    }
    return config;
  },
  error => {
    return Promise.reject(error)
  }
);

service.interceptors.response.use(
  response => {
    return response.data
  },
  async error => {
    const {response} = error;
    const {code, message} = response.data;
    if (code) {
      switch (code) {
        case 400:
          Message.error(message || '业务处理异常');
          break;
        case 401:
          router.push('/login');
          Message.error(message || '请先登陆');
          break;
        case 403:
          Message.error(message || '权限不足');
          break;
        case 500:
          Message.error(message || '服务异常');
          break;
      }
    } else {
      Message.error('服务访问异常')
    }
    return Promise.reject(error)
  }
);

/**
 * 组装参数
 * @param params
 * @returns {string}
 */
function buildParam(params) {
  let _params;
  if (Object.is(params, undefined)) {
    _params = '';
  } else {
    _params = '?';
    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== null && params[key] !== '') {
        _params += `${key}=${params[key]}&`
      }
    }
    _params = _params.substring(0, _params.length - 1);
  }
  return _params;
}

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
    let _params = buildParam(params);
    return service.get(`${url}${_params}`)
  },
  upload(url, params, processFun = null) {
    return service.post(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        processFun && processFun(progressEvent);
      }
    })
  },
  download(url, params, processFun = null) {
    let _params = buildParam(params);
    return service.get(`${url}${_params}`, {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        processFun && processFun(progressEvent);
      }
    })
  }
};

export default request
