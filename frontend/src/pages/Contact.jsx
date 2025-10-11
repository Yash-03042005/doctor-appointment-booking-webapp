import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 md:px-20 py-10">

      {/* ---- Page Title ---- */}
      <div className='text-center text-3xl text-gray-500 mb-10'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      {/* ---- Contact Content ---- */}
      <div className='flex flex-col md:flex-row items-center md:items-start justify-center gap-10 text-[15px] md:text-[16px] text-gray-600 w-full max-w-6xl'>

        {/* Image */}
        <img className='w-full md:w-[380px] object-cover' src={assets.contact_image} alt="Contact" />

        {/* Text Content */}
        <div className='flex flex-col justify-center items-center md:items-start gap-6 text-center md:text-left'>
          <p className='font-semibold text-lg md:text-xl text-gray-600'>OUR OFFICE</p>
          <p className='text-gray-500 leading-7'>
            📍 123 Health Street, <br />
            Phaltan, Satara, Maharashtra.
          </p>
          <p className='text-gray-500 leading-7'>
            📞 +91 8530737367 <br />
            ✉️ prescripto123@gmail.com
          </p>
          <p className='font-semibold text-lg md:text-xl text-gray-600'>CAREERS AT PRESCRIPTO</p>
          <p className='text-gray-500 leading-7'>
            Learn more about our teams and job openings.
          </p>
          <button className='border border-black px-8 py-4 text-[15px] md:text-[16px] hover:bg-black hover:text-white transition-all duration-500'>
            Explore Jobs
          </button>
        </div>

      </div>
    </div>
  )
}

export default Contact
