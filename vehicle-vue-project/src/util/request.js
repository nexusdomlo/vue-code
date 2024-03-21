//定制请求的实例
import axios from 'axios';
import { ElMessage } from 'element-plus';
const baseURL = '/api';//create a baseURL to reduce the same URL
const instance = axios.create({baseURL});
import { useTokenStore } from '@/store/token.js';

instance.interceptors.request.use(
    (config)=>{
        const tokenStore = useTokenStore();
        if(tokenStore.token){
            config.headers.Authorization = tokenStore.token
        }
        return config;
    },
    (err)=>{
        Promise.reject(err)
    }
)
import router from '@/router/Router.js'
//add a response interceptor
instance.interceptors.response.use(
    result=>{
        if(result.data.code === 0)
            return result.data;
        alert(result.data.message || '服务异常');
        ElMessage.error(result.data.message)
        return Promise.reject(result.data);
    },
    err=>{
        //判断401
        if(err.response.status===401){
            ElMessage.error('请先登录');
            router.push('/user/login')
        }else{  
            ElMessage.error('服务异常');
        }
        return Promise.reject(err);
    }
)
export default instance;//