import axios from 'axios'
import request from '@/util/request.js'
const baseURL = 'http://localhost:8080'//create a baseURL to reduce the same URL
const instance = axios.create({baseURL})
export const vehicleListService = ()=>{
    //in pinia refine a ref data do not need .value
    return request.get('/Vehicle/list');
}
export const addVehicleService = (vehicle_message)=>{
    return request.post('/Vehicle/addVehicleMessage',vehicle_message);
}
export const updateVehicleService = (new_vehicle_message)=>{
    return request.put('/Vehicle/updateVehicleMessage',new_vehicle_message);
}
export const updateVehiclePictureService = (picture_message)=>{
    return request.post('/Vehicle/updateVehiclePic',picture_message)
}
export const removeVehicleService = (car_id)=>{
    return request.delete('/Vehicle/removeVehicleMessage?car_id='+car_id)
}
export const vehicleMessageSerach =(params)=>{
    return request.get('/Vehicle' ,{params:params})
}
export const updateAllVehicleService = (newUserInfo)=>{
    return request.post('/Vehicle/updateAll',newUserInfo)
}
export const updateVehicleStateService = (params)=>{
    return request.post('/Vehicle/updateVehicleState',params)
}
