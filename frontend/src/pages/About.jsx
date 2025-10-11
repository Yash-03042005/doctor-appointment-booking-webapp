import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      
      {/* ---- Title ---- */}
      <div className='text-center text-3xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      {/* ---- About Content ---- */}
      <div className='my-12 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[380px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-[15px] md:text-[16px] text-gray-600 leading-7'>
          <p>
            Prescripto is a smart healthcare platform designed to make managing your medical needs simple and stress-free. 
            We help patients connect with trusted doctors, book appointments instantly, and manage their health records — all in one place.
          </p>
          <p>
            Our mission is to bridge the gap between healthcare providers and patients using technology that’s fast, secure, and easy to use.
          </p>
          <b className='text-gray-800 text-[16px] md:text-[17px]'>Our Vision</b>
          <p>
            Our vision is to create a world where accessing quality healthcare is as easy as a few clicks.
            At Prescripto, we strive to build a connected digital healthcare ecosystem that empowers patients, supports doctors, 
            and simplifies healthcare delivery for everyone.
          </p>
        </div>
      </div>

      {/* ---- Why Choose Us ---- */}
      <div className='text-2xl my-6 text-center md:text-left'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-10 sm:py-16 flex flex-col gap-5 text-[15.5px] md:text-[16px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>EFFICIENCY:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>

        <div className='border px-10 md:px-16 py-10 sm:py-16 flex flex-col gap-5 text-[15.5px] md:text-[16px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>CONVENIENCE:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>

        <div className='border px-10 md:px-16 py-10 sm:py-16 flex flex-col gap-5 text-[15.5px] md:text-[16px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>PERSONALIZATION:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
      
    </div>
  )
}

export default About
