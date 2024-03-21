import {createRouter,createWebHistory} from 'vue-router'
import loginVue from '@/views/user/login.vue';
import LayoutVue from '@/views/Layout.vue';
import registerVue from '@/views/user/register.vue';
import userInfoVue from '@/views/user/userinfo.vue';
import MenuVue from '@/views/Vehicle/list.vue';
import rentVue from '@/views/Renter/renter.vue'
const routes = [
    // {path:'/test', component:testVue},
    {path:'/user/register',component:registerVue},
    {path:'/user/login',component:loginVue},
    {   
        path:'/user',component:LayoutVue,redirect:'/user/userInfo',
        children: [
            {path:'/user/userInfo', component:userInfoVue},
            {path:'/Vehicle/list',component:MenuVue},
            {path:'/Renter/renterMessageList',component:rentVue}
        ]       

    }
]
//创建路由器
const router = createRouter({
    history:createWebHistory(),
    routes:routes
})
export default router