import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'
import { useParams } from 'react-router-dom'

const DoctorProfilePage = () => {
  const { doctors, getAllDoctors, isAdminAuthenticated } = useContext(AdminContext)
  const { docId } = useParams()
  const [docInfo, setDocInfo] = useState(null)

  useEffect(() => {
    if (isAdminAuthenticated) {
      getAllDoctors()
    }
  }, [isAdminAuthenticated])

  useEffect(() => {
    if (doctors && doctors.length > 0) {
      const selectedDoc = doctors.find(doc => doc._id === docId)
      if (selectedDoc) {
        setDocInfo(selectedDoc)
      }
    }
  }, [doctors, docId])

  if (!isAdminAuthenticated) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Please login as admin to view doctor details
      </p>
    )
  }

  return (
    <div className="p-6">
      {docInfo ? (
        <div className='flex flex-col sm:flex-row gap-4'>
          <div>
            <img
              className='w-full bg-primary sm:max-w-72 rounded-lg'
              src={docInfo.image}
              alt=""
            />
          </div>

          <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0'>
            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
              {docInfo.name}
              <img className='w-5' src={assets.verified_icon} alt="" />
            </p>
            <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              <p>{docInfo.degree} - {docInfo.speciality}</p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>
                {docInfo.experience}
              </button>
            </div>
            <div>
              <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
            </div>
            <p className='text-gray-500 font-medium mt-4'>
              Appointment fee: <span>&#8377;{docInfo.fees}</span>
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading doctor details...</p>
      )}
    </div>
  )
}

export default DoctorProfilePage
