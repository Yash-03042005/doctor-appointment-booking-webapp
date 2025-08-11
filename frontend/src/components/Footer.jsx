import React from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="px-5 md:px-10 bg-white">
      
      {/* --------- main footer content --------- */}
      <div className="flex flex-col md:grid md:grid-cols-[3fr_1.5fr_1.5fr] gap-12 my-10 mt-20 text-sm">

        {/* Left section */}
        <div className="text-center md:text-left">
          <img className="mb-5 w-40 mx-auto md:mx-0" src={assets.logo} alt="MediConnect Logo" />
          <p className="w-full md:w-4/5 text-gray-600 leading-6 mx-auto md:mx-0">
            Prescripto is your trusted partner in healthcare. Browse through our network of verified doctors, 
            book appointments with ease, and take the first step towards better health. We are committed to 
            making healthcare accessible, reliable, and hassle-free for everyone.
          </p>
        </div>

        {/* Middle section */}
        <div className="text-center md:text-left">
          <p className="text-lg font-semibold mb-4">Explore</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li className="cursor-pointer hover:text-primary transition" onClick={() => { navigate('/'); scrollTo(0, 0); }}>Home</li>
            <li className="cursor-pointer hover:text-primary transition" onClick={() => { navigate('/about'); scrollTo(0, 0); }}>About us</li>
            <li className="cursor-pointer hover:text-primary transition" onClick={() => { navigate('/contact'); scrollTo(0, 0); }}>Contact us</li>
            <li className="cursor-pointer hover:text-primary transition" onClick={() => { navigate('/doctors'); scrollTo(0, 0); }}>All Doctors</li>
          </ul>
        </div>

        {/* Right section */}
        <div className="text-center md:text-left">
          <p className="text-lg font-semibold mb-4">Get in Touch</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>📞 +91 8530737367</li>
            <li>✉️ support@prescripto.com</li>
            <li>📍 123 Health Street, Phaltan, Satara</li>
          </ul>
        </div>
      </div>

      {/* --------- copyright --------- */}
      <div>
        <hr className="border-gray-300" />
        <p className="py-5 text-xs sm:text-sm text-center text-gray-500">
          © 2025 Prescripto — All Rights Reserved.
          <br className="hidden sm:block" /> Designed & Developed by <span className="font-medium text-gray-700">Yash Nanaware</span>.
        </p>
      </div>

    </div>
  )
}

export default Footer
