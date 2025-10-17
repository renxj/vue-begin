import request from '@/api/http'

// 获取菜单（支持基于角色/权限的筛选）
export function getMenu(params) {
  return request({
    url: '/menu.json',
    method: 'get',
    params
  })
}