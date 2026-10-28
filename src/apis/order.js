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
