import { Form, Input, message } from "antd";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import { AuthContext } from "../../../Provider/AuthProvider";
import { validateEmail } from "../../../lib/utils";

const Login = () => {
  const { googleSignIn, auths, setAuths, login, facebookSignIn } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [allUser, setAllUser] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users");
        setAllUser(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  if (navigation.state === "loading") {
    return <progress className="progress w-56"></progress>;
  }

  const onFinish = async ({ email, password }) => {
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleGoogle = async () => {
    try {
      const result = await googleSignIn();
      const user = result.user;

      const fullName = user.displayName.split(" ");
      const firstName = fullName[0];
      const lastName = fullName.slice(1).join(" ");

      const saveUser = {
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        user_image: user?.photoURL,
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/user",
          saveUser,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data)
        const { token, user } = response.data;
        if (user) {
          console.log("🚀 ~ handleGoogleLogin ~ userData:", user);
          setAuths({ status: "firebase", user});
          localStorage.setItem("access-token", token);
          message.success("Login successful"); // Display success message
          navigate(from, { replace: true });
          navigate("/");
        }
        
      } catch (error) {
        console.error("Error posting user data:", error);
      }
    } catch (error) {
      console.error("Google sign-in error:", error.message);
    }
  };
  const handleFB = async () => {
    try {
      const result = await facebookSignIn();
      const user = result.user;

      const fullName = user.displayName.split(" ");
      const firstName = fullName[0];
      const lastName = fullName.slice(1).join(" ");

      const saveUser = {
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        user_image: user?.photoURL,
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/user",
          saveUser,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data)
        const { token, user } = response.data;
        if (user) {
          console.log("🚀 ~ handleGoogleLogin ~ userData:", user);
          setAuths({ status: "firebase", user});
          localStorage.setItem("access-token", token);
          message.success("Login successful"); // Display success message
          navigate(from, { replace: true });
          navigate("/");
        }
        
      } catch (error) {
        console.error("Error posting user data:", error);
      }
    } catch (error) {
      console.error("Google sign-in error:", error.message);
    }
  };

  if(auths?.user)
    {
      navigate(from, { replace: true });
    }


  return (
    <div className="mt-5">
      <div className="flex justify-center lg:flex-row flex-col lg:gap-16 justify-items-center items-center lg:px-44">
        <div className="lg:w-[450px] lg:flex-row flex-col shadow-2xl rounded-lg">
          <div className="p-2">
            <div className="flex flex-col lg:w-auto border-opacity-50 ">
              <div className="grid card rounded-box place-items-center">
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    className="btn btn-wide rounded-3xl hover:border hover:border-blue-500"
                    onClick={handleFB}
                  >
                    <FaFacebook size="2em" color="blue" />{" "}
                    <span className="text-black font-medium rounded-3xl">
                      Continue With Facebook
                    </span>
                  </button>
                  <button
                    className="btn btn-wide rounded-3xl hover:border hover:border-blue-500 mt-3"
                    onClick={handleGoogle}
                  >
                    <FcGoogle size="2.2em" />
                    <span className="text-black font-medium rounded-3xl">
                      Continue With Google
                    </span>
                  </button>
                </div>
              </div>
              <div className="divider">OR</div>
              <div className="grid card rounded-box place-items-center">
                <div>
                  <Form
                    name="basic"
                    labelCol={{
                      span: 8,
                    }}
                    wrapperCol={{
                      span: 16,
                    }}
                    initialValues={{
                      remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                  >
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Please input your email!",
                        },
                        {
                          validator: (rule, value) => {
                            if (!validateEmail(value)) {
                              return Promise.reject(
                                "Please input a valid email address!"
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input placeholder="Enter your Email" />
                    </Form.Item>
                    <Form.Item
                      label="Password"
                      name="password"
                      className="mb-5 "
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Input.Password placeholder="Enter your password" />
                    </Form.Item>
                    <Form.Item
                      wrapperCol={{
                        offset: 0,
                        span: 24,
                      }}
                      className="flex items-left justify-end"
                    >
                      <a className="login-form-forgot" href="/forgetPassword">
                        Forgot Password ?
                      </a>
                    </Form.Item>
                    <Form.Item
                      wrapperCol={{
                        offset: 0,
                        span: 24,
                      }}
                    >
                      <button
                        className="btn rounded-3xl w-full border border-blue-500 bg-blue-400 text-white"
                        type="submit"
                      >
                        Login
                      </button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
