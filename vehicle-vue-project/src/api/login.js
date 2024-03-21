//导入axios的方式，cmd use the command (npm install axios)
import axios from 'axios';
import request from '@/util/request.js'
const baseURL = 'http://localhost:8080';//create a baseURL to reduce the same URL
const instance = axios.create({baseURL});
export const userLoginService = (LoginUser)=>{
    const params = new URLSearchParams()
    for(let key in LoginUser)
    {
        params.append(key,LoginUser[key]);
    }
    return request.post('/user/login',params);
}