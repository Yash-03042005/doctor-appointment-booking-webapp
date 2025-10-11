import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { userData, setUserData, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('dob', userData.dob);
      formData.append('gender', userData.gender);
      formData.append('address', JSON.stringify(userData.address));
      if (image) formData.append('image', image);

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gray-50">
      {/* Card container */}
      <div className="w-full max-w-4xl bg-white rounded-xl p-6 md:p-10 flex flex-col md:flex-row gap-8">

        {/* Left Section: Profile Image */}
        <div className="flex flex-col justify-center items-center gap-4 w-full md:w-1/2">
          {isEdit ? (
            <label htmlFor="image" className="relative cursor-pointer">
              <img
                className="w-40 h-40 sm:w-48 sm:h-48 object-cover border-2 border-gray-200 rounded-lg" // Square with rounded corners
                src={image ? URL.createObjectURL(image) : (userData.image ? userData.image : assets.upload_area)}
                alt="Profile"
              />
              {!image && !userData.image && (
                <img
                  className="w-10 absolute bottom-2 right-2 sm:bottom-3 sm:right-3"
                  src={assets.upload_area}
                  alt="Upload"
                />
              )}
              <input
                type="file"
                id="image"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          ) : (
            <img
              className="w-40 h-40 sm:w-48 sm:h-48 object-cover border-2 border-gray-200 rounded-lg" // Square with rounded corners
              src={userData.image || assets.upload_area}
              alt="Profile"
            />
          )}
        </div>

        {/* Right Section: Name + Profile Info */}
        <div className="flex flex-col justify-start gap-6 w-full md:w-1/2 items-center md:items-start text-center md:text-left">

          {/* Name at the top */}
          <div className="w-full md:w-auto">
            {isEdit ? (
              <input
                className="border text-2xl sm:text-3xl font-semibold px-4 py-2 rounded-lg w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                value={userData.name}
                onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
              />
            ) : (
              <p className="font-semibold text-2xl sm:text-3xl text-gray-800">{userData.name}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <p className="text-gray-500 font-semibold underline text-lg">CONTACT INFORMATION</p>
            <p><span className="font-medium">Email:</span> <span className="text-blue-500">{userData.email}</span></p>
            <p>
              <span className="font-medium">Phone:</span>{' '}
              {isEdit ? (
                <input
                  className="px-2 py-1 border rounded-md w-full md:w-auto"
                  type="text"
                  value={userData.phone}
                  onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                />
              ) : (
                <span className="text-blue-400">{userData.phone}</span>
              )}
            </p>
            <p>
              <span className="font-medium">Address:</span><br />
              {isEdit ? (
                <>
                  <input
                    className="border px-2 py-1 mb-1 rounded-md w-full"
                    type="text"
                    value={userData.address.line1}
                    onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                  />
                  <input
                    className="border px-2 py-1 rounded-md w-full"
                    type="text"
                    value={userData.address.line2}
                    onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                  />
                </>
              ) : (
                <>
                  {userData.address.line1}<br />
                  {userData.address.line2}
                </>
              )}
            </p>
          </div>

          {/* Basic Information */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <p className="text-gray-500 font-semibold underline text-lg">BASIC INFORMATION</p>
            <p>
              <span className="font-medium">Gender:</span>{' '}
              {isEdit ? (
                <select
                  className="px-2 py-1 border rounded-md w-full md:w-auto"
                  value={userData.gender}
                  onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <span className="text-gray-600">{userData.gender}</span>
              )}
            </p>
            <p>
              <span className="font-medium">Birthday:</span>{' '}
              {isEdit ? (
                <input
                  className="px-2 py-1 border rounded-md w-full md:w-auto"
                  type="date"
                  value={userData.dob}
                  onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                />
              ) : (
                <span className="text-gray-600">{userData.dob}</span>
              )}
            </p>
          </div>

          {/* Save/Edit Button */}
          <div className="flex justify-center md:justify-start mt-4 w-full">
            {isEdit ? (
              <button
                className="border border-blue-500 px-8 py-2 rounded-full bg-blue-500 text-white hover:bg-white hover:text-blue-500 transition-all font-semibold"
                onClick={updateUserProfileData}
              >
                Save
              </button>
            ) : (
              <button
                className="border border-blue-500 px-8 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all font-semibold"
                onClick={() => setIsEdit(true)}
              >
                Edit
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyProfile;
