import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';

// ✅ Import all components used in the routes
import Home from './pages/Home.jsx';
import Doctors from '../src/pages/Doctors';
import Login from '../src/pages/Login';
import About from '../src/pages/About';
import Contact from '../src/pages/Contact';
import MyProfile from '../src/pages/MyProfile';
import MyAppointments from '../src/pages/MyAppointments';
import Appointment from '../src/pages/Appointment';
import NavBar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
 import { ToastContainer } from 'react-toastify';
import { AppContext } from './context/AppContext.jsx';

const App = () => {

  const { loadingUser } = useContext(AppContext);




  if (loadingUser) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="spinner"></div>
    </div>
  );
}



  return (
    <div className='mx-4 sm:mx-[10%]'>

      <ToastContainer/>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
      </Routes>
      <Footer/>
    </div>
  );
};

export default App;
