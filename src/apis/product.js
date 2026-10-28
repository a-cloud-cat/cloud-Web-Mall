import request from '@/utils/request'

/**
 * 商品分页列表
 */
export function getProductList(params) {
  return request({
    url: '/admin/product/list',
    method: 'get',
    params,
  })
}

/**
 * 商品详情
 */
export function getProduct(id) {
  return request({
    url: `/admin/product/${id}`,
    method: 'get',
  })
}

/**
 * 新增商品
 */
export function createProduct(data) {
  return request({
    url: '/admin/product/create',
    method: 'post',
    data,
  })
}

/**
 * 修改商品
 */
export function updateProduct(id, data) {
  return request({
    url: `/admin/product/update/${id}`,
    method: 'post',
    data,
  })
}

/**
 * 删除商品
 */
export function deleteProduct(id) {
  return request({
    url: `/admin/product/delete/${id}`,
    method: 'get',
  })
}
