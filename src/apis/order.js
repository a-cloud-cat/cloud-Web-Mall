import request from '@/utils/request'

// ===== B 端（需登录）=====
export function getOrderList(params) {
  return request({ url: '/admin/order/list', method: 'get', params })
}
export function getOrder(id) {
  return request({ url: `/admin/order/${id}`, method: 'get' })
}
export function deliveryOrder(id, data) {
  return request({ url: `/admin/order/delivery/${id}`, method: 'post', data })
}
export function updateOrder(id, data) {
  return request({ url: `/admin/order/update/${id}`, method: 'post', data })
}
export function deleteOrder(id) {
  return request({ url: `/admin/order/delete/${id}`, method: 'get' })
}

// ===== C 端（匿名可访问）=====
export function cGetOrderBySn(orderSn) {
  return request({ url: `/c/order/sn/${orderSn}`, method: 'get' })
}
export function cCreateOrder(data) {
  return request({ url: '/c/order/create', method: 'post', data })
}
