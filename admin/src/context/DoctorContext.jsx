import { useState, createContext, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

  const backendUrl_doctor = import.meta.env.VITE_BACKEND_URL;
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);
  const [isDoctorAuthenticated, setIsDoctorAuthenticated] = useState(false);
  const [loadingDoctor, setLoadingDoctor] = useState(true); // added

  // Get all appointments for doctor
  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl_doctor + '/api/doctor/appointments',
        { withCredentials: true }
      );
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Complete an appointment
  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl_doctor + '/api/doctor/complete-appointment',
        { appointmentId },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Cancel an appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl_doctor + '/api/doctor/cancel-appointment',
        { appointmentId },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Get dashboard data
  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl_doctor + '/api/doctor/dashboard',
        { withCredentials: true }
      );
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Get doctor profile data
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl_doctor + '/api/doctor/profile',
        { withCredentials: true }
      );
      if (data.success) {
        setProfileData(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  
  const checkAuth = async () => {
    setLoadingDoctor(true);
    try {
      const { data } = await axios.get(backendUrl_doctor + '/api/doctor/check-auth', {
        withCredentials: true, // sends HttpOnly cookie
      });
      setIsDoctorAuthenticated(data.success); // true if cookie valid
    } catch (error) {
      toast.error(error.message);
      console.error(error);
      setIsDoctorAuthenticated(false);
    } finally {
      setLoadingDoctor(false);
    }
  };

  useEffect(()=>{
    checkAuth(); //run on app mount
  },[])

  const value = {
    backendUrl_doctor,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    setDashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
    isDoctorAuthenticated,
    setIsDoctorAuthenticated,
    loadingDoctor // added here
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
