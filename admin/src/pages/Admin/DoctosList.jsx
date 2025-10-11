import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets.js'
import { useNavigate } from 'react-router-dom'

const DoctosList = () => {
  const { doctors, getAllDoctors, changeAvailability, deleteDoctor, isAdminAuthenticated } = useContext(AdminContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAdminAuthenticated) {
      getAllDoctors()
    }
  }, [isAdminAuthenticated])

  if (!isAdminAuthenticated) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Please login as admin to view doctors list
      </p>
    )
  }

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div
            onClick={() => navigate(`/doctor-profile-page/${item._id}`)}
            className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group'
            key={index}
          >
            <img
              className='bg-indigo-50 group-hover:bg-primary transition-all duration-500'
              src={item.image}
              alt=""
            />
            <div className='p-4'>
              <p className='text-neutral-500 text-lg font-medium'>{item.name}</p>
              <p className='text-zinc-600 text-sm'>{item.speciality}</p>
              <div className='flex items-center justify-between gap-6'>
                <div className='mt-2 flex items-center gap-1 text-sm'>
                  <input
                    onChange={(e) => { e.stopPropagation(); changeAvailability(item._id) }}
                    type="checkbox"
                    checked={item.available}
                  />
                  <p>Available</p>
                </div>
                <img
                  onClick={(e) => { e.stopPropagation(); deleteDoctor(item._id) }}
                  src={assets.delete_icon}
                  alt="delete"
                  className="w-6 cursor-pointer opacity-70 hover:opacity-100 transition duration-300"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctosList
