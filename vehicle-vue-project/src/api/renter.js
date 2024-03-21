import axios from 'axios'
import request from '@/util/request.js'
const baseURL = 'http://localhost:8080'//create a baseURL to reduce the same URL
const instance = axios.create({baseURL})
export const addRenterService = (renter_message)=>{
    return request.post('/Renter/renterAdd',renter_message);
}
export const RenterListService = ()=>{
    return request.get('/Renter/renterMessageList')
}
export const updateRenterService = (vehicle_message)=>{
    return request.put('/Renter/updateRenter',vehicle_message)
}
export const findBorrowService = ()=>{
    return request.get('/Renter/findRenter')
}
export const removeRenterService = (car_id)=>{
    return request.delete('/Renter/removeRenter?car_id='+car_id)
}