import request from '@/utils/request'

/**
 * 商品列表（分页 + 搜索）
 */
export function getProductList(params) {
  return request({
    url: '/admin/product/list',
    method: 'get',
    params,
  })
}
