
<script lang="ts" setup>
import { reactive,ref} from 'vue'
import type{FormRules} from 'element-plus'
import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router'
import {useTokenStore} from '@/store/token.js'
import {userRegisterService} from '@/api/register.js'
import { userInfoService } from '@/api/userinfo'
import useUserInfoStore from '@/store/userInfo'
interface RuleForm{
    student_num:string
    name:string
    password:string
    rePassword:string
    email:string
    picture:string
    phone:string
    identity:Boolean
}
const User =  reactive<RuleForm>({
    student_num:'',
    name:'',
    password:'',
    rePassword:'',
    email:'',
    picture:'',
    phone:'',
    identity:false
})
const tokenStore = useTokenStore()
const validatePassword = (rule,value,callback)=>{
    if(User.rePassword==='')
        callback(new Error("请重复输入你要设置的密码"))
    else if(User.password !== User.rePassword){
        callback(new Error("两次输入的密码不一致"))
    }else{
        callback()
    }
}
const Invitation_code = ref('')
const rules = reactive<FormRules<RuleForm>>({
    student_num:[
        {required:true,message:'请输入您的学号/工号',trigger:'blur'},
        {min:8,max:16,message:'请输入您的学号/工号',trigger:'blur'}//如果失焦了(点了其他地方)，那么就展示message的信息
        ],
    password:[
        {required:true,message:'请输入你要设置的密码',trigger:'blur'},//如果失焦了，那么就展示message的信息
        {min:8,max:16,message:'密码为8至16位的任意字符',trigger:'blur'}
        ],
    rePassword:[
        {required:true,message:'请重复输入你要设置的密码',trigger:'blur'},
        {min:8,max:16,message:'密码为8至16位的任意字符',trigger:'blur'},
        {validator:validatePassword,trigger:'blur'}//判断是否和第一次密码一致
        ],
})
const router = useRouter()
const userDefaultUrl= ref('https://vehicle-message.oss-cn-beijing.aliyuncs.com/default_user_picture.png')
const registerSubmit = async()=>{
    if(User.identity===true&&Invitation_code.value!='30624770')
    {
        ElMessage.error('邀请码有误,请重新输入')
        return
    }
    let result = await userRegisterService(User)
    //if message have value,we should return the message,else return "register success"
    if(result.code===0){
        ElMessage.success('注册成功,请登录')
        tokenStore.setToken(result.data)//存储token
        router.push('/user/login')
    }
    else{
        ElMessage.error('信息填写有误,请重新修改你的个人信息')
    }
}
const returnLogin = async()=>{
    router.push('/user/login')
}
</script>
<template>
    <div class="register-box">
        <el-form :label-position="right" class="register-form" :model="User" label-width="auto" style="max-width: 600px" :rules="rules">
            <h2 class="register-form-headline" style="color:#409EFF">用户注册</h2>
            <el-form-item label="学号/工号:" prop="student_num">
                <el-input v-model="User.student_num" placeholder="请输入你的工号或学号"/>
            </el-form-item>
            <el-form-item label="密码:" prop="password">
                <el-input v-model="User.password" placeholder="请输入你的密码" show-password/>
            </el-form-item>
            <el-form-item label="请再次输入密码:" prop="rePassword">
                <el-input v-model="User.rePassword" placeholder="请再次输入你的密码" show-password/>
            </el-form-item>
            <el-form-item label="是否为管理员">
                <el-switch v-model="User.identity" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"></el-switch>
            </el-form-item>
            <el-form-item label="邀请码" v-if="User.identity===true">
                <el-tooltip placement="bottom" content="要成为管理员就要输入相应的邀请码">
                    <el-input placeholder="请输入邀请码" v-model="Invitation_code"/>
                </el-tooltip>
            </el-form-item>
            <div align="right">
                <el-tooltip placement="bottom" content="学号/工号与密码必填">   
                    <el-button class="button" type="success" plain size="large" @click="registerSubmit">注册</el-button>
                </el-tooltip>
                <el-button  type="warning" plain size="large" @click="returnLogin">登录</el-button>
            </div>
        </el-form>
    </div>

</template>
<style scoped>
.register-box{
    background-image:url(https://vehicle-message.oss-cn-beijing.aliyuncs.com/register_background.jpg);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    height:100%;
    width: 1920px;
    display: flex;
    position :absolute;
    display: flex;
    justify-content: center;
    align-items: center;
}
.register-form{
    opacity: 0.75;
    width: 450px;
    padding-top: 50px;
    padding-bottom: 70px;
    padding-left:70px;
    padding-right:70px;
    background: #CFD3DC;
    box-sizing:border-box;
    box-shadow: 0 15px 25px rgba(0, 0, 0, -6);
    border-radius: 10px;

}
.el-form-item{
    padding-bottom: 5px;
}
.register-form-headline{
    padding-bottom: 40px;
    align-items:center;
    text-align: center;
}
</style>
