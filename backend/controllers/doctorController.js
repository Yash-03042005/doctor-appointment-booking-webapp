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

      // ✅ Send token in HttpOnly cookie
      res.cookie("dtoken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      return res.json({ success: true, message: "Login successful" });
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


// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Check if the appointment belongs to the logged-in doctor
    if (String(appointmentData.docId) !== String(docId)) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    // Mark appointment as completed
    await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });

    // Release the doctor's slot (same logic as cancel API)
    const { slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    if (doctorData?.slots_booked?.[slotDate]) {
      doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter(
        (time) => time !== slotTime
      );

      await doctorModel.findByIdAndUpdate(docId, { slots_booked: doctorData.slots_booked });
    }

    return res.json({ success: true, message: "Appointment Completed & Slot Released" });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};



// API to cancel appointment from doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Check if this appointment belongs to the logged-in doctor
    if (String(appointmentData.docId) !== String(docId)) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    // Mark appointment as cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // Release the doctor's slot
    const { slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    if (doctorData?.slots_booked?.[slotDate]) {
      doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter(
        (time) => time !== slotTime
      );

      await doctorModel.findByIdAndUpdate(docId, { slots_booked: doctorData.slots_booked });
    }

    return res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


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

// api to update the doctor profile data from doctor panel
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const { fees, available, address, name, about } = req.body;

    await doctorModel.findByIdAndUpdate(docId, {
      fees,
      address,
      available,
      name,
      about
    });

    res.json({ success: true, message: "Profile Updated Successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};




// API to clear all booked slots for a doctor
const clearDoctorSlots = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.json({ success: false, message: "Doctor ID is required" });
    }

    const doctorData = await doctorModel.findById(docId);

    if (!doctorData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    // Set slots_booked to an empty object
    doctorData.slots_booked = {};
    await doctorData.save();

    return res.json({
      success: true,
      message: "All booked slots have been cleared for this doctor",
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const checkAuth = async (req, res) => {
  try {
    
    const dtoken = req.cookies.dtoken;

    if (!dtoken) {
      return res.json({ success: false });
    }

    // verify JWT
    const doctor = jwt.verify(dtoken, process.env.JWT_SECRET);

    if (!doctor) {
      return res.json({ success: false });
    }

    res.json({ success: true, doctor });
  } catch (error) {
    console.error('Error in checkAuth:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


const logoutDoctor = async (req, res) => {
  try {
    // Check if the cookie exists
    const dtoken = req.cookies.dtoken;

    if (!dtoken) {
      return res.json({ success: false, message: 'No token found' });
    }

    // ✅ Correct way to clear the cookie
    res.clearCookie('dtoken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });

    return res.json({ success: true, message: 'Doctor logged out successfully' });
  } catch (error) {
    console.error('Error in logoutDoctor:', error);
    return res.status(500).json({ success: false, message: 'Server error during logout' });
  }
};



export {changeAvailablity,doctorsList,loginDoctor,appointmentsDoctor,appointmentComplete,appointmentCancel,doctorDashboard,doctorProfile,updateDoctorProfile,clearDoctorSlots,checkAuth,logoutDoctor}