import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const AllAppointments = () => {

  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)
  const { calculateAge, slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        {/* Table Header */}
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr_1fr] py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Status</p>
          <p>Action</p>
        </div>

        {/* Table Rows */}
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div 
              key={index} 
              className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-200'
            >
              <p className='max-sm:hidden'>{index + 1}</p>

              {/* Patient */}
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full' src={item.userData.image} alt="" />
                <p>{item.userData.name}</p>
              </div>

              {/* Age */}
              <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>

              {/* Date & Time */}
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

              {/* Doctor */}
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full' src={item.docData.image} alt="" />
                <p>{item.docData.name}</p>
              </div>

              {/* Fees */}
              <p>&#8377;{item.amount}</p>

              {/* Status */}
              {item.cancelled ? (
                <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              ) : item.isCompleted ? (
                <p className='text-green-500 text-xs font-medium'>Completed</p>
              ) : (
                <p className='text-yellow-500 text-xs font-medium'>Pending</p>
              )}

              {/* Action */}
              
              {item.cancelled || item.isCompleted ? (
                <p className="text-gray-400 text-xs">--</p>
              ) : (
                <img 
                  onClick={() => cancelAppointment(item._id)} 
                  className='w-10 cursor-pointer' 
                  src={assets.cancel_icon} 
                  alt="cancel" 
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 p-4">No Appointment Booked</p>
        )}
      </div>
    </div>
  )
}

export default AllAppointments
