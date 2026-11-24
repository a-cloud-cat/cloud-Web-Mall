import request from '@/utils/request'

export function getOrderList(params) {
  return request({
    url: '/admin/order/list',
    method: 'get',
    params,
  })
}

export function getOrder(id) {
  return request({
    url: `/admin/order/${id}`,
    method: 'get',
  })
}

export function getOrderBySn(orderSn) {
  return request({
    url: `/admin/order/sn/${orderSn}`,
    method: 'get',
  })
}

export function createOrder(data) {
  return request({
    url: '/admin/order/create',
    method: 'post',
    data,
  })
}

export function deliveryOrder(id, data) {
  return request({
    url: `/admin/order/delivery/${id}`,
    method: 'post',
    data,
  })
}

export function updateOrder(id, data) {
  return request({
    url: `/admin/order/update/${id}`,
    method: 'post',
    data,
  })
}

export function deleteOrder(id) {
  return request({
    url: `/admin/order/delete/${id}`,
    method: 'get',
  })
}
