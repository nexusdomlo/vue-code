
<script lang="ts" setup>
import { reactive} from 'vue'
import type{FormRules} from 'element-plus'
import { ElMessage } from 'element-plus'
import {useTokenStore} from '@/store/token.js'
import {userLoginService}from '@/api/login.js'
import {useRouter} from 'vue-router'
interface RuleForm{
    student_num:string
    password:string
}
const tokenStore = useTokenStore()
const router = useRouter()
const User = reactive<RuleForm>({
    student_num:'',
    password:''
})
const loginRules =  reactive<FormRules<RuleForm>>({
    student_num:[
        {required:true,message:'请输入您的学号/工号',trigger:'blur'},
        {min:8,max:16,message:'请输入您的学号/工号',trigger:'blur'}//如果失焦了(点了其他地方)，那么就展示message的信息
        ],
    password:[
        {required:true,message:'请输入你要设置的密码',trigger:'blur'},//如果失焦了，那么就展示message的信息
        {min:8,max:16,message:'密码为8至16位的任意字符',trigger:'blur'}
        ],
})
const loginSubmit = async()=>{
    let loginResult = await userLoginService(User);
    //if message have value,we should return the message,else return "register success"
    if(loginResult.code===0)
    {
        router.push('/user')
        ElMessage.success('登录成功');
        tokenStore.setToken(loginResult.data)//存储token
    }else{
        ElMessage.error('登录失败，请检查学号/工号、密码是否输入正确');
    }
}
const returnRegister = async()=>{
    router.push('/user/register')
}
</script>
<template>
    <!-- 登录表单 -->
    <meta name="referrer" content="no-referrer">
    <div class="login-box">
        <el-form class="login-form" :model="User" label-width="auto" style="max-width: 600px; margin: 0 auto"  :rules="loginRules" hide-required-asterisk="true">
            <h2 class="login-form-headline" style="color:#409EFF">用户登录</h2>
            <el-form-item label="学号/工号:" prop="student_num">
                <el-input v-model="User.student_num" placeholder="请输入你的工号或学号"/>
            </el-form-item>
            <el-form-item label="密码:" prop="password">
                <el-input v-model="User.password" placeholder="请输入你的密码" show-password/>
            </el-form-item>
            <div align="right">             
                <el-button class="button" type="success" plain size="large" @click="loginSubmit">登录</el-button>
                <el-button type="warning" @click="returnRegister" plain size="large">注册</el-button>
            </div>

        </el-form>
    </div>

</template>
<style scoped>

body{
    /*兼容浏览器版本*/
    -webkit-background-size: cover;
    -o-background-size: cover;                
    background-size: cover;
    margin:0;
}
.login-box{
    background-image: url(https://vehicle-message.oss-cn-beijing.aliyuncs.com/login_background.jpg);
    background-size: 100% 100%;                
    height:100vh;
    width: 1920px;
    display: flex;
    position :absolute;
    justify-content: center;
    align-items: center;
}
.login-form{
    opacity: 0.8;
    width: 450px;
    padding-top: 50px;
    padding-bottom: 70px;
    padding-left:70px;
    padding-right:70px;
    background: #1D1D1D;
    box-sizing:border-box;
    box-shadow: 0 15px 25px rgba(0, 0, 0, -6);
    border-radius: 10px;
}
.el-form-item{
    padding-bottom: 10px;
}
.login-form-headline{
    padding-bottom: 40px;
    align-items:center;
    text-align: center;
}
</style>