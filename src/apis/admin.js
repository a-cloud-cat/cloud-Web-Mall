import request from '@/utils/request'

/**
 * 管理员分页列表
 */
export function getAdminList(params) {
  return request({
    url: '/admin/admin/list',
    method: 'get',
    params,
  })
}

/**
 * 新增管理员
 */
export function createAdmin(data) {
  return request({
    url: '/admin/admin/create',
    method: 'post',
    data,
  })
}

/**
 * 修改管理员
 */
export function updateAdmin(id, data) {
  return request({
    url: `/admin/admin/update/${id}`,
    method: 'post',
    data,
  })
}

/**
 * 删除管理员
 */
export function deleteAdmin(id) {
  return request({
    url: `/admin/admin/delete/${id}`,
    method: 'get',
  })
}
