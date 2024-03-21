<script  lang="ts" setup>
import {ref,reactive} from "vue"
import type{FormRules} from 'element-plus'
import { Menu, Avatar,ArrowDown,Bell} from "@element-plus/icons-vue"
import {userInfoService,userUpdatePasswordService} from '@/api/userinfo.js'
import {useTokenStore} from '@/store/token.js'
import useUserInfoStore from '@/store/userInfo.js'
import router from "@/router/Router"
import { ElMessage } from "element-plus"
const userInfoStore = useUserInfoStore()
const tableData = ref({...userInfoStore.info})
const userInfoShow = async()=>{
    let result = await userInfoService()
    userInfoStore.setInfo(result.data)
    tableData.value=result.data
}
userInfoShow()
interface RuleForm{
    old_pwd:string
    new_pwd:string
    re_pwd:string
}
const updatePasswordData =  reactive<RuleForm>({
    old_pwd:'',
    new_pwd:'',
    re_pwd:''
})
const tokenStore = useTokenStore()
const dialogVisible=ref(false)
const updatePasswordServer = async()=>{
    dialogVisible.value=false
    let result = await userUpdatePasswordService(updatePasswordData)
    if(result.code===0)
    {
        tokenStore.removeToken()
        userInfoStore.removeInfo()
        router.push('/user/login')
        ElMessage.success("密码修改成功,请重新登录")
    }
    else{
        ElMessage.error(result.message)
    }
}
const exit = async()=>{
    tokenStore.removeToken()
    userInfoStore.removeInfo()
    router.push('/user/login')
    ElMessage.success("退出登录成功")
}
const userDefaultUrl= ref('https://vehicle-message.oss-cn-beijing.aliyuncs.com/default_user_picture.png')
</script>

<template>
    <el-dialog v-model="dialogVisible" title="修改密码" :model="updatePasswordData">
        <el-form label-width="auto" :model="updatePasswordData">
            <el-form-item label="旧密码:">
                <el-input v-model="updatePasswordData.old_pwd" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="新密码:">
                <el-input v-model="updatePasswordData.new_pwd"></el-input>
            </el-form-item>
            <el-form-item label="重新输入新密码:">
                <el-input v-model="updatePasswordData.re_pwd"></el-input>
            </el-form-item>
            <div align="right">
                <el-button type="primary" @click="updatePasswordServer" align="right">确定</el-button>
            </div>
        </el-form>
    </el-dialog>
    <el-container class="layout-container">
        <el-header class="Head">
            <el-menu class="LeadItem" mode="horizontal" router>
                <el-menu-item index="/user/userInfo" class="Leaditem1">
                    <el-icon><Avatar /></el-icon>
                    <span>个人中心</span>
                </el-menu-item>
                <el-menu-item index="/Vehicle/list" class="LeadMenu">
                    <el-icon><Menu /></el-icon>
                    <span>车辆信息</span>
                </el-menu-item>
                <el-menu-item index="/Renter/renterMessageList" class="LeadRent">
                    <el-icon><Bell /></el-icon>
                    <span>租借信息</span>
                </el-menu-item>
            </el-menu>
            <el-avatar class="LeadAvatar" :size="40" fit="cover" :src="tableData.picture?tableData.picture:userDefaultUrl" />
            <el-dropdown class="DropDown" trigger="click" size="large">
                <el-button type="primary">更多操作<el-icon><arrow-down /></el-icon></el-button>
                <template #dropdown>
                    <el-dropdown-item @click="dialogVisible=true">修改密码</el-dropdown-item>
                    <el-dropdown-item @click="exit">退出登录</el-dropdown-item>
                </template>
            </el-dropdown>
        </el-header>
        <el-container>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>

</template>
<style scoped>
body{
}
.layout-container{
    background-color: #fafafa;
    margin:0px;
    padding:0px;
    width:1920px;
    height:100%;
}
.Head{
    display: flex;
    height:10%;
    width: 100%;
    border-color: red;
}
.LeadItem{
    display: flex;
    width:40%
}
.Leaditem1{

    width:25%;
}
.LeadMenu{

    width:25%;
}
.LeadAvatar{
    margin-left: 56%;
    /* margin-right:2%; */
}
.DropDown{
    display: flex;
    margin-left:10px
}
.layout-container .el-header {
    align-content: center;
    align-items: center;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
    height: 7%
}
.layout-container .el-menu {
  border-right: none;
}
.layout-container .el-main {
    height:100%;
    background-color: #E5EAF3;
    border-color:blue;
}
.layout-container .toolbar {
    display: flex;
    height: 100%;
    padding-left:70%;
    align-content: center;
    align-items: center;
}


</style>