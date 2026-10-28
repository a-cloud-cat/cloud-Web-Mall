import request from '@/utils/request'

/**
 * 品牌分页列表
 */
export function getBrandList(params) {
  return request({
    url: '/admin/brand/list',
    method: 'get',
    params,
  })
}

/**
 * 全部品牌（下拉用）
 */
export function getBrandListAll() {
  return request({
    url: '/admin/brand/listAll',
    method: 'get',
  })
}

/**
 * 新增品牌
 */
export function createBrand(data) {
  return request({
    url: '/admin/brand/create',
    method: 'post',
    data,
  })
}

/**
 * 修改品牌
 */
export function updateBrand(id, data) {
  return request({
    url: `/admin/brand/update/${id}`,
    method: 'post',
    data,
  })
}

/**
 * 删除品牌
 */
export function deleteBrand(id) {
  return request({
    url: `/admin/brand/delete/${id}`,
    method: 'get',
  })
}
