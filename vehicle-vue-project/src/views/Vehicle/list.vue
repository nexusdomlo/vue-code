<script lang="ts" setup>
import {ref} from 'vue'
import {Edit,Delete,Search,Share,Warning,RefreshRight} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {vehicleListService,addVehicleService,updateVehicleService,updateVehiclePictureService,removeVehicleService,vehicleMessageSerach} from '@/api/vehicle.js'
import {randomCarId} from '@/util/carIdProduce.js'
import {addRenterService,updateRenterService,RenterListService, removeRenterService} from '@/api/renter.js'
import {userInfoService} from '@/api/userinfo.js'
import useUserInfoStore from '@/store/userInfo.js'
import {useTokenStore} from '@/store/token.js'
const addDrawer = ref(false)
const editDrawer = ref(false)
const dialogVisible = ref(false)
//use the tableData to store the list data
const tableData = ref([])
const pageNum = ref(1)
const total = ref(20)
const pageSize = ref(5)
const loading = ref(false)
const tokenStore = useTokenStore();
const uploadRef = ref()
const userInfoStore = useUserInfoStore()
const vehicle = useUserInfoStore()
const vehicleDefaultUrl="https://vehicle-message.oss-cn-beijing.aliyuncs.com/default_vehicle_picture.png"
//a temporary data to store a row data
const rowVehicleMessage = ref({
  student_num:'',
  name:'',
  car_id:'',
  car_name:'',
  car_picture:'',
  phone:'',
  create_time:'',
  expire_time:'',
  position:'',
  state:''
})
//a temporary data to store a data to add vehicle-message
const vehicleDetailMessage = ref({
  student_num:'',
  name:'',
  car_id:'',
  car_name:'',
  car_picture:'',
  phone:'',
  create_time:'',
  expire_time:'',
  position:'',
  state:''
})
const searchVehicleData = ref({
  student_num:'',
  name:'',
  car_id:'',
  car_name:'',
  car_picture:'',
  phone:'',
  create_time:'',
  expire_time:'',
  position:'',
  state:''
})
//get userinfo and set the default vehicleMessage
//vehicle message list and reset vehicle-data
const listShow = async()=>{
  let result=await vehicleListService()
  tableData.value = result.data
  let userInforesult = await userInfoService()
  userInfoStore.setInfo(userInforesult.data)
  vehicleDetailMessage.value.student_num=userInfoStore.info.student_num
  vehicleDetailMessage.value.name=userInfoStore.info.name
  vehicleDetailMessage.value.car_picture=vehicleDefaultUrl
  vehicleDetailMessage.value.phone=userInfoStore.info.phone
}
listShow()
const addPictureUpload = (result)=>{
  //result will be set as the vehicleDetailMessage.value.car_picture
  vehicleDetailMessage.value.car_picture=result.data
}
const updatePictureUpload = async(result)=>{
  rowVehicleMessage.value.car_picture=result.data
}
const RenterMessage = ref({
  student_num:'',
  car_id:'',
  car_name:'',
  phone:'',
  renter:'无',
  answer:'',
})
//vehicle message add function
const addVehicle = async()=>{
  if(vehicleDetailMessage.value.expire_time===null||vehicleDetailMessage.value.expire_time==="")
  {
    ElMessage.error('请设定车牌到期时间')
    return
  }
  vehicleDetailMessage.value.car_id=randomCarId()
  vehicleDetailMessage.value.state='正常'
  loading.value=true
  addDrawer.value=false
  const params = new URLSearchParams()
  params.append('car_picture',vehicleDetailMessage.value.car_picture)
  params.append('car_id',vehicleDetailMessage.value.car_id)
  let result =await addVehicleService(vehicleDetailMessage.value)
  let pictureResult = await updateVehiclePictureService(params)
  loading.value=false
  //show the datail response message
  if(result.code===0&&pictureResult.code===0)
  {
    ElMessage.success("添加成功")
  }else if(pictureResult===1){
    ElMessage.success("车辆信息添加成功，图片上传失败")
  }else{
    ElMessage.error(result.message)
  }
  setTimeout( function(){
    loading.value=false
    listShow()
  },1000);
}
const temporaryRenter = ref({
  student_num:'',
  car_id:'',
  car_name:'',
  phone:'',
  renter:'',
  answer:'',
})
//a function and a temporary row vehicle data to help edit data
const updateVehicleDrawer = (row)=>{
  if(row.student_num!==userInfoStore.info.student_num&&userInfoStore.info.identity===false)
  {
    ElMessage.error("抱歉,你不可编辑他人的电瓶车信息")
    return
  }
  rowVehicleMessage.value.name=row.name
  rowVehicleMessage.value.student_num=row.student_num
  rowVehicleMessage.value.car_id=row.car_id
  rowVehicleMessage.value.car_name=row.car_name
  rowVehicleMessage.value.car_picture=row.car_picture
  rowVehicleMessage.value.phone=row.phone
  rowVehicleMessage.value.create_time=row.create_time
  rowVehicleMessage.value.expire_time=row.expire_time
  rowVehicleMessage.value.position=row.position
  rowVehicleMessage.value.state=row.state
  editDrawer.value=true
}
//update vehicle data
const updateVehicle = async()=>{
  loading.value=true
  editDrawer.value=false
  const params = new URLSearchParams()
  params.append('car_picture',rowVehicleMessage.value.car_picture)
  params.append('car_id',rowVehicleMessage.value.car_id)
  let pictureResult = await updateVehiclePictureService(params)
  //update Renter 有可能没有租借
  if(RenterListService()!=null)
  {
    temporaryRenter.value=(await RenterListService()).data
    temporaryRenter.value.car_name=rowVehicleMessage.value.car_name
    temporaryRenter.value.phone=rowVehicleMessage.value.phone
    let RenterResult = await updateRenterService(temporaryRenter.value)
  }
  //vehicleMessage update
  let result =await updateVehicleService(rowVehicleMessage.value)
  //show the datail response message
  if(result.code===0&&pictureResult.code===0)
  {
    ElMessage.success("修改成功")
  }else if(pictureResult===1){
    ElMessage.success("车辆信息修改成功，图片上传失败")
  }else{
    ElMessage.error(result.message)
  }
  setTimeout( function(){
    loading.value=false
    listShow()
  },1000);
}
//remove vehicle data
const temporaryPasswordData = ref({
  password:''
})
const searchVehicle = async()=>{
  let params = {
    pageNum:pageNum.value,
    pageSize:pageSize.value,
    student_num:searchVehicleData.value.student_num?searchVehicleData.value.student_num:null,
    name:searchVehicleData.value.name?searchVehicleData.value.name:null,
    car_id:searchVehicleData.value.car_id?searchVehicleData.value.car_id:null,
    car_name:searchVehicleData.value.car_name?searchVehicleData.value.car_name:null,
    car_picture:searchVehicleData.value.car_picture?searchVehicleData.value.car_picture:null,
    phone:searchVehicleData.value.phone?searchVehicleData.value.phone:null,
    position:searchVehicleData.value.position?searchVehicleData.value.position:null,
    state:searchVehicleData.value.state?searchVehicleData.value.state:null
  }
  let result = await vehicleMessageSerach(params)
  tableData.value=result.data.items
}
const onSizeChange = (size) =>{
  pageSize.value = size
}
const onCurrentChange = (num)=>{
  pageNum.value = num
}
const openDialog = (row)=>{
  if(row.student_num!==userInfoStore.info.student_num&&userInfoStore.info.identity===false)
  {
    ElMessage.error("抱歉,你不可删除他人的电瓶车信息")
    return
  }else{
    dialogVisible.value=true
    rowVehicleMessage.value.name=row.name
    rowVehicleMessage.value.student_num=row.student_num
    rowVehicleMessage.value.car_id=row.car_id
    rowVehicleMessage.value.car_name=row.car_name
    rowVehicleMessage.value.car_picture=row.car_picture
    rowVehicleMessage.value.phone=row.phone
  }
}
const removeVehicle = async()=>{
  dialogVisible.value=false
  loading.value=true
  let result = await removeVehicleService(rowVehicleMessage.value.car_id)
  if(RenterListService()!=null)
  {
    let RentResult = await removeRenterService(rowVehicleMessage.value.car_id)
  }
  //show the datail response message
  if(result.code===0)
  {
    ElMessage.success("修改成功")
  }else{
    ElMessage.error(result.message)
  }
  setTimeout( function(){
    loading.value=false
    listShow()
  },1000);
}
const disabledDate = (time: Date)=>{
  return time.getTime() < Date.now()
}
//decide a opertion can not be choose
const disableSelect = ref(true)
const positionOptions = [
  {
    value:'泰山区',
    label:'泰山区',
    children:[
      {
        value:'1栋',
        label:'1栋',
      },
            {
        value:'2栋',
        label:'2栋',
      },
            {
        value:'3栋',
        label:'3栋',
      },
            {
        value:'4栋',
        label:'4栋',
      },
            {
        value:'5栋',
        label:'5栋',
      },
            {
        value:'6栋',
        label:'6栋',
      }
    ]
  },
    {
    value:'启林南',
    label:'启林南',
    children:[
      {
        value:'1栋',
        label:'1栋',
      },
            {
        value:'2栋',
        label:'2栋',
      },
            {
        value:'3栋',
        label:'3栋',
      },
            {
        value:'4栋',
        label:'4栋',
      },
            {
        value:'5栋',
        label:'5栋',
      },
            {
        value:'6栋',
        label:'6栋',
      }
    ]
  },
    {
    value:'燕山区',
    label:'燕山区',
    children:[
      {
        value:'1栋',
        label:'1栋',
      },
            {
        value:'2栋',
        label:'2栋',
      },
            {
        value:'3栋',
        label:'3栋',
      },
            {
        value:'4栋',
        label:'4栋',
      },
            {
        value:'5栋',
        label:'5栋',
      },
            {
        value:'6栋',
        label:'6栋',
      }
    ]
  },
    {
    value:'华山区',
    label:'华山区',
    children:[
      {
        value:'1栋',
        label:'1栋',
      },
            {
        value:'2栋',
        label:'2栋',
      },
            {
        value:'3栋',
        label:'3栋',
      },
            {
        value:'4栋',
        label:'4栋',
      },
            {
        value:'5栋',
        label:'5栋',
      },
            {
        value:'6栋',
        label:'6栋',
      }
    ]
  },
]
const stateOptions = [
  {
    value:'租借中',
    label:'租借中',
  },
  {
    value:'申请中',
    label:'申请中',
  },
  {
    value:'正常',
    label:'正常',
  },
  {
    value:'待维修',
    label:'待维修',
  },
  {
    value:''
  }
]
const handleChange1 =(value)=>{
  vehicleDetailMessage.value.position=value[0]+value[1]
}
const handleChange2 = (value)=>{
  vehicleDetailMessage.value.state=value[0]
}
const handleChange3 = (value)=>{
  rowVehicleMessage.value.position=value[0]+value[1]
}
const handleChange4 = (value)=>{
  rowVehicleMessage.value.state=value[0]
}
const handleChange5 = (value)=>{
  searchVehicleData.value.position = value[0]+value[1]
}
const handleChange6 = (value)=>{
  searchVehicleData.value.state=value[0]
}
const rentState = async(row)=>{
  if(row.student_num===userInfoStore.info.student_num)
  {
    ElMessage.error('抱歉,你不可租借自己的车辆')
  }
  else if(row.state==='租借中'||row.state==='申请中'){
    ElMessage.error('抱歉,车辆已被租用或被申请')
  }else if(row.state==='待维修'){
    ElMessage.error('抱歉,车辆待维修,不可被租用')
  }else if(row.state==='正常'){
    rowVehicleMessage.value.name=row.name
    rowVehicleMessage.value.student_num=row.student_num
    rowVehicleMessage.value.car_id=row.car_id
    rowVehicleMessage.value.car_name=row.car_name
    rowVehicleMessage.value.car_picture=row.car_picture
    rowVehicleMessage.value.phone=row.phone
    rowVehicleMessage.value.create_time=row.create_time
    rowVehicleMessage.value.expire_time=row.expire_time
    rowVehicleMessage.value.position=row.position
    rowVehicleMessage.value.state='申请中'
    //RenterData set
    RenterMessage.value.student_num=rowVehicleMessage.value.student_num
    RenterMessage.value.car_id=rowVehicleMessage.value.car_id
    RenterMessage.value.car_name=rowVehicleMessage.value.car_name
    RenterMessage.value.phone=rowVehicleMessage.value.phone
    RenterMessage.value.renter=userInfoStore.info.student_num
    RenterMessage.value.answer='wait'
    let RenterResult = await addRenterService(RenterMessage.value)
    let result =await updateVehicleService(rowVehicleMessage.value)
    if(result.code===0&&RenterResult.code===0)
    {
      ElMessage.success("已提交申请,正在等待车主许可")
    }else{
      ElMessage.error(result.message)
    }
    listShow()
  }
}
const maintainState = async(row)=>{
  if(row.student_num!=userInfoStore.info.student_num)
  {
    ElMessage.error('抱歉,你不可将他人车辆设置为待维修的状态')
  }
  else if(row.state==='租借中'||row.state==='申请中'){
    ElMessage.error('抱歉,车辆已被租用或被申请')
  }else if(row.state==='待维修'){
    rowVehicleMessage.value.name=row.name
    rowVehicleMessage.value.student_num=row.student_num
    rowVehicleMessage.value.car_id=row.car_id
    rowVehicleMessage.value.car_name=row.car_name
    rowVehicleMessage.value.car_picture=row.car_picture
    rowVehicleMessage.value.phone=row.phone
    rowVehicleMessage.value.create_time=row.create_time
    rowVehicleMessage.value.expire_time=row.expire_time
    rowVehicleMessage.value.position=row.position
    rowVehicleMessage.value.state='正常'
    let result =await updateVehicleService(rowVehicleMessage.value)
    if(result.code===0)
    {
      ElMessage.success("已经成功修改")
    }else{
      ElMessage.error(result.message)
    }
    listShow()
  }else if(row.state==='正常'){
    rowVehicleMessage.value.name=row.name
    rowVehicleMessage.value.student_num=row.student_num
    rowVehicleMessage.value.car_id=row.car_id
    rowVehicleMessage.value.car_name=row.car_name
    rowVehicleMessage.value.car_picture=row.car_picture
    rowVehicleMessage.value.phone=row.phone
    rowVehicleMessage.value.create_time=row.create_time
    rowVehicleMessage.value.expire_time=row.expire_time
    rowVehicleMessage.value.position=row.position
    rowVehicleMessage.value.state='待维修'
    let result =await updateVehicleService(rowVehicleMessage.value)
    if(result.code===0)
    {
      ElMessage.success("已经成功修改")
    }else{
      ElMessage.error(result.message)
    }
    listShow()
  }
}
</script>
<template>
<!-- searchTool -->
  <div class="tool" :model="searchVehicleData">
    <el-input v-model="searchVehicleData.student_num"  placeholder="学号"/>
    <el-input v-model="searchVehicleData.name" placeholder="姓名"/>
    <el-input v-model="searchVehicleData.car_id" placeholder="电瓶车牌号"/>
    <el-input v-model="searchVehicleData.car_name" placeholder="电瓶车品牌"/>
    <el-cascader style="margin-right:2%" placeholder="请选择要筛选的位置信息" v-model="searchVehicleData.position" :options="positionOptions" @change="handleChange5"></el-cascader>
    <el-cascader style="margin-right:3%" v-model="searchVehicleData.state" placeholder="请选择要筛选的状态信息" :options="stateOptions" @change="handleChange6"></el-cascader>
    <el-button type="primary" :icon="Search" plain @click="searchVehicle">点击查询</el-button>
    <el-button class="add-button" type="primary" plain @click="addDrawer = true">添加</el-button>
    <el-button type="primary" :icon="RefreshRight" plain @click="listShow()">重置</el-button>
  </div>
<!-- deleteDialog -->
  <el-dialog v-model="dialogVisible" title="是否删除该车辆数据">
    <div align="right">
      <el-button type="danger" plain @click="removeVehicle">确定</el-button>
      <el-button class="add-button" type="primary" plain @click="dialogVisible=false">取消</el-button>
    </div>
  </el-dialog>
<!-- addDrawer -->
  <el-drawer v-model="addDrawer" title="添加汽车信息" direction="rtl" >
    <div>
        <el-form label-width="auto" :model="vehicleDetailMessage">
            <el-form-item label="学号/工号:">
                <el-input v-model="vehicleDetailMessage.student_num" disabled style="width: 400px" />
            </el-form-item>
            <el-form-item label="车主姓名:">
                <el-input v-model="vehicleDetailMessage.name" disabled style="width: 400px" />
            </el-form-item>
            <el-form-item label="电瓶车品牌:">
                <el-input v-model="vehicleDetailMessage.car_name" style="width: 400px" />
            </el-form-item>
            <el-form-item label="电瓶车图片:">
                <el-tooltip placement="right" content="点击图片后上传图片即可更新头像">
                    <el-upload 
                        ref="uploadRef"
                        class="vehicle-picture-uploader" 
                        action="/api/upload" 
                        :show-file-list="false" 
                        :auto-upload="true"
                        name="file"
                        :headers="{'Authorization':tokenStore.token}"
                        :on-success="addPictureUpload"
                        >
                        <el-avatar :size="100" fit="cover" :src="vehicleDetailMessage.car_picture" shape="square" />
                    </el-upload>
                    <br/>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="车主联系电话:">
                <el-input v-model="vehicleDetailMessage.phone" disabled style="width: 400px" />
            </el-form-item>
            <el-form-item label="车牌到期时间:">
                <el-date-picker v-model="vehicleDetailMessage.expire_time" placeholder="选择车牌到期时间" :disabled-date="disabledDate" @change="handleChange2"></el-date-picker>
            </el-form-item>
            <el-form-item label="位置">
              <el-cascader v-model="vehicleDetailMessage.position" placeholder="选择车辆所在位置" :options="positionOptions" @change="handleChange1"></el-cascader>
            </el-form-item>
            <div align="center">
              <el-tooltip placement="right" content="点击确认后,车牌号会自动生成">
                    <el-button type="primary" @click="addVehicle">确定</el-button>
              </el-tooltip>
            </div>
            <el-form-item>
              <el-text>温馨提示：点击确定后,车牌号会自动生成,电瓶车默认状态为正常
              </el-text>
            </el-form-item>
        </el-form>
    </div>
  </el-drawer>
<!-- updateVehicleDrawer  -->
  <el-drawer v-model="editDrawer" title="编辑电瓶车信息" direction="rtl" >
    <el-form label-width="auto" :model="rowVehicleMessage">
      <el-form-item label="电瓶车品牌:">
          <el-input v-model="rowVehicleMessage.car_name" style="width: 400px" />
      </el-form-item>
      <el-form-item label="电瓶车图片:">
        <el-tooltip placement="right" content="点击图片后上传图片即可更新头像">
            <el-upload 
                class="vehicle-picture-uploader" 
                action="/api/upload" 
                :show-file-list="false" 
                :auto-upload="true"
                name="file"
                :headers="{'Authorization':tokenStore.token}"
                :on-success="updatePictureUpload"
                >
                <el-avatar :size="100" fit="cover" :src="rowVehicleMessage.car_picture" shape="square" />
            </el-upload>
            <br/>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="车牌到期时间:">
          <el-date-picker v-model="rowVehicleMessage.expire_time" :placeholder="rowVehicleMessage.expire_time" :disabled-date="disabledDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="位置">
        <el-cascader v-model="rowVehicleMessage.position" :options="positionOptions" @change="handleChange3" :placeholder="rowVehicleMessage.position"></el-cascader>
      </el-form-item>
      <div align="center">
        <el-tooltip placement="right" content="点击确认后,汽车信息就会更新">
              <el-button type="primary" @click="updateVehicle">确定</el-button>
        </el-tooltip>
      </div>
    </el-form>
  </el-drawer>
  <el-table :data="tableData" border v-loading="loading" element-loading-text="数据载入中">
    <el-table-column prop="student_num" label="学号" width="160"/>
    <el-table-column prop="name" label="姓名" width="160"/>
    <el-table-column prop="car_id" label="电瓶车车牌号" width="160"/>
    <el-table-column prop="car_name" label="电瓶车品牌" width="160"/>
    <el-table-column prop="position" label="位置" width="160"/>
    <el-table-column prop="state" label="状态" width="160"/>
    <el-table-column prop="car_picture" label="电瓶车图片" width="200">
      <template #default="scope">
        <el-image style="width: 150px; height: 100px" fit="cover" :src="scope.row.car_picture?scope.row.car_picture:vehicleDefaultUrl" shape="square"></el-image>
      </template>
    </el-table-column>
    <el-table-column prop="phone" label="联系电话" width="160">
      <template #default="scope">{{scope.row.phone? scope.row.phone.replace(/^(.{3})(?:\w+)(.{3})$/, "\$1********\$2"):""}}</template>
    </el-table-column>
    <el-table-column prop="create_time" label="车牌创建时间" width="160"/>
    <el-table-column prop="expire_time" label="车牌到期时间" width="160"/>
    <el-table-column  width="240" label="操作" align="center"> 
        <template #default="{row}">
          <el-button type="primary" :icon="Edit" circle @click="updateVehicleDrawer(row)" />
          <el-button type="info" :icon="Share" circle @click="rentState(row)" />
          <el-button type="warning" :icon="Warning" circle @click="maintainState(row)" />
          <el-button type="danger" :icon="Delete" circle @click="openDialog(row)"/>
        </template>
    </el-table-column>
  </el-table>
  <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3,5]"
  layout="jumper,total,sizes,prev,pager,next" background :total="total" @size-change="onSizeChange"
  @current-change="onCurrentChange" style="margin-top: 20px; justify-content:flex-end" />
</template>
<style scoped>
.tool{
    /* padding-left:96%; */
    display: flex;
    margin-bottom: 1%;
}
.tool .el-input{
  width:120px;
  margin-right:40px
}
.el-table-column{
  width:50;
}
</style>

