import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import {assets} from '../../assets/assets.js'
import {useNavigate} from 'react-router-dom'

const DoctosList = () => {

  const {doctors,aToken,getAllDoctors,changeAvailability,deleteDoctor} = useContext(AdminContext)

  const  navigate =  useNavigate();

  useEffect(()=>{

    if(aToken){
      getAllDoctors()
    }

  },[aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5  gap-y-6'>
        {
          doctors.map((item,index)=>(
            <div onClick={() => navigate(`/doctor-profile-page/${item._id}`)}  className='border border-indigo-200 rounded-xl max-w-56  overflow-hidden cursor-pointer group' key={index}>

              <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
              <div className='p-4'>
                <p className='text-neutral-500 text-lg font-medium'>{item.name}</p>
                <p className='text-zinc-600  text-sm'>{item.speciality}</p>
                <div className='flex items-center justify-between gap-6'>

                  <div className='mt-2 flex items-center gap-1 text-sm'>
                    <input onChange={() => changeAvailability(item._id)} type="checkbox" checked={item.available} />
                    <p>Available</p>
                  </div>
                  <img onClick={()=>deleteDoctor(item._id)} src={assets.delete_icon} alt="delete" className="w-6 cursor-pointer opacity-70 hover:opacity-100 transition duration-300"/>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctosList
