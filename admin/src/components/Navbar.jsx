import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import {assets} from '../assets/assets.js'
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext.jsx';
import axios from "axios"
import {toast} from "react-toastify"

const Navbar = () => {

    const { isAdminAuthenticated, setIsAdminAuthenticated } = useContext(AdminContext);
    const { isDoctorAuthenticated, setIsDoctorAuthenticated ,backendUrl_doctor } = useContext(DoctorContext);

    const navigate = useNavigate()

    const logoutHandler = async()=>{

        try{

          if(isDoctorAuthenticated){

            const {data} = await axios.post(backendUrl_doctor+'/api/doctor/logout',{},{withCredentials:true})

            if(data.success){
              setIsDoctorAuthenticated(false);
              toast.success(data.message);
            }
          }
          else{

            if(isAdminAuthenticated){

              const {data} = await axios.post(backendUrl_doctor + '/api/admin/logout',{},{withCredentials:true})

              if(data.success){

                setIsAdminAuthenticated(false);
                toast.success(data.message);

              } 
            }
          }

          navigate('/');

        }catch(error){
          console.log(error);
          toast.error(error.message)
        }
    }



    const navigationHandler = ()=>{

      if(isAdminAuthenticated){
        navigate('/admin-dashboard')
      }else{
        navigate('/doctor-dashboard')

      }

    }
  return (
    <div className='flex justify-between items-center  px-4  sm:px-10 py-3 border-b bg-white'>

        <div className='flex items-center  gap-2 text-xs'>
            <img onClick={navigationHandler} className='w-36 sm:w-40  cursor-pointer'  src={assets.admin_logo} alt="" />
            <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{isAdminAuthenticated ? 'Admin' : 'Doctor'}</p>
        </div>
        <button onClick={logoutHandler} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>
      
    </div>
  )
}

export default Navbar
