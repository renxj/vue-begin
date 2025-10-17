import request from '@/api/http'

export function login(data) {
  return request({
    url: '/user/login.json',
    // method: 'post',
    method: 'get',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/user/info.json',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout.json',
    method: 'post'
  })
}