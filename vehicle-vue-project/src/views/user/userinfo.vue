<script setup>
import {ref} from 'vue'
import {SwitchFilled,CircleCheck,CircleClose} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {userInfoService,userPictureUpdateServer,userUpdateService} from '@/api/userinfo.js'
import {updateAllVehicleService} from '@/api/vehicle.js'
import useUserInfoStore from '@/store/userInfo.js'
import {useTokenStore} from '@/store/token.js'
//define a userInfoStore to store userdata
const userInfoStore = useUserInfoStore()
//define a data to be model with el-form
const userData = ref({  
    student_num:'',
    name:'',
    password:'',
    email:'',
    picture:'',
    phone:'',
    identity:''
})
const uploadRef = ref()
const userDefaultUrl= ref('https://vehicle-message.oss-cn-beijing.aliyuncs.com/default_user_picture.png')
const loading=ref(false)
const tokenStore = useTokenStore()
const userInfoShow = async()=>{
    //userInfoService can send a get request to server to get the user data
    let result = await userInfoService()
    //set userInfoStore
    userInfoStore.setInfo(result.data)
    userData.value=result.data
}
userInfoShow()
const updateUserInfo= async()=>{
    loading.value=true 
    //update the data in mysql
    if(userData.value.picture===null)
    {
        userData.value.picture=userDefaultUrl.value
    }
    let pictureResult = await userPictureUpdateServer(userData.value.picture)
    let result = await userUpdateService(userData.value)
    const params = new URLSearchParams()
    params.append('student_num',userData.value.student_num)
    params.append('name',userData.value.name)
    params.append('phone',userData.value.phone)
    let vehicleResult = await updateAllVehicleService(params)
    userInfoStore.info.picture = userData.value.picture
    if(result.code===0)
    {
        ElMessage.success('用户信息修改成功')
        setTimeout(function(){
        userInfoShow()
        loading.value=false
    },1000)
    }else{
        ElMessage.error('信息填写有误,请修改用户个人信息')
    }
    userData.value.picture=result.data
    userInfoStore.setInfo(result.data)
}
const uploadSuccess = (result)=>{
    userData.value.picture=result.data;
}
</script>
<template>
    <!-- 解决图片加载不了的问题，别人设置了网络安全 -->
    <meta name="referrer" content="no-referrer">
    <div class="userInfoDiv">
        <el-form class="userInfoForm" :model="userData" label-width="auto" v-loading="loading">
            <div class="HeadLineDiv">
                <el-icon :size="30" class="HeadLineIcon"><SwitchFilled /></el-icon>
                <h2 class="userInfoHeadLine">用户信息</h2>
            </div>
            <el-divider  class="divide1"/>
            <el-form-item label="学号/工号:">
                <el-input v-model="userData.student_num" disabled style="width: 400px" />
            </el-form-item>
            <el-form-item label="姓名:">
                <el-input v-model="userData.name" style="width: 400px" />
            </el-form-item>
            <el-form-item label="电子邮箱:">
                <el-input v-model="userData.email" style="width: 400px" />
            </el-form-item>
            <el-form-item label="图片:">
                <el-tooltip placement="right" content="点击图片后上传图片即可更新头像">
                    <el-upload 
                        ref="uploadRef"
                        class="avatar-uploader" 
                        action="/api/upload" 
                        :show-file-list="false" 
                        :auto-upload="true"
                        name="file"
                        :headers="{'Authorization':tokenStore.token}"
                        :on-success="uploadSuccess"
                        >
                        <el-avatar v-if="userData.picture" :size="100" fit="cover" :src="userData.picture" shape="square" />
                        <el-avatar v-else :size="100" fit="cover" :src="userDefaultUrl" shape="square" />
                    </el-upload>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="联系电话:">
                <el-input v-model="userData.phone" style="width: 400px" />
            </el-form-item>
            <el-form-item label="是否为管理员:">
                <el-icon v-if="userData.identity" :size="30" class="Icon"><CircleCheck /></el-icon>
                <el-icon v-else :size="30" class="Icon"><CircleClose /></el-icon>
            </el-form-item>
            <el-divider  class="divide2"/>
            <div align="center">
                <el-button type="primary" @click="updateUserInfo">保存</el-button>
            </div>
        </el-form>
    </div>
</template>
<style scoped> 
body{
    margin:0;
}
.userInfoDiv{
    /* border:1px solid salmon; */
    box-shadow: 0px 10px 10px grey;
    border-radius: 1%;
    padding-bottom: 0px;
    padding-left:0px;
    height:100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.userInfoForm{
    border: 2px solid #CFD3DC;
    border-radius: 2%;
    height:90%;
    width:40%;
}
.divide1{
    margin-top:1%;
    margin-bottom: 1%;
    border-style:"double";
    border-color: #CFD3DC;
}
.divide2{
    margin-top:0%;
    margin-bottom: 1%;
    border-style:"double";
    border-color: #CFD3DC;
}
.HeadLineDiv{
    display: flex;
    margin-top:0%;
    margin-bottom: 0%;
}
.HeadLineIcon{
    margin-top:0.8%;
    color:#31c6ef;
    padding-left:2%;
}
.Icon{
    display: flex;
    color:#31c6ef;
}
.userInfoHeadLine{
    color:#31c6ef;
    padding-left:2%;
}
.el-form-item{

    padding-left:2%;
    padding-right:2%;
    padding-top:0;
    padding-bottom: 1%;
    width:100%;
}
</style>




