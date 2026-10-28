import request from '@/utils/request'

export function getMenuList(params) {
  return request({
    url: '/admin/menu/list',
    method: 'get',
    params,
  })
}

export function getMenu(id) {
  return request({
    url: `/admin/menu/${id}`,
    method: 'get',
  })
}

export function createMenu(data) {
  return request({
    url: '/admin/menu/create',
    method: 'post',
    data,
  })
}

export function updateMenu(id, data) {
  return request({
    url: `/admin/menu/update/${id}`,
    method: 'post',
    data,
  })
}

export function deleteMenu(id) {
  return request({
    url: `/admin/menu/delete/${id}`,
    method: 'get',
  })
}
