
import axios from 'axios';
import request from '@/util/request.js'
const baseURL = 'http://localhost:8080';//create a baseURL to reduce the same URL
const instance = axios.create({baseURL});
export const userRegisterService = (registerUser)=>{
    //要改变registerUser的格式
    const params = new URLSearchParams()
    for(let key in registerUser){
        params.append(key,registerUser[key]);
    }
    return request.post('/user/register',params);
}