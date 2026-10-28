import request from '@/utils/request'

export function getCategoryList(params) {
  return request({
    url: '/admin/productCategory/list',
    method: 'get',
    params,
  })
}

export function getCategory(id) {
  return request({
    url: `/admin/productCategory/${id}`,
    method: 'get',
  })
}

export function createCategory(data) {
  return request({
    url: '/admin/productCategory/create',
    method: 'post',
    data,
  })
}

export function updateCategory(id, data) {
  return request({
    url: `/admin/productCategory/update/${id}`,
    method: 'post',
    data,
  })
}

export function deleteCategory(id) {
  return request({
    url: `/admin/productCategory/delete/${id}`,
    method: 'get',
  })
}
