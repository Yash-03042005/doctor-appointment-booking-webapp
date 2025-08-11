import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"

const changeAvailablity  = async (req,res)=>{

    try{
        const {docId} = req.body
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available: !docData.available})
        res.json({success:true,message:"Availability Changed"})

    }catch(error){
        console.error(error)
        res.json({success:false,message:error.message})
    }
}

const doctorsList = async(req,res)=>{

    try{
        const doctors = await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true,doctors})
    }catch(error){
        console.error(error)
        res.json({success:false,message:error.message})
    }
}

//api to login the doctor
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatched = await bcrypt.compare(password, doctor.password);

    if (isMatched) {
      const token = await jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);

      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// api to get all appointments for doctor panel
const appointmentsDoctor = async(req,res)=>{

    try{

        const docId = req.docId
        console.log("doctor id in controller function:",docId)
        const appointments = await appointmentModel.find({docId})
        console.log(appointments)
        res.json({success:true,appointments})

    }catch(error){
        console.error(error)
        res.json({success:false,message:error.message})

    }
}

//api to mark appointment completed for doctor panel
const appointmentComplete = async(req,res)=>{
  
  try{

    const docId = req.docId
    const {appointmentId} = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    if(appointmentData && appointmentData.docId === docId)
    {
      await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
      return res.json({success:true,message:"Appointment Completed"})
    }else{
      return res.json({success:false,message:"Mark failed"})

    }

  }catch(error){

    console.error(error)
    res.json({success:false,message:error.message})

  }
}



//api to cancek  appointment  for doctor panel
const appointmentCancel= async(req,res)=>{
  
  try{

    const docId = req.docId
    const {appointmentId} = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    if(appointmentData && appointmentData.docId === docId)
    {
      await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
      return res.json({success:true,message:"Appointment Cancelled"})
    }else{
      return res.json({success:false,message:"Cancellation failed"})

    }
    
  }catch(error){

    console.error(error)
    res.json({success:false,message:error.message})

  }
}

//API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId;
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    let patients = [];

    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }

      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

//api to get doctor profile information

const doctorProfile = async(req,res)=>{

  try{

    const docId = req.docId

    const profileData = await doctorModel.findById(docId).select('-password')

    res.json({success:true,profileData})

  }catch(error){

    console.error(error)
    res.json({success:false,message:error.message})

  }
}

//api to update the doctor profile data from doctor panel

const updateDoctorProfile = async(req,res)=>{

  try{
    
    const docId = req.docId
    const {fees,available,address} = req.body

    await doctorModel.findByIdAndUpdate(docId,{fees,address,available})

    res.json({success:true,message:"Profile Updated Successfully"})

  }catch(error){
    console.error(error)
    res.json({success:false,message:error.message})
  }

}

export {changeAvailablity,doctorsList,loginDoctor,appointmentsDoctor,appointmentComplete,appointmentCancel,doctorDashboard,doctorProfile,updateDoctorProfile}