import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [doctors, setDoctors] = useState([]);
  const [userData, setUserData] = useState(null); // store user data
  const [isLoggedIn, setIsLoggedIn] = useState(false); // track login status
  const [loadingUser, setLoadingUser] = useState(true); // new state for loading spinner

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Load user profile from backend using HTTP-only cookie
  const loadUserProfileData = async () => {
    setLoadingUser(true); // start loading
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        withCredentials: true, // ✅ important for cookie
      });

      if (data.success) {
        setUserData(data.userData);
        setIsLoggedIn(true);
      } else {
        setUserData(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error(error);
      setUserData(null);
      setIsLoggedIn(false);
    } finally {
      setLoadingUser(false); // stop loading
    }
  };

  // Load doctors list
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Logout user (clear backend cookie)
  const logoutUser = async () => {
    try {
      await axios.post(`${backendUrl}/api/user/logout`, {}, { withCredentials: true });
      setUserData(null);
      setIsLoggedIn(false);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getDoctorsData();
    loadUserProfileData(); // check login status on app load
  }, []);

  const value = {
    doctors,
    getDoctorsData,
    userData,
    setUserData,
    backendUrl,
    loadUserProfileData,
    isLoggedIn,
    setIsLoggedIn,
    logoutUser,
    loadingUser, // added here
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
