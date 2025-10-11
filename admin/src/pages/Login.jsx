import React, { useContext, useState } from 'react';
import { AdminContext } from '../context/AdminContext.jsx';
import { DoctorContext } from '../context/DoctorContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [state, setState] = useState('Admin'); // 'Admin' or 'Doctor'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { backendUrl, setIsAdminAuthenticated } = useContext(AdminContext);
    const { backendUrl_doctor,setIsDoctorAuthenticated} = useContext(DoctorContext);

    const navigate = useNavigate();

    const OnSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (state === 'Admin') {
                // Admin login (still using localStorage)
                const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password },{withCredentials:true});

                if (data.success) {
                    setIsAdminAuthenticated(true);
                    toast.success("Admin login successful");
                    navigate('/admin-dashboard')
                } else {
                    toast.error(data.message);
                }

            } else {
                // Doctor login using HttpOnly cookie
                const { data } = await axios.post(
                    
                    backendUrl_doctor + '/api/doctor/login',
                    { email, password },
                    { withCredentials: true } // ✅ ensures HttpOnly cookie is set
                );

                if (data.success) {

                    toast.success("Doctor login successful");
                    setIsDoctorAuthenticated(true);
                    navigate('/doctor-dashboard')
                    // ✅ No localStorage or token context needed for HttpOnly cookie
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Server error");
        }
    };

    return (
        <form onSubmit={OnSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
                <p className='text-2xl font-semibold m-auto'>
                    <span className='text-primary'>{state}</span> Login
                </p>

                <div className='w-full'>
                    <p>Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder='Enter your email'
                        className='border border-[#DADADA] rounded w-full p-2 mt-1'
                        type="email"
                        required
                    />
                </div>

                <div className='w-full'>
                    <p>Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder='Enter your password'
                        className='border border-[#DADADA] rounded w-full p-2 mt-1'
                        type="password"
                        required
                    />
                </div>

                <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>

                {state === 'Admin' ? (
                    <p>
                        Doctor Login?{' '}
                        <span className='text-primary underline cursor-pointer' onClick={() => setState('Doctor')}>
                            Click here
                        </span>
                    </p>
                ) : (
                    <p>
                        Admin Login?{' '}
                        <span className='text-primary underline cursor-pointer' onClick={() => setState('Admin')}>
                            Click here
                        </span>
                    </p>
                )}
            </div>
        </form>
    );
};

export default Login;
