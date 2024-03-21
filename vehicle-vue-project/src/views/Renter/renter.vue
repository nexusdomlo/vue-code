<script lang="ts" setup>
import {ref} from 'vue'
import { ElMessage } from 'element-plus'
const userInfoStore = useUserInfoStore()
import useUserInfoStore from '@/store/userInfo.js'
import {useTokenStore} from '@/store/token.js'
import {updateRenterService,RenterListService,findBorrowService,removeRenterService} from '@/api/renter'
import {updateVehicleStateService} from '@/api/vehicle.js'
const tokenStore = useTokenStore()
const RenterMessage = ref({
    student_num:'',
    car_id:'',
    car_name:'',
    phone:'',
    renter:'',
    answer:''
})
const BorrowMessage = ref({
    student_num:'',
    car_id:'',
    car_name:'',
    phone:'',
    renter:'',
    answer:''
})
const rentBell = async()=>{
    RenterMessage.value=await (await RenterListService()).data
}
const borrowBell = async()=>{
    BorrowMessage.value=await (await findBorrowService()).data
}
rentBell()
borrowBell()
const temporaryRenterMessage = ref({
    student_num:'',
    car_id:'',
    car_name:'',
    phone:'',
    renter:'',
    answer:''
})
const allowRent =  async(car_id,state)=>{
    temporaryRenterMessage.value=await(await RenterListService()).data
    temporaryRenterMessage.value.answer='Yes'
    let RenterResult = await updateRenterService(temporaryRenterMessage.value)
    const params = new URLSearchParams()
    params.append('car_id',car_id)
    params.append('state',state)
    let result = await updateVehicleStateService(params)
    if(RenterResult.code===0&&result.code===0)
    {
        ElMessage.success("操作成功")
    }else{
        ElMessage.error("操作失败")
    }
    rentBell()
    borrowBell()
}
const refuseRent = async(car_id,state)=>{
    temporaryRenterMessage.value=await(await RenterListService()).data
    temporaryRenterMessage.value.answer='No'
    let RenterResult = await updateRenterService(temporaryRenterMessage.value)
    const params = new URLSearchParams()
    params.append('car_id',car_id)
    params.append('state',state)
    let result = await updateVehicleStateService(params)
    if(result.code===0)
    {
        ElMessage.success("操作成功")
    }else{
        ElMessage.error("操作失败")
    }
    rentBell()
    borrowBell()  
}
const removeRent = async(car_id)=>{
    const params = new URLSearchParams()
    params.append('car_id',car_id)
    params.append('state','正常')
    let result1 = await updateVehicleStateService(params)
    let result2 = await removeRenterService(car_id)
    if(result1.code===0&&result2.code===0)
    {
        ElMessage.success("操作成功")
    }else{
        ElMessage.error("操作失败")
    }
    rentBell()
    borrowBell()
}
</script>

<template>
<div class="group">
    <el-card class="card1">
        <template #header>
        <div class="card-header">
            <span>借用信息</span>
        </div>
        </template>
        <el-form label-width="auto">
            <el-form-item label="学号/工号:">
                <el-input v-model="RenterMessage.student_num" disabled style="width: 400px" />
            </el-form-item>
            <el-form-item label="电瓶车牌号:">
                <el-input v-model="RenterMessage.car_id" disabled style="width: 400px" />
            </el-form-item>
            <el-form-item label="电瓶车品牌:">
                <el-input v-model="RenterMessage.car_name" disabled style="width: 400px" />
            </el-form-item>
            <el-form-item label="联系电话:">
                <el-input v-model="RenterMessage.phone" disabled style="width: 400px" />
            </el-form-item>
            <el-form-item label="租借人:">
                <el-input v-model="RenterMessage.renter" disabled style="width: 400px" />
            </el-form-item>    
            <div align="center">
                <el-button v-if="RenterMessage.answer==='wait'" type="success" @click="allowRent(RenterMessage.car_id,'租借中')">允许</el-button>
                <el-button v-if="RenterMessage.answer==='wait'" type="danger" @click="refuseRent(RenterMessage.car_id,'正常')">拒绝</el-button>
                <el-button v-if="RenterMessage.answer==='Yes'" type="danger" @click="removeRent(RenterMessage.car_id)">结束借用</el-button>
            </div>
        </el-form>
    </el-card>
    <el-card  class="card1">
        <template #header>
            <div class="card-header">
                <span>租用信息</span>
            </div>
        </template>
        <el-form label-width="auto">
            <el-form-item label="租用电瓶车车主学号/工号:">
                <el-input v-model="BorrowMessage.student_num" disabled style="width: 400px" />
            </el-form-item>
            <el-form-item label="租用电瓶车车主电瓶车牌号:">
                <el-input v-model="BorrowMessage.car_id" disabled style="width: 400px" />
            </el-form-item>
            <el-form-item label="租用电瓶车车主电瓶车品牌:">
                <el-input v-model="BorrowMessage.car_name" disabled style="width: 400px" />
            </el-form-item>
            <el-form-item label="租用电瓶车车主联系电话:">
                <el-input v-model="BorrowMessage.phone" disabled style="width: 400px" />
            </el-form-item>
            <el-form-item label="租借人:">
                <el-input v-model="BorrowMessage.renter" disabled style="width: 400px" />
            </el-form-item>    
            <el-form-item label="车主回复:">
                <el-input v-model="BorrowMessage.answer" disabled style="width: 400px" />
            </el-form-item>
            <div align="right">
                <el-button v-if="BorrowMessage.answer==='Yes'" type="warning" round @click="removeRent(BorrowMessage.car_id)">结束租用</el-button>
            </div>
        </el-form>
    </el-card>
</div>
 
</template>

<style scoped>
.group{
    display: flex;
}
.card1{
    margin-left:10%;
    margin-right: 10%;
}
</style>