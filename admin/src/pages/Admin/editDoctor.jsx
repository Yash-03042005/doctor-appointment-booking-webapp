import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const EditDoctor = () => {

  const { id } = useParams()
  const { doctors, backendUrl, getAllDoctors } = useContext(AdminContext)

  const selectedDoctor = doctors.find(doc => doc._id === id)

  const [isEditing, setIsEditing] = useState(false)

  const [docImg, setDocImg] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  useEffect(() => {
    if (selectedDoctor) {
      setName(selectedDoctor.name)
      setEmail(selectedDoctor.email)
      setExperience(selectedDoctor.experience || '1 Year')
      setFees(selectedDoctor.fees)
      setAbout(selectedDoctor.about)
      setSpeciality(selectedDoctor.speciality || 'General physician')
      setDegree(selectedDoctor.degree)
      setAddress1(selectedDoctor.address?.line1 || '')
      setAddress2(selectedDoctor.address?.line2 || '')
    }
  }, [selectedDoctor])

  const onUpdateHandler = async () => {
    try {
      const formData = new FormData()
      formData.append('docId', id)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('experience', experience)
      formData.append('fees', fees)
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

      if (docImg) formData.append('image', docImg)

      const { data } = await axios.post(
        `${backendUrl}/api/admin/update-doctor`,
        formData,
        { withCredentials: true }
      )

      if (data.success) {
        toast.success(data.message)
        setIsEditing(false)
        getAllDoctors()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  if (!selectedDoctor) {
    return <p className="m-5 text-red-500">Doctor not found</p>
  }

  return (
    <div className="m-5 w-full">

      <p className="mb-3 text-lg font-medium">Doctor Profile</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-h-[80vh] overflow-y-scroll">

        {/* Image */}
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 rounded-full bg-gray-100 cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : selectedDoctor.image || assets.upload_area}
              alt=""
            />
          </label>
          {isEditing && (
            <input
              type="file"
              id="doc-img"
              hidden
              onChange={(e) => setDocImg(e.target.files[0])}
            />
          )}
          <p>Upload Doctor Picture</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 text-gray-600">

          {/* Left */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>Doctor Name</p>
              <input disabled={!isEditing} value={name} onChange={e => setName(e.target.value)} className="border px-3 py-2 rounded bg-gray-100" />
            </div>
            <div className="flex flex-col gap-1">
              <p>Doctor Email</p>
              <input disabled={!isEditing} value={email} onChange={e => setEmail(e.target.value)} className="border px-3 py-2 rounded bg-gray-100" />
            </div>
            <div className="flex flex-col gap-1">
              <p>Experience</p>
              <select disabled={!isEditing} value={experience} onChange={e => setExperience(e.target.value)} className="border px-3 py-2 rounded bg-gray-100">
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={`${i + 1} Year`}>{`${i + 1} Year`}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <p>Fees</p>
              <input disabled={!isEditing} value={fees} onChange={e => setFees(e.target.value)} className="border px-3 py-2 rounded bg-gray-100" />
            </div>
          </div>

          {/* Right */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>Speciality</p>
              <select disabled={!isEditing} value={speciality} onChange={e => setSpeciality(e.target.value)} className="border px-3 py-2 rounded bg-gray-100">
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <p>Education</p>
              <input disabled={!isEditing} value={degree} onChange={e => setDegree(e.target.value)} className="border px-3 py-2 rounded bg-gray-100" />
            </div>
            <div className="flex flex-col gap-1">
              <p>Address Line 1</p>
              <input disabled={!isEditing} value={address1} onChange={e => setAddress1(e.target.value)} className="border px-3 py-2 rounded bg-gray-100" />
            </div>
            <div className="flex flex-col gap-1">
              <p>Address Line 2</p>
              <input disabled={!isEditing} value={address2} onChange={e => setAddress2(e.target.value)} className="border px-3 py-2 rounded bg-gray-100" />
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-1 mt-4">
          <p>About Doctor</p>
          <textarea
            rows={5}
            disabled={!isEditing}
            value={about}
            onChange={e => setAbout(e.target.value)}
            className="w-full px-4 pt-2 border rounded bg-gray-100"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary text-white px-8 py-2 rounded-full"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={onUpdateHandler}
                className="bg-green-600 text-white px-8 py-2 rounded-full"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white px-8 py-2 rounded-full"
              >
                Cancel
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default EditDoctor
