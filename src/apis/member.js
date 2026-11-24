import request from '@/utils/request'

// C 端会员接口（走网关 /c/member/* → cloud-admin /member/*）

/** 会员注册（匿名） */
export function memberRegister(data) {
  return request({ url: '/c/member/register', method: 'post', data })
}

/** 会员登录（匿名），返回 token + 会员信息 */
export function memberLogin(data) {
  return request({ url: '/c/member/login', method: 'post', data })
}

/** 会员登出 */
export function memberLogout() {
  return request({ url: '/c/member/logout', method: 'post' })
}

/** 当前登录会员信息（需会员 token） */
export function getMemberInfo() {
  return request({ url: '/c/member/info', method: 'get' })
}
