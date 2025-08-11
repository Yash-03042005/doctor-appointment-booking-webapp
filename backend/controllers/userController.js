import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import appointmentModel from '../models/appointmentModel.js'
import doctorModel from '../models/doctorModel.js'
import razorpay from 'razorpay'
import { CurrencyCodes } from 'validator/lib/isISO4217.js'


//api to register a new user
const registerUser = async (req,res)=>{
    try {
        
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            
            return res.json({success:false, messssage:"Missing Details"})
        }

        if(!validator.isEmail(email)){

            return res.json({success:false,message:"Enter a valid email"})
        }

        if(password.length < 8){
            return res.json({success:false,message:"Enter a strong password"})
        }

        //hashing the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);

        const userData = {
            name,email,
            password:hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

        res.json({success:true,token})


    } catch (error) {

        console.error(error)
        res.json({success:false,message:error.message})
        
    }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, messssage: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User Does not exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message:error.message});
  }
};

//api to get the user profile details

const getProfile = async(req,res)=>{

  try{

    const userId = req.userId
    console.log("userId in the controller function:",userId)
    const userData = await userModel.findById(userId).select('-password')
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({success:true , userData})


  }catch(error){
    console.error(error)
    res.json({success:false,message:error.message})
  }
  
}

//api to update the user profile

const updateProfile = async (req,res)=>{

  try{

    const userId = req.userId
    const imageFile = req.file
    const {name,phone,address,dob,gender} = req.body;

    if(!name || !phone || !address || !dob || !gender){
      return res.json({success:false,message:"Data Missing"})
    }

    await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})

    if(imageFile){

      //upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
      const imageUrl = imageUpload.secure_url

      await userModel.findByIdAndUpdate(userId,{image:imageUrl})


    }
    res.json({success:true,message:"Profile Updated"})

  }catch(error){
    console.error(error)
    res.json({success:false,message:error.message})
  }

}

//api to book appointment

const bookAppointment = async (req, res) => {

  try {
    const userId = req.userId;
    const { docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select('-password');

    if (!docData.available) {
      return res.json({ success: false, message: 'Doctor not available' });
    }

    let slots_booked = docData.slots_booked;

    // checking for slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select('-password');

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now()
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment booked successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message:error.message});
  }
}

//api to get user appointment for frontend my-appointmnets page
const listAppointment = async(req,res)=>{
  try{

    const userId = req.userId

    const appointments = await appointmentModel.find({userId})


    res.json({success:true,appointments})

  }catch(error){
    console.error(error)
    res.json({success:false,message:error.message})
  }
} 

//api to cancel the appointment 
const cancelAppointment = async(req,res)=>{
  try{

    const userId = req.userId;
    const {appointmentId} = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    //verify appointment user 
    if(appointmentData.userId !=userId){
      return res.josn({success:false,message:"Unauthorized action"})
    }

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

const razorpayInstance  = new razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_SECRET_KEY
})

//api to make the payment of the appointment 
const paymentRazorpay = async(req,res)=>{
  try{
    const {appointmentId} = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if(!appointmentData || appointmentData.cancelled){
      res.json({success:false,message:"Appointment cancelled or not found"})
    }

    //creating options for razorpay payments
    const options = {
      amount:appointmentData.amount * 100,
      currency :'INR',
      receipt:appointmentId,
    }

    //creation of order
    const order = await razorpayInstance.orders.create(options)
    res.json({success:true,order})

  }catch(error){
    console.error(error)
    res.json({success:false,message:error.message})
  }
}


const verifyRazorpay = async(req,res)=>{
  try{
    const {razorpay_order_id} = req.body

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

    if(orderInfo.status === "paid"){

      await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
      res.json({success:true,message:"Payment Successful"})

    }else{

      res.json({success:false,message:"Payment failled"})
    }
    
  }catch(error){
    console.error(error)
    res.json({success:false,message:error.message})
  }

}



export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay}