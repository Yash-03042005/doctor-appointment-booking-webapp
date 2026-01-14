import validator from 'validator'
import bcrypt from 'bcrypt'
import doctorModel from '../models/doctorModel.js';
import {v2 as cloudinary} from 'cloudinary'
import jwt from "jsonwebtoken"
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';


//api for adding doctor
const addDoctor = async (req,res)=>{

    try{

        const {name,email,password,speciality,degree,experience,about,fees,address} = req.body;

        const imageFile = req.file

        //
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success:false,message:"Missing Details"})
        }

        //validating email format 
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email"})
        }
        
        //validating password is strong or not
        if(password.length < 8){
            return res.json({success:false,message:"Please enter a strong password"})
        }

        // hashing the password to store in database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)


        //upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            password:hashedPassword,
            image:imageUrl,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success:true,message:"Doctor Added Successfully..!!!"})

        
    }catch(error){

        console.error(error)
        res.json({success:false,message:error.message})

    }

}


// API for admin login (using HttpOnly cookie)
const loginAdmin = async (req,res)=>{
    try{
      
        const {email,password} = req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign({email}, process.env.JWT_SECRET, { expiresIn: "1h" })

            // Send token in HttpOnly cookie
            res.cookie("atoken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
                maxAge: 60 * 60 * 1000 // 1 hour
            })

            return res.json({success:true,message:"Admin login successful"})
        }else{
            return res.json({success:false,message:"Invalid Credentials"})
        }

    }catch(error){
        console.error(error)
        res.json({success:false,message:error.message})
    }
}

//api to get all doctors

const allDoctors = async(req,res)=>{

    try{

        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})

    }catch(error){
        console.error(error)
        res.json({success:false,message:error.message})
    }

}

const appointmentsAdmin = async(req,res)=>{
    

    try{

        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})

    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api for appointment cancel

const appointmentCancel = async(req,res)=>{
  try{

    const {appointmentId} = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

    //releasing doctor slot

    const {docId,slotDate,slotTime} = appointmentData

    const doctorData = await doctorModel.findById(docId)

    let slots_booked = doctorData.slots_booked

    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

    await doctorModel.findByIdAndUpdate(docId,{slots_booked})

    res.json({success:true,message:"Appointment Cancelled"})

  }catch(error){
    console.log(error)
    res.json({success:false,message:error.message})

  }
}
// api to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const appointments = await appointmentModel.find({});
    const users = await userModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      registeredUsers: users.length,
      latestAppointments: [...appointments].reverse().slice(0, 5)
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { docId } = req.body;

    const doctor = await doctorModel.findById(docId);  // ✅ Correct usage

    if (!doctor) {
      return res.json({ success: false, message: "Doctor does not exist" });
    }

    await doctorModel.findByIdAndDelete(docId);

    res.json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const allUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


// API to check admin authentication (verify cookie)
const checkAuthAdmin = (req,res)=>{
    try{
        const atoken = req.cookies.atoken;
        if(!atoken) return res.json({success:false})

        const admin = jwt.verify(atoken, process.env.JWT_SECRET)
        if(!admin) return res.json({success:false})

        res.json({success:true, admin})
    }catch(error){
        console.error('Error in checkAuthAdmin:', error)
        res.status(500).json({success:false, message:'Server error'})
    }
}


const logoutAdmin = async (req, res) => {
  try {
    // Check if the admin cookie exists
    const atoken = req.cookies.atoken;

    if (!atoken) {
      return res.json({ success: false, message: 'No admin token found' });
    }

    // ✅ Clear the admin cookie
    res.clearCookie('atoken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });

    return res.json({ success: true, message: 'Admin logged out successfully' });
  } catch (error) {
    console.error('Error in logoutAdmin:', error);
    return res.status(500).json({ success: false, message: 'Server error during logout' });
  }
};



export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard,deleteDoctor,allUsers,checkAuthAdmin,logoutAdmin}