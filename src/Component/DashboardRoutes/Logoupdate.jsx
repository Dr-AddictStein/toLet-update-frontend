import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { Button, Form, Upload, message } from "antd";

const Logoupdate = () => {
  const [logoData, setLogoData] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchLogoData();
  }, []);

  const fetchLogoData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/logo`, {
        method: "GET",
      });

      const data = await res.json();
      setFileList([]);
      setLogoData(data);
    } catch (error) {
      console.error("Error fetching gallery data:", error);
    }
  };

  const onFinish = async (values) => {
    if (fileList.length === 0) {
      message.error("No file selected for upload.");
      return;
    }

    const data = new FormData();
    data.append("images", fileList[0].originFileObj);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    try {
      const response = await axios.post(`http://localhost:5000/logoUpdate`, data, config);
      setLogoData(response.data);
      message.success("Image Uploaded Successfully!");
      window.location.reload();
    } catch (error) {
      message.error("Failed to upload image. Please try again later.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const normFile = (e) => {
    setFileList(e.fileList);
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

  return (
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
          name="user_image"
          valuePropName="fileList"
          label="Logo"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: "Please upload an Image!",
            },
          ]}
        >
          <Upload name="logo" action="/upload.do" listType="picture" {...props}>
            <Button icon={<UploadOutlined />}>Click to upload Image</Button>
          </Upload>
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
            Upload
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Logoupdate;
