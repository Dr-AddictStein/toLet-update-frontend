import { message } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
const ResetPassword = () => {
    const navigate = useNavigate()
    const { id, token } = useParams();

    const handleResetPassword = async (event) => {
      event.preventDefault();
      const form = event.target;
      const password = form.password.value;
  
      try {
        const response = await axios.post(`http://localhost:5000/reset-password/${id}/${token}`, {
          password: password,
        });
        if (response.data.Status === "Success") {
          message.success("Password reset successful.");
          navigate("/login");
        } else {
          message.error("Error resetting password.");
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        message.error("An error occurred. Please try again later.");
      }
    };

    return (
      <div className="lg:w-1/2 w-11/12 mx-auto">
      <div className="flex justify-between gap-20 md:py-36 py-12">
        <div className="w-[600px] bg-[#edf7f4] custom-shadow rounded-lg p-8 mb-4">
          <h2 className="text-2xl text-center font-semibold mb-3 uppercase">
            Reset Password
          </h2>
          <form onSubmit={handleResetPassword}>
            <div className="flex flex-col gap-5">
              <div className="pb-2">
                <label htmlFor="password">Password</label>
                <br />
                <input
                  className="bg-[#f5f5f5] rounded p-2 border-slate-300 border w-full"
                  type="password"
                  name="password"
                  id=""
                  required
                />
              </div>
              <div className="flex gap-2 mb-3">
                <button className="w-full bg-[#1d9cb5] rounded text-white font-semibold p-2 mt-3">
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    )
  }
  

export default ResetPassword