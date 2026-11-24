const TOKEN_KEY = 'cloud_mall_token'
const USERNAME_KEY = 'cloud_mall_username'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function getUsername() {
  return localStorage.getItem(USERNAME_KEY)
}
export function setUsername(username) {
  localStorage.setItem(USERNAME_KEY, username)
}
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USERNAME_KEY)
}

// ===== C 端会员（与管理员 token 分开存储）=====
const MEMBER_TOKEN_KEY = 'cloud_mall_member_token'
const MEMBER_INFO_KEY = 'cloud_mall_member_info'

export function getMemberToken() {
  return localStorage.getItem(MEMBER_TOKEN_KEY)
}
export function setMemberToken(token) {
  localStorage.setItem(MEMBER_TOKEN_KEY, token)
}
export function getMemberInfo() {
  const raw = localStorage.getItem(MEMBER_INFO_KEY)
  return raw ? JSON.parse(raw) : null
}
export function setMemberInfo(info) {
  localStorage.setItem(MEMBER_INFO_KEY, JSON.stringify(info))
}
export function clearMemberAuth() {
  localStorage.removeItem(MEMBER_TOKEN_KEY)
  localStorage.removeItem(MEMBER_INFO_KEY)
}
