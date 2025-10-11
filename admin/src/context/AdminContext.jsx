import { createContext, useState, useEffect } from "react";
import axios, { CanceledError } from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState([]);
  const [users, setUsers] = useState([]);


  // -----------------------------
  // Get all doctors
  // -----------------------------
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
        withCredentials: true,
      });
      if (data.success){
        setDoctors(data.doctors);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  };

  // -----------------------------
  // Get all users
  // -----------------------------
  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-users`, {
        withCredentials: true,
      });

      if (data.success){
        setUsers(data.users);
      }
      else{
        toast.error(data.message);
      } 
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  };

  // -----------------------------
  // Change doctor availability
  // -----------------------------

  const changeAvailability = async (docId) => {
    try {

      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        { docId },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      }
      else{
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  };

  // -----------------------------
  // Get all appointments
  // -----------------------------
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
        withCredentials: true,
      });
      if (data.success){
        setAppointments(data.appointments);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  };

  // -----------------------------
  // Cancel appointment
  // -----------------------------
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/cancel-appointment`,
        { appointmentId },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  };

  // -----------------------------
  // Get dashboard data
  // -----------------------------
  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        withCredentials: true,
      });
      if (data.success){
        setDashData(data.dashData);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  };

  // -----------------------------
  // Delete doctor
  // -----------------------------
  const deleteDoctor = async (docId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/delete-doctor`,
        { docId },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  };

  
  // -----------------------------
  // Check if admin is authenticated (run on app mount)
  // -----------------------------
  const checkAuth = async () => {
    try {

      const { data } = await axios.get(`${backendUrl}/api/admin/check-auth`, {
        withCredentials: true, // sends HttpOnly cookie
      });
      
      if(data.success){
        setIsAdminAuthenticated(data.success);
      }

    } catch (error) {
      console.error(error);
      setIsAdminAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);


  const value = {
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    doctors,
    getAllDoctors,
    appointments,
    setAppointments,
    getAllAppointments,
    dashData,
    setDashData,
    getDashData,
    users,
    getAllUsers,
    changeAvailability,
    cancelAppointment,
    deleteDoctor,
    backendUrl
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
