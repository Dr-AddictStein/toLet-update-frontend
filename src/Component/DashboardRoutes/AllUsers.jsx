import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {message} from "antd";
export const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);

  const [searchValue, setSearchValue] = useState('');
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/users?searchValue=${searchValue}`);
      setAllUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
    //search

    const handleSearchChange = (e) => {
      setSearchValue(e.target.value);
    };
  
    const handleSearch = () => {
      fetchUsers();
      console.log("click");
      console.log("Search value:", searchValue);
    };
  const handleDelete = async (userId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/delete/${userId}`);
      console.log(res.data.message); 
      message.success("Delete successfully!");
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      // Optionally, you can display an error message to the user
    }
  };

  return (
    <div>
        <div className="flex justify-center mb-6">
      <div>
        <input
          value={searchValue}
          onChange={handleSearchChange}
          className="border border-black rounded-bl-md rounded-tl-md  md:w-56 lg:px-6 px-1 py-2 md:py-3 "
          placeholder="Search by First Name"
        />
      </div>
      <button onClick={handleSearch} className="bg-blue-400 text-white border border-black px-1 rounded-tr-md rounded-br-md" >Search</button>
    </div>
      <div className="overflow-x-auto">
        <table className="min-w-[100%] shadow-md border mx-auto border-gray-100">
          <thead>
            <tr className="bg-green-500 text-white">
              <th className="py-4 px-6 lg:text-lg md:text-md text-sm text-left border-b">User Name</th>
              <th className="py-4 px-6 lg:text-lg md:text-md text-sm text-left border-b">User Email</th>
             
              <th className="py-4 px-6 lg:text-lg md:text-md text-sm text-left border-b">Location</th>
              <th className="py-4 px-6 lg:text-lg md:text-md text-sm border-b text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 border-b transition duration-300">
                <td className="py-4 px-6 border-b lg:text-lg md:text-md text-sm font-medium">{user.firstName} {user.lastName}</td>
                <td className="py-4 px-6 border-b lg:text-lg md:text-md text-sm  font-medium">{user.email}</td>
     
                <td className="py-4 px-6 border-b lg:text-lg md:text-md text-sm  font-medium">{user.location.address}, {user.location.city}, {user.location.postalCode}</td>
                <td className="py-4 px-6 border-b text-end">
                  <button 
                    className="bg-red-500 hover:scale-110 scale-100 transition-all duration-100 text-white py-2 px-4 rounded-md"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
