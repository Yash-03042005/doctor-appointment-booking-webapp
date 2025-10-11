import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { slotDateFormat } = useContext(AppContext);

  const navigate = useNavigate();

  const { isAdminAuthenticated, getDashData, dashData } = useContext(AdminContext);


  useEffect(() => {
    if (isAdminAuthenticated) {
      getDashData();
    }
  }, [isAdminAuthenticated]);

  if (!isAdminAuthenticated) {
  return (
    <p className="text-center mt-10 text-gray-500">
      Please login as admin to view the dashboard
    </p>
  );
  }

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          {/* Doctors */}
          <div
            onClick={() => navigate("/doctor-list")}
            className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all"
          >
            <img className="w-14" src={assets.doctor_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.doctors}
              </p>
              <p className="text-gray-400">Doctors</p>
            </div>
          </div>

          {/* Appointments */}
          <div
            onClick={() => navigate("/all-appointments")}
            className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all"
          >
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>

          {/* Registered Users */}
          <div onClick={()=> navigate('/all-users')} className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.registeredUsers}
              </p>
              <p className="text-gray-400">Registered Users</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings */}
        <div className="bg-white">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Bookings</p>
          </div>
          <div className="pt-4 border border-t-0">
            {dashData?.latestAppointments?.length > 0 ? (
              dashData.latestAppointments.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border-b"
                >
                  <img
                    className="w-14 h-14 object-cover rounded-full"
                    src={item.userData?.image}
                    alt="Doctor"
                  />

                  <div className="flex-1">
                    <p className="font-semibold">{item.userData?.name}</p>
                    <p className="text-sm text-gray-500">
                      {slotDateFormat(item.slotDate)}
                    </p>
                  </div>

                  {item.cancelled ? (
                    <p className="text-red-400 text-xs font-medium">Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className="text-green-500 text-xs font-medium">
                      Completed
                    </p>
                  ) : (
                    <p className="text-yellow-500 text-xs font-medium">
                      Pending
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 p-4">No recent bookings.</p>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
