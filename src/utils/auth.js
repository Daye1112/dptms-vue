import Cookies from 'js-cookie'

const tokenKey = 'DptmsAccessToken'
const refreshTokenKey = 'DptmsRefreshToken'

export function getAccessToken() {
  return Cookies.get(tokenKey)
}

export function removeAccessToken() {
  return Cookies.remove(tokenKey)
}

export function getRefreshToken() {
  return Cookies.get(refreshTokenKey)
}

export function removeRefreshToken() {
  return Cookies.remove(refreshTokenKey)
}

export function removeVuex() {
  return window.sessionStorage.removeItem('vuex')
}
