import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      {/* ---- Page Title ---- */}
      <div className='text-center text-3xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      {/* ---- Contact Content ---- */}
      <div className='my-12 flex flex-col justify-center md:flex-row gap-10 mb-28 text-[15px] md:text-[16px] text-gray-600'>
        <img className='w-full md:max-w-[380px]' src={assets.contact_image} alt="" />

        <div className='flex flex-col justify-center items-start gap-6'>
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
