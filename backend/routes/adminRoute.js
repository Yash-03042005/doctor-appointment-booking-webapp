import express from 'express'
import { addDoctor ,loginAdmin,allDoctors, appointmentsAdmin, appointmentCancel,adminDashboard, deleteDoctor, allUsers, checkAuthAdmin, logoutAdmin, updateDoctor } from "../controllers/adminController.js"
import upload from "../middlewares/multer.js"
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailablity, updateDoctorProfile } from '../controllers/doctorController.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.get('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailablity)
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)
adminRouter.post('/delete-doctor',authAdmin,deleteDoctor)
adminRouter.get('/all-users',allUsers)
adminRouter.get("/check-auth", checkAuthAdmin);
adminRouter.post('/logout',logoutAdmin);
adminRouter.post('/update-doctor',upload.single('image'),updateDoctor)


export default adminRouter


