import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const AllUsers = () => {
  const { users, getAllUsers, isAdminAuthenticated } = useContext(AdminContext);

  useEffect(() => {
    if (isAdminAuthenticated) {
      getAllUsers();
    }
  }, [isAdminAuthenticated]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Users</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        {/* Table Header (hidden on mobile) */}
        <div className="hidden sm:grid grid-cols-[0.5fr_1fr_2fr_3fr_3fr_1fr_2fr_2fr] py-3 px-6 border-b bg-gray-50 font-medium">
          <p>#</p>
          <p>Photo</p>
          <p>Name</p>
          <p>Email</p>
          <p>Address</p>
          <p>Gender</p>
          <p>DOB</p>
          <p>Phone</p>
        </div>

        {/* Table Rows */}
        {users?.length > 0 ? (
          users.map((user, index) => (
            <div
              key={user._id}
              className="flex flex-col sm:grid sm:grid-cols-[0.5fr_1fr_2fr_3fr_3fr_1fr_2fr_2fr] items-start sm:items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-100"
            >
              {/* Sr No */}
              <p className="hidden sm:block">{index + 1}</p>

              {/* Photo */}
              <div className="flex items-center gap-2">
                <img
                  className="w-10 h-10 rounded-full object-cover border"
                  src={user.image}
                  alt={user.name}
                />
                <p className="sm:hidden font-medium">{user.name}</p>
              </div>

              {/* Name */}
              <p className="hidden sm:block">{user.name}</p>

              {/* Email */}
              <p className="sm:truncate">{user.email}</p>

              {/* Address */}
              <p>
                {user.address?.line1} {user.address?.line2}
              </p>

              {/* Gender */}
              <p>{user.gender}</p>

              {/* DOB */}
              <p>{user.dob}</p>

              {/* Phone */}
              <p>{user.phone}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 p-4">No Users Found</p>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
