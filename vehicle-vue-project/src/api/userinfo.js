import axios from 'axios'
import request from '@/util/request.js'
const baseURL = 'http://localhost:8080'//create a baseURL to reduce the same URL
const instance = axios.create({baseURL})
export const userInfoService = ()=>{
    return request.get('/user/userInfo')
}
export const userUpdateService = (newUserInfo)=>{
    return request.post('/user/update',newUserInfo)
}
export const userPictureUpdateServer = (picture)=>{
    const params = new URLSearchParams()
    params.append('picture',picture)
    return request.patch('/user/updatePic',params)
}
export const userUpdatePasswordService = (newPasswordInfo)=>{
    return request.patch('/user/updatePassword',newPasswordInfo,{headers:{'Content-Type': 'application/json',},})
}