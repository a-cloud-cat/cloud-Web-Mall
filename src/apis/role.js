import request from '@/utils/request'

export function getRoleList(params) {
  return request({
    url: '/admin/role/list',
    method: 'get',
    params,
  })
}

export function getRole(id) {
  return request({
    url: `/admin/role/${id}`,
    method: 'get',
  })
}

export function createRole(data) {
  return request({
    url: '/admin/role/create',
    method: 'post',
    data,
  })
}

export function updateRole(id, data) {
  return request({
    url: `/admin/role/update/${id}`,
    method: 'post',
    data,
  })
}

export function deleteRole(id) {
  return request({
    url: `/admin/role/delete/${id}`,
    method: 'get',
  })
}
