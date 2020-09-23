import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getTokens(key) {
  return Cookies.get(key)
}

export function setTokens(key,token) {
  return Cookies.set(key, token)
}

export function removeTokens(key) {
  return Cookies.remove(key)
}