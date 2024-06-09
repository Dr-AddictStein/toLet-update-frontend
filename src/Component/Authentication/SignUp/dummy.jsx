import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Button, Form, Input, Upload, message } from "antd";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { validateEmail } from "../../../lib/utils";
import { AuthContext } from "../../../Provider/AuthProvider";
import axios from "axios";
import Lottie from "lottie-react";
import house2 from "../../../assets/signup.json";
import { UploadOutlined } from "@ant-design/icons";

const SignUp = () => {
  const { googleSignIn, setAuths } = useContext(AuthContext);
  const [fileList, setFileList] = useState([]);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate(); // Import useNavigate hook to redirect after signup
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onFinish = async (values) => {
    setFormData({ ...formData, ...values });
    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("age", formData.age);
    data.append("address", formData.address);
    data.append("city", formData.city);
    data.append("postalCode", formData.postalCode);

    data.append("images", fileList[0].originFileObj);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    const url = "http://localhost:5000/signup";
    try {
      const response = await axios.post(url, data, config);
      setAuths(response.data.user);
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
    console.log(e.fileList);
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

  const handleGoogle = () => {
    googleSignIn()
      .then((result) => {
        const user = result.user;
        console.log(user);

        const fullName = user.displayName.split(" ");
        const firstName = fullName[0];
        const lastName = fullName.slice(1).join(" ");

        console.log(user);
        const saveUser = {
          firstName: firstName,
          lastName: lastName,
          email: user.email,
          password: "",
          user_image: user?.photoURL,
          age: "",
          location: {
            address: "",
            city: "",
            postalCode: "",
          },
        };
        console.log(saveUser);
        axios
          .post("http://localhost:5000/user", saveUser, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then(() => {
            message.success("Login successful"); // Display success message
            navigate(from, { replace: true });
          })
          .catch((error) => {
            console.error("Error posting user data:", error);
          });
      })
      .catch((error) => {
        console.error("Google sign-in error:", error.message);
      });
  };
  return (
    <div className="w-full">
      <div className="flex  justify-center justify-items-center items-center">
        <div className="card w-96 border border-black shadow-2xl">
          <div className="card-body">
            <div className="flex flex-col w-auto border-opacity-50 ">
              <div className="grid card rounded-box place-items-center">
                <div className="flex flex-col gap-2">
                  <button className="btn border-black btn-wide bg-[#1877F2]">
                    <FaFacebook size="2em" color="white" />{" "}
                    <span className="text-white font-bold">
                      Continue With Facebook
                    </span>
                  </button>
                  <button
                    className="btn border-2 border-black btn-wide"
                    onClick={handleGoogle}
                  >
                    <FcGoogle size="2.2em" />
                    <span className="text-black font-bold">
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
                      name="age"
                      label="Age"
                      rules={[{ required: true }]}
                    >
                      <Input />
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
                        span: 10,
                      }}
                    >
                      <button
                        className="btn btn-wide border-2 border-black btn-accent"
                        type="submit"
                      >
                        SignUp with Email
                      </button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Lottie
            animationData={house2}
            loop={true}
            style={{ width: "800px", height: "600px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
