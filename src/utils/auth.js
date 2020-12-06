import Cookies from 'js-cookie'

const TokenKey = 'DptmsAccessToken'
const RefreshTokenKey = 'DptmsRefreshToken'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}

export function removeVuex() {
  return window.sessionStorage.removeItem('vuex')
}
