import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Button, Form, Input, Upload, message } from "antd";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import { validateEmail } from "../../../lib/utils";
import { AuthContext } from "../../../Provider/AuthProvider";
import axios from "axios";
import Lottie from "lottie-react";
import house2 from "../../../assets/signup.json";
import { UploadOutlined } from "@ant-design/icons";

const SignUp = () => {
  const { googleSignIn,auths, setAuths, facebookSignIn } = useContext(AuthContext);
  const navigate = useNavigate(); // Import useNavigate hook to redirect after signup
  const navigation = useNavigation();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  console.log("🚀 ~ SignUp ~ from:", from)
  const [fileList, setFileList] = useState([]);
  console.log("🚀 ~ SignUp ~ fileList:", fileList)

  if (navigation.state === "loading") {
    return <progress className="progress w-56"></progress>;
  }

  const onFinish = async (values) => {
    console.log(values);
    const data = new FormData();
    data.append("firstName", values.firstName);
    data.append("lastName", values.lastName);
    data.append("email", values.email);
    data.append("phone", values.contactNumber);
    data.append("password", values.password);
    data.append("age", values.age);
    data.append("address", values.address);
    data.append("city", values.city);
    data.append("postalCode", values.postalCode);
    data.append("images", fileList[0].originFileObj);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    const url = "http://localhost:5000/signup";

    try {
      const response = await axios.post(url, data, config);
      setAuths({ status: "manual", user: response.data.user });
      message.success("Signup successful");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Signup failed:", error?.response?.data?.error);
      // Display error message using Ant Design message component
      message.error("Failed to signup. Please try again later.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const normFile = (e) => {
    setFileList(e.fileList);
    // console.log(e.fileList);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const props = {
    multiple: false,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: () => {
      return false;
    },
    fileList,
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
    <div className="w-full flex justify-center px-4">
      <div className="flex justify-center lg:flex-row flex-col lg:gap-16 justify-items-center items-center">
        <div className="lg:w-[500px] lg:flex-row flex-col shadow-2xl rounded-lg mt-5">
          <div className="p-2">
            <div className="flex flex-col lg:w-auto border-opacity-50 ">
              <div className="grid rounded-xl place-items-center">
                <div className="flex flex-col gap-2 mt-5">
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
                    className="btn btn-wide rounded-3xl hover:border hover:border-blue-500"
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
              <div className="grid rounded-box place-items-center px-2">
                <h1 className="mb-5 font-semibold text-lg">Sign up with your work email.</h1>
                <div>
                  <Form
                    name="basic"
                    labelCol={{
                      span: 10,
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
                      label="First Name"
                      name="firstName"
                      className="mb-4"
                      rules={[
                        {
                          required: true,
                          message: "Please input your username!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your FirstName" />
                    </Form.Item>
                    <Form.Item
                      label="Last Name"
                      name="lastName"
                      className="mb-4"
                      rules={[
                        {
                          required: true,
                          message: "Please input your username!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your FirstName" />
                    </Form.Item>
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
                      label="Contact Number"
                      name="contactNumber"
                      className="mb-5 "
                      rules={[
                        {
                          required: true,
                          message: "Please input your contact number!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter contact number" />
                    </Form.Item>
                    <Form.Item
                      name="age"
                      label="Age"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Enter age"/>
                    </Form.Item>
                    <Form.Item
                      name="user_image"
                      valuePropName="fileList"
                      label="Image"
                      getValueFromEvent={normFile}
                      rules={[
                        {
                          required: true,
                          message: "Please upload a Image!",
                        },
                      ]}
                    >
                      <Upload
                        name="logo"
                        action="/upload.do"
                        listType="picture"
                        {...props}
                      >
                        <Button icon={<UploadOutlined />}>
                          Click to upload Image
                        </Button>
                      </Upload>
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
                      label="Address"
                      name="address"
                      className="mb-5 "
                      rules={[
                        {
                          required: true,
                          message: "Please input your location!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your location" />
                    </Form.Item>
                    <Form.Item
                      label="City"
                      name="city"
                      className="mb-5 "
                      rules={[
                        {
                          required: true,
                          message: "Please input your city!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your city" />
                    </Form.Item>
                    <Form.Item
                      label="Postal Code"
                      name="postalCode"
                      className="mb-5 "
                      rules={[
                        {
                          required: true,
                          message: "Please input your postal code!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your postal code" />
                    </Form.Item>
                    <Form.Item
                      wrapperCol={{
                        offset: 0,
                        span: 24,
                      }}
                    >
                      <button
                        className="btn rounded-3xl w-full border border-blue-500"
                        type="submit"
                      >
                        SignUp
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

export default SignUp;
