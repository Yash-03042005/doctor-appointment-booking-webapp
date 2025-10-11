import express from 'express'
import { appointmentsDoctor, doctorsList, loginDoctor,appointmentComplete,appointmentCancel, doctorDashboard,doctorProfile,updateDoctorProfile, clearDoctorSlots, checkAuth, logoutDoctor } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'
import authUser from '../middlewares/authDoctor.js'
const doctorRouter = express.Router()

doctorRouter.get('/list',doctorsList)
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/appointments',authDoctor,appointmentsDoctor)
doctorRouter.post('/complete-appointment',authDoctor,appointmentComplete)
doctorRouter.post('/cancel-appointment',authDoctor,appointmentCancel)
doctorRouter.get('/dashboard',authDoctor,doctorDashboard)
doctorRouter.get('/profile',authDoctor,doctorProfile)
doctorRouter.post('/upadate-profile',authDoctor,updateDoctorProfile)
doctorRouter.post('/clear-slots',clearDoctorSlots)
doctorRouter.get('/check-auth',checkAuth)
doctorRouter.post('/logout',logoutDoctor)
export default  doctorRouter

