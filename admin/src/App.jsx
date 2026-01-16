import { useContext } from 'react';
import Login from './pages/Login.jsx'
import { ToastContainer } from 'react-toastify';
import { AdminContext } from './context/AdminContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard.jsx';
import AllAppointments from './pages/Admin/AllAppointments.jsx';
import AddDoctor from './pages/Admin/AddDoctor.jsx';
import DoctosList from './pages/Admin/DoctosList.jsx';
import { DoctorContext } from './context/DoctorContext.jsx';
import DoctorProfile from './pages/Doctor/DoctorProfile.jsx';
import DoctorAppointments from './pages/Doctor/DoctorAppointments.jsx';
import DoctorDashboard from './pages/Doctor/DoctorDashboard.jsx';
import DoctorProfilePage from "./pages/Admin/DoctorProfilePage.jsx"
import AllUsers from './pages/Admin/AllUsers.jsx'
import EditDoctor from './pages/Admin/editDoctor.jsx';


const App = () => {

  const { isAdminAuthenticated, loadingAdmin } = useContext(AdminContext);
  const { isDoctorAuthenticated, loadingDoctor } = useContext(DoctorContext)

  const loading = loadingAdmin || loadingDoctor;

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='spinner'></div>
      </div>
    )
  }

  return isAdminAuthenticated || isDoctorAuthenticated  ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          {/*---------------------admin routes------------*/}
          <Route path='/' element={<></>}/>
          <Route path='/admin-dashboard' element={<Dashboard/>}/>
          <Route path='/all-appointments' element={<AllAppointments/>}/>
          <Route path='/add-doctor' element={<AddDoctor/>}/>
          <Route path='/doctor-list' element={<DoctosList/>}/>
          <Route path="/doctor-profile-page/:docId" element={<DoctorProfilePage />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/doctor-edit/:id" element={<EditDoctor />} />


          {/*---------------------doctor routes------------*/}
          <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
          <Route path='/doctor-profile' element={<DoctorProfile/>}/>
          <Route path='/doctor-appointments' element={<DoctorAppointments/>}/>
        </Routes>
      </div>
    </div>
  )
  :(
    <>
      <Login/>
      <ToastContainer/>
    </>
  )
}

export default App;
