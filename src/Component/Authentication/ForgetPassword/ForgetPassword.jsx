import { message } from 'antd'
import axios from 'axios'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ForgetPassword = () => {
  
  const navigate = useNavigate()

  const handlePassword = async(event) => {
      event.preventDefault();
      const form = event.target
      const email = form.email.value

      try {
        const response = await axios.post(
          `http://localhost:5000/forgot-password/${email}`
        );
        if (response.data.Status === "Success") {
          message.success("Password reset link sent successfully.");
        } else {
          message.error("User does not exist.");
        }
      } catch (error) {
        console.error("Error sending forgot password request:", error);
        message.error("An error occurred. Please try again later.");
      }
    };
  return (
    <div className="w-full max-w-md p-8 space-y-3 rounded-xl border bg-white font-sans mx-auto lg:mt-24 mt-5">
      <div className='flex justify-between'>
      <h1 className="text-3xl font-bold text-center text-black">Password</h1>
      <Link to="/login"><h1 className="text-base font-medium text-center text-blue-400 mt-5">Back to login</h1></Link>
      </div>
        {/* Input fields and the form started */}
        <form onSubmit={handlePassword} className="space-y-6">

        <div className="flex flex-col gap-5">
              <div className="pb-2">
                <label htmlFor="email">Email</label>
                <br />
                <input
                  className="bg-[#f5f5f5] rounded p-2 border-slate-300 border w-full"
                  type="email"
                  name="email"
                  id=""
                  required
                />
              </div>
              <div className="flex gap-2 mb-3">
                <button type='submit' className="w-full bg-[#3c6cd1] rounded text-white font-semibold p-2 mt-3">
                  Send
                </button>
              </div>
            </div>

        </form>
       
    </div>
  )
}

export default ForgetPassword