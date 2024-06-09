/* eslint-disable no-unused-vars */
import Lottie from "lottie-react";
import { Button, Form, Input, Upload, message } from "antd";
import users from "../../../assets/user.json";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Provider/AuthProvider";
import axios from "axios";

const MyAccount = () => {
  const { auths, setAuths } = useContext(AuthContext);
  const user = auths?.user;
  console.log("🚀 ~ MyAccount ~ user:", user);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    age: user?.age || "",
    address: user?.location?.address || "",
    city: user?.location?.city || "",
    postalCode: user?.location?.postalCode || "",
    phone: user?.phone || "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName || user?.firstName);
      formDataToSend.append("lastName", formData.lastName || user?.lastName);
      formDataToSend.append("age", formData.age || user?.age);
      formDataToSend.append("address", formData.address || user?.location?.address);
      formDataToSend.append("city", formData.city || user?.location?.city);
      formDataToSend.append("postalCode", formData.postalCode || user?.location?.postalCode);
      formDataToSend.append("phone", formData.phone || user?.phone);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("images", formData.images);
      formDataToSend.append("user_image", user?.user_image);
      formDataToSend.append("oldPass", user?.password);
      formDataToSend.append("isUpdate", formData.password ? "False" : "True");

      const response = await axios.patch(
        `http://localhost:5000/update/${user?.email}`,
        formDataToSend
      );

      console.log("Response", response);
      const { token, user: updatedUser } = response.data;
      if (updatedUser) {
        message.success("Profile update successful");
        setAuths({ status: "manual", user: updatedUser });
        localStorage.setItem("access-token", token);
      } else {
        message.error(response.data.toast || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update failed:", error.response?.data?.error);
      message.error("Failed to update profile");
    }
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData({ ...formData, images: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
   <>
<div className="px-4">
      <div className="flex lg:justify-around md:flex-row flex-col gap-5 lg:gap-44 lg:px-20 mt-10 md:px-5 mb-10">
       <div className="lg:w-[35%] bg-white shadow-lg">
            <img
                alt="profile"
                src={user?.user_image}
                className="mx-auto object-cover rounded-full h-16 w-16 lg:h-32 lg:w-32"
              />
              <div className="flex px-16 mt-12">
                <div className="">
                  <p className="flex mr-3 text-lg">
                    First Name : {user?.firstName}
                  </p>
                  <p className="flex flex-col mt-3 text-lg">
                    Last Name : {user?.lastName}
                  </p>
                  <p className="flex flex-col mt-3 text-lg">Age:{user?.age}</p>

                  <p className="flex flex-col mt-3 text-lg">
                    Address: {user?.location?.address}
                  </p>
                  <p className="flex flex-col mt-3 text-lg">
                    City: {user?.location?.city}
                  </p>
                  <p className="flex flex-col mt-4 text-lg">
                    Postal code: {user?.location?.postalCode}
                  </p>
                  <p className="flex mr-3 text-lg mt-4 mb-10">
                    Contact Number : {user?.phone}
                  </p>

                </div>
              </div>
            </div>

     
     <div className="lg:w-[35%] bg-white rounded-md shadow-lg p-3 px-5 mt-5">
        <h2 className="text-2xl font-semibold mb-4 text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit} >
          <div className="">
            <label htmlFor="firstName" className="block text-base text-gray-700">
              First Name:
            </label>
            <input
          type="text"
          name="firstName"
          value={formData?.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="mt-1 p-1 rounded-md border w-full focus:outline-none focus:ring focus:border-blue-300"
        />
          </div>

          <div className="mb-2">
            <label htmlFor="lastName" className="block text-base mt-5 text-gray-700">
            Last Name:
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData?.lastName}
              onChange={handleChange}
              className="mt-1 p-1 rounded-md border w-full focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="age" className="block mt-4 text-base text-gray-700">
              Age:
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData?.age}
              onChange={handleChange}
              className="mt-1 p-1 rounded-md border w-full focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="space-y-4 flex flex-col justify-center mb-2">

      <div className="mt-2">
      <label htmlFor="images" className="block mb-2 text-base text-gray-700">Upload Image</label>
      <input
          type="file"
          name="images"
          onChange={handleChange}
          className="mt-1 py-1 rounded-md border w-full focus:outline-none focus:ring focus:border-blue-300"
        />
        {formData.images && (
          <img src={URL.createObjectURL(formData.images)} alt="Selected" className="w-16 h-12" />
        )}
      </div>
          </div>

          <div className="mb-2">
            <label htmlFor="address" className="block mt-4 text-base text-gray-700">
             Address:
            </label>
            <input 
            className="mt-1 p-2 rounded-md border w-full focus:outline-none focus:ring focus:border-blue-300"
              type="text"
              id="address"
              name="address"
              value={formData?.address}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label htmlFor="city" className="block mt-4 text-base text-gray-700">
             City:
            </label>
            <input 
            className=" p-2 rounded-md mt-2 border w-full focus:outline-none focus:ring focus:border-blue-300"
              type="text"
              id="city"
              name="city"
              value={formData?.city}
              onChange={handleChange}
            
            />
          </div>

          <div className="mb-2">
            <label htmlFor="postalCode" className="block mt-4 text-base text-gray-700">
             Postal Code:
            </label>
            <input 
            className="mt-1 p-2 rounded-md border w-full focus:outline-none focus:ring focus:border-blue-300"
              type="number"
              id="postalCode"
              name="postalCode"
              value={formData?.postalCode}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="expiredDate" className="block mt-4 text-base text-gray-700">
             Contact Number:
            </label>
            <input 
            className="mt-1 p-2 rounded-md border w-full focus:outline-none focus:ring focus:border-blue-300"
              type="number"
              id="phone"
              name="phone"
              value={formData?.phone}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block mt-4 text-base text-gray-700">
             Password:
            </label>
            <input 
             className="mt-1 p-2 rounded-md border w-full focus:outline-none focus:ring focus:border-blue-300"
              type="text"
              id="password"
              name="password"
              placeholder="Enter new password"
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-400 text-white p-2 mt-3 rounded-md w-full hover-bg-blue-700 transition-all duration-300"
          >
           update
          </button>
        </form>
      </div>
    </div>
</div>
   


   
   </>
  );
};

export default MyAccount;
