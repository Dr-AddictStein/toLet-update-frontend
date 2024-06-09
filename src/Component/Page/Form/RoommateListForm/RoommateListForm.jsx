import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { message } from "antd";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import * as React from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../Provider/AuthProvider";
const steps = [
  {
    label: "DESCRIPTION",
  },
  {
    label: "ROOMMATE PREFERENCES",
  },
  {
    label: "IMAGE",
  },
  {
    label: "CONTACT PERSON",
  },
];

export default function CreateFlatListForm() {
  const mapRef = React.useRef(null);
  const [showAddress, setShowAddress] = React.useState(true);
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    bedroomType: "",
    date: "",
    bathroom: "",
    size: "",
    rent: "",
    address: "",
    city: "",
    postalCode: "",
    firstName: "",
    lastName: "",
    phone: "",
    userEmploymentStatus: "",
    image: "",
    gender: "",
    pets: "",
    smoking: "",
    employmentStatus: "",
    userGender: "",
  });

  const { auths } = React.useContext(AuthContext);

  // console.log(auths.user);
  const navigate = useNavigate();
  const [images, setImages] = React.useState([]);
  const [image, setImage] = React.useState([]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };

  const handleChange = (e) => {
    const { name, checked, value, files } = e.target;

    if (name === "shared" || name === "private") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        bedroomType: checked ? name : "",
      }));
    } else if (name === "male" || name === "female") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        gender: checked ? name : "",
      }));
    } else if (name === "okay" || name === "not okay") {
      // Handle pets and smoking checkboxes
      setFormData((prevFormData) => ({
        ...prevFormData,
        pets: checked ? name : "",
      }));
    } else if (name === "working" || name === "student") {
      // Handle pets and smoking checkboxes
      setFormData((prevFormData) => ({
        ...prevFormData,
        employmentStatus: checked ? name : "",
      }));
    } else if (name === "Okay" || name === "Not Okay") {
      // Handle pets and smoking checkboxes
      setFormData((prevFormData) => ({
        ...prevFormData,
        smoking: checked ? name : "",
      }));
    } else if (name === "Working" || name === "Student") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        userEmploymentStatus: checked ? name : "",
      }));
    } else if (name === "Male" || name === "Female") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        userGender: checked ? name : "",
      }));
    } else {
      // Handle other input fields
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    if (name === "images" && files && files.length > 0) {
      const filesArray = Array.from(files);

      // const filesToAdd = filesArray.slice(0, -1);
      setImages((prevImages) => [...prevImages, ...filesArray]);
    }
    if (name === "image" && files && files.length > 0) {
      // Handle single file differently
      const selectedFile = files[files.length - 1];
      setImage(selectedFile);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("userEmail", auths?.user?.email);
      formDataToSend.append("userId", auths?.user?._id);
      formDataToSend.append("bedroomType", formData.bedroomType);
      formDataToSend.append("availableFrom", formData.date);
      formDataToSend.append("bedroom", formData.bedroom);
      formDataToSend.append("bathroom", formData.bathroom);
      formDataToSend.append("size", formData.size);
      formDataToSend.append("rent", formData.rent);
      formDataToSend.append("lat", center[0]);
      formDataToSend.append("lon", center[1]);
      formDataToSend.append("address", address);
      formDataToSend.append("city", cityName);
      formDataToSend.append("postalCode", formData.postalCode);

      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("pets", formData.pets);
      formDataToSend.append("smoking", formData.smoking);
      formDataToSend.append("employmentStatus", formData.employmentStatus);

      formDataToSend.append("userGender", formData.userGender);
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append(
        "userEmploymentStatus",
        formData.userEmploymentStatus
      );
      if (image) {
        formDataToSend.append("image", image);
      }
      images.forEach((image, index) => {
        formDataToSend.append("images", image);
      });
      console.log("ggggggggggggggg", formDataToSend);

      const response = await fetch("http://localhost:5000/add/roommateList", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        message.success("Form submitted successfully!");
        // console.log("Form data submitted successfully");
        // console.log(formDataToSend);
        navigate("/");
      } else {
        console.error("Failed to submit form data");
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };
  //new code

  //addressChanged Handler
  const closeHandleModal=()=>{
    setOpenModal(false)
    setShowAddress(false)
   }
  const [skipped, setSkipped] = React.useState(new Set());

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext1 = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };
  // Custom hook to handle map events
  const MapEvents = () => {
    const map = useMapEvents({
      click: handleClick,
    });

    return null;
  };
  const [address, setAddress] = React.useState("");
  const handleClick = (event) => {
    const { lat, lng } = event.latlng;
    console.log(event);
    axios
      .get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      )
      .then((response) => {
        console.log(response.data.display_name);
        // You can now use the address in your application
        setOpenModal(false);
        setAddress(response.data.display_name);
      })
      .catch((error) => {
        console.error("Error fetching address:", error);
      });
  };

  const [center, setCenter] = React.useState([23.8041, 90.4152]);
  const [openModal, setOpenModal] = React.useState(false);
  const [cityName, setCityName] = React.useState("");

  React.useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, 13);
    }
  }, [center]);

  const handleDistrictChange = async (event) => {
    const selectedCityName = event.target.value;
    setCityName(selectedCityName);
    const { data } = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${selectedCityName}`
    );
    if (data.length > 0) {
      setCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
    }
    setOpenModal(true);
  };

  const districts = [
    "Dhaka",
    "Chittagong",
    "Rajshahi",
    "Khulna",
    "Barisal",
    "Sylhet",
    "Rangpur",
    "Mymensingh",
  ];

  const map = (
    <MapContainer
      center={center}
      zoom={30}
      style={{
        height: "400px",
        width: "100%",
      }}
      ref={mapRef}
    >
      <MapEvents />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
  return (
    <>
      <div className="flex justify-center mt-5">
        <div className="w-8/12  md:block hidden">
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep}>
              {steps.map((labels, index) => {
                const stepProps = {};
                const labelProps = {};
                if (isStepOptional(index)) {
                  labelProps.optional = (
                    <Typography variant="caption"></Typography>
                  );
                }
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={index} {...stepProps}>
                    <StepLabel {...labelProps}>{labels.label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }} style={{ marginTop: "45px" }}>
                  {activeStep === 0 && (
                    <form>
                      <Grid container spacing={1}>
                        <Grid item sm={12} md={6}>
                          <InputLabel>BedroomType</InputLabel>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.bedroomType.shared}
                                onChange={handleChange}
                                name="shared"
                                color="primary"
                              />
                            }
                            label="Shared"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.bedroomType.private}
                                onChange={handleChange}
                                name="private"
                                color="primary"
                              />
                            }
                            label="Private"
                          />
                        </Grid>
                        <Grid item sm={12} md={6}>
                          <InputLabel>Date</InputLabel>
                          <TextField
                            required
                            fullWidth
                            name="date"
                            type="date"
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item sm={12} md={6}>
                          <InputLabel>Bathroom</InputLabel>
                          <div>
                            {[1, 2, 3, 4, 5, 6, 7].map((number) => (
                              <FormControlLabel
                                key={number}
                                control={
                                  <Checkbox
                                    checked={formData.bathroom.includes(
                                      number.toString()
                                    )}
                                    onChange={handleChange}
                                    name="bathroom"
                                    value={number.toString()}
                                    color="primary"
                                  />
                                }
                                label={number}
                              />
                            ))}
                          </div>
                        </Grid>
                        <Grid item sm={12} md={6}>
                          <InputLabel>Size (sqft)</InputLabel>
                          <TextField
                            required
                            fullWidth
                            id="number"
                            name="size"
                            type="number"
                            autoComplete="number"
                            autoFocus
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item sm={12} md={6}>
                          <InputLabel>Rent</InputLabel>
                          <TextField
                            required
                            fullWidth
                            id="number"
                            name="rent"
                            type="number"
                            autoComplete="number"
                            autoFocus
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item sm={12} md={6}>
                          <InputLabel>Enter City</InputLabel>
                          <FormControl
                            sx={{
                              width: "100%",
                              "@media (max-width: 768px)": {
                                minWidth: "unset",
                              },
                            }}
                          >
                            <Select
                              onChange={handleDistrictChange}
                              displayEmpty
                              inputProps={{
                                "aria-label": "Without label",
                              }}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {districts.map((district, index) => (
                                <MenuItem key={index} value={district}>
                                  {district}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>Select a district</FormHelperText>
                              
                          </FormControl>
                        </Grid>
                       { <Grid item sm={12} md={6}>
                          <InputLabel>Address</InputLabel>
                         {showAddress ? <TextField
                            required
                            fullWidth
                            value={address}
                            id="name"
                            name="address"
                            autoComplete="address"
                            autoFocus
                            placeholder="Address"
                            onChange={handleChange}
                          />:(
                            <input
                              required
                              fullWidth
                              id="name"
                              name="address"
                              className="w-full px-5 py-3.5 border rounded-md"
                              placeholder="Enter Your Address"
                              onChange={(e) => setAddress(e.target.value)}
                            />
                          )}
                           
                        </Grid>}

                        <Grid item sm={12} md={6}>
                          <InputLabel>Zip Code</InputLabel>
                          <TextField
                            required
                            fullWidth
                            id="number"
                            name="postalCode"
                            type="number"
                            autoComplete="number"
                            autoFocus
                            placeholder="Zip code (optional)"
                            onChange={handleChange}
                          />
                        </Grid>
                      </Grid>
                    </form>
                  )}
                  {activeStep === 1 && (
                    <form>
                      <Grid container spacing={1}>
                        <Grid item sm={12} md={6}>
                          <InputLabel>Preferred Gender</InputLabel>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.gender.male}
                                onChange={handleChange}
                                name="male"
                                color="primary"
                              />
                            }
                            label="Male"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.gender.female}
                                onChange={handleChange}
                                name="female"
                                color="primary"
                              />
                            }
                            label="Female"
                          />
                        </Grid>
                        <Grid item sm={12} md={6}>
                          <InputLabel>Pets</InputLabel>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.pets === "okay"}
                                onChange={handleChange}
                                name="okay"
                                color="primary"
                              />
                            }
                            label="Okay"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.pets === "not okay"}
                                onChange={handleChange}
                                name="not okay"
                                color="primary"
                              />
                            }
                            label="Not Okay"
                          />
                        </Grid>

                        <Grid item sm={12} md={6}>
                          <InputLabel>Smoking</InputLabel>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.smoking === "Okay"}
                                onChange={handleChange}
                                name="Okay"
                                color="primary"
                              />
                            }
                            label="Okay"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.smoking === "Not Okay"}
                                onChange={handleChange}
                                name="Not Okay"
                                color="primary"
                              />
                            }
                            label="Not Okay"
                          />
                        </Grid>

                        <Grid item sm={12} md={6}>
                          <InputLabel>Employment Status</InputLabel>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  formData.employmentStatus === "working"
                                }
                                onChange={handleChange}
                                name="working"
                                color="primary"
                              />
                            }
                            label="Working"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  formData.employmentStatus === "student"
                                }
                                onChange={handleChange}
                                name="student"
                                color="primary"
                              />
                            }
                            label="Student"
                          />
                        </Grid>
                      </Grid>
                    </form>
                  )}
                  {activeStep === 2 && (
                    <form>
                      <Grid container spacing={1}>
                        <Grid item sm={12} md={12}>
                          <div className="lg:col-span-2 rounded-lg border-4 border-dashed w-full group text-center py-5">
                            <label>
                              <div>
                                <img
                                  className="w-16 h-16 mx-auto object-center cursor-pointer"
                                  src="https://i.ibb.co/GJcs8tx/upload.png"
                                  alt="upload image"
                                />
                                <p>Drag your images here </p>
                                <p className="text-gray-600 text-xs">
                                  (Only *.jpeg, *.webp and *.png images will be
                                  accepted)
                                </p>
                              </div>
                              <input
                                type="file"
                                name="images"
                                multiple
                                className="hidden"
                                onChange={handleChange}
                              />
                            </label>
                          </div>
                        </Grid>
                        <Grid item sm={12} md={12}>
                          <div className="grid grid-cols-4 gap-4">
                            {images.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Uploaded ${index}`}
                                  className="w-full h-full object-cover border-2"
                                />
                                <button
                                  type="button"
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                  onClick={() => handleDelete(index)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-1.414-7.586a1 1 0 011.414-1.414L10 8.586l1.414-1.414a1 1 0 111.414 1.414L11.414 10l1.414 1.414a1 1 0 11-1.414 1.414L10 11.414l-1.414 1.414a1 1 0 01-1.414-1.414L8.586 10l-1.414-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </Grid>
                      </Grid>
                    </form>
                  )}

                  {activeStep === 3 && (
                    <form>
                      <div className="flex justify-center gap-6 mt-12">
                        <Paper>
                          <Box
                            component="form"
                            sx={{
                              "& .MuiTextField-root": { mt: 1 },
                            }}
                            style={{ padding: "4px" }}
                          >
                            
                            <Grid item sm={12} md={6}>
                              <InputLabel>Preferred Gender</InputLabel>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={formData.userGender === "Male"}
                                    onChange={handleChange}
                                    name="Male"
                                    color="primary"
                                  />
                                }
                                label="Male"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={formData.userGender === "Female"}
                                    onChange={handleChange}
                                    name="Female"
                                    color="primary"
                                  />
                                }
                                label="Female"
                              />
                            </Grid>
                            <Grid container spacing={1}>
                              <Grid item sm={12} md={6}>
                                <InputLabel>First Name</InputLabel>
                                <TextField
                                  required
                                  fullWidth
                                  name="firstName"
                                  autoComplete="firstName"
                                  type="text"
                                  onChange={handleChange}
                                />
                              </Grid>
                              <Grid item sm={12} md={6}>
                                <InputLabel>Last Name</InputLabel>
                                <TextField
                                  required
                                  fullWidth
                                  name="lastName"
                                  type="text"
                                  onChange={handleChange}
                                />
                              </Grid>

                              <Grid item sm={12} md={6}>
                                <InputLabel>Contact Number</InputLabel>
                                <TextField
                                  required
                                  fullWidth
                                  id="phone"
                                  name="phone"
                                  type="tel"
                                  autoComplete="tel"
                                  autoFocus
                                  onChange={handleChange}
                                />
                              </Grid>
                              
                              <Grid
                                item
                                sm={12}
                                md={6}
                                style={{
                                  marginTop: "30px",
                                  paddingRight: "9px",
                                }}
                              >
                                <InputLabel>Employment Status</InputLabel>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        formData.userEmploymentStatus ===
                                        "Working"
                                      }
                                      onChange={handleChange}
                                      name="Working"
                                      color="primary"
                                    />
                                  }
                                  label="Working"
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        formData.userEmploymentStatus ===
                                        "Student"
                                      }
                                      onChange={handleChange}
                                      name="Student"
                                      color="primary"
                                    />
                                  }
                                  label="Student"
                                />
                              </Grid>
                              <Grid item sm={12} md={6}>
                                <div>
                                  <img
                                    className="w-20 h-20 mx-auto object-center cursor-pointer"
                                    src="https://i.ibb.co/GJcs8tx/upload.png"
                                    alt="upload image"
                                  />
                                </div>
                                <input
                                  type="file"
                                  name="image"
                                  onChange={handleChange}
                                  className=""
                                />
                              </Grid>
                            </Grid>
                            { formData.bedroomType &&
                    formData.date &&
                    formData.bathroom &&
                    formData.size &&
                    formData.rent &&
                    cityName &&
                    address &&
                    formData.gender &&
                    formData.pets &&
                    formData.smoking &&
                    formData.employmentStatus &&
                            images.length > 0 &&
                            formData.userGender &&
                            formData.firstName &&
                            formData.lastName &&
                            formData.userEmploymentStatus &&
                            formData.phone &&
                            image ? (
                              <Button
                                type="submit"
                                fullWidth
                                onClick={handleSubmit}
                                variant="contained"
                                sx={{
                                  mt: 3,
                                  mb: 2,
                                }}
                              >
                                Submit
                              </Button>
                            ) : (
                              <button
                                disabled
                                className="bg-gray-300 w-full py-2 px-3 my-2"
                              >
                                Submit
                              </button>
                            )}
                          </Box>
                        </Paper>
                      </div>
                    </form>
                  )}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  {/* {isStepOptional(activeStep) && (
                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                      Skip
                    </Button>
                  )} */}

                   {activeStep === 0 &&
                    formData.bedroomType &&
                    formData.date &&
                    formData.bathroom &&
                    formData.size &&
                    formData.rent &&
                    cityName &&
                    address && (
                      <Button onClick={handleNext1}>
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    )}
                     {activeStep === 1 &&
                    formData.gender &&
                    formData.pets &&
                    formData.smoking &&
                    formData.employmentStatus &&
                     (
                      <Button onClick={handleNext1}>
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    )}
                  {activeStep === 2 && images.length > 0 && (
                    <Button onClick={handleNext1}>
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  )}
                </Box>
              </React.Fragment>
            )}
          </Box>
        </div>
      </div>

      <div className="flex justify-center pb-8 overflow-hidden">
        <div className="md:hidden">
          <Box sx={{ maxWidth: 280 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    optional={
                      index === 2 ? (
                        <Typography variant="caption"></Typography>
                      ) : null
                    }
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    <div>
                      {index === 0 && (
                        <form>
                          <form>
                            <Grid container spacing={1}>
                              <Grid item sm={12} md={6}>
                                <InputLabel>BedroomType</InputLabel>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={formData.bedroomType.shared}
                                      onChange={handleChange}
                                      name="shared"
                                      color="primary"
                                    />
                                  }
                                  label="Shared"
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={formData.bedroomType.private}
                                      onChange={handleChange}
                                      name="private"
                                      color="primary"
                                    />
                                  }
                                  label="Private"
                                />
                              </Grid>
                              <Grid item sm={12} md={6}>
                                <InputLabel>Date</InputLabel>
                                <TextField
                                  required
                                  fullWidth
                                  name="date"
                                  type="date"
                                  onChange={handleChange}
                                />
                              </Grid>
                              <Grid item sm={12} md={6}>
                                <InputLabel>Bathroom</InputLabel>
                                <div>
                                  {[1, 2, 3, 4, 5, 6, 7].map((number) => (
                                    <FormControlLabel
                                      key={number}
                                      control={
                                        <Checkbox
                                          checked={formData.bathroom.includes(
                                            number.toString()
                                          )}
                                          onChange={handleChange}
                                          name="bathroom"
                                          value={number.toString()}
                                          color="primary"
                                        />
                                      }
                                      label={number}
                                    />
                                  ))}
                                </div>
                              </Grid>
                              <Grid item sm={12} md={6}>
                                <InputLabel>Size (sqft)</InputLabel>
                                <TextField
                                  required
                                  fullWidth
                                  id="number"
                                  name="size"
                                  type="number"
                                  autoComplete="number"
                                  autoFocus
                                  onChange={handleChange}
                                />
                              </Grid>
                              <Grid item sm={12} md={6}>
                                <InputLabel>Rent</InputLabel>
                                <TextField
                                  required
                                  fullWidth
                                  id="number"
                                  name="rent"
                                  type="number"
                                  autoComplete="number"
                                  autoFocus
                                  onChange={handleChange}
                                />
                              </Grid>
                              
                              <Grid item sm={12} md={6}>
                                <InputLabel>City</InputLabel>
                                <FormControl
                                  sx={{
                                    width: "100%",
                                    "@media (max-width: 768px)": {
                                      minWidth: "unset",
                                    },
                                  }}
                                >
                                  <Select
                                    onChange={handleDistrictChange}
                                    displayEmpty
                                    inputProps={{
                                      "aria-label": "Without label",
                                    }}
                                  >
                                    <MenuItem value="">
                                      <em>Select City</em>
                                    </MenuItem>
                                    {districts.map((district, index) => (
                                      <MenuItem key={index} value={district}>
                                        {district}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  <FormHelperText>
                                    Select a district
                                  </FormHelperText>
                                    
                                </FormControl>
                              </Grid>
                              { <Grid item sm={12} md={6}>
                          <InputLabel>Address</InputLabel>
                            {showAddress ? <TextField
                            required
                            fullWidth
                            value={address}
                            id="name"
                            name="address"
                            autoComplete="address"
                            autoFocus
                            placeholder="Address"
                            onChange={handleChange}
                          />:(
                            <input
                              required
                              fullWidth
                              id="name"
                              name="address"
                              className="w-full px-5 py-3.5 border rounded-md"
                              placeholder="Enter Your Address"
                              onChange={(e) => setAddress(e.target.value)}
                            />
                          )}
                           
                        </Grid>}
                              <Grid item sm={12} md={6}>
                                <InputLabel>Zip Code</InputLabel>
                                <TextField
                                  required
                                  fullWidth
                                  id="number"
                                  name="postalCode"
                                  type="number"
                                  autoComplete="number"
                                  autoFocus
                                  placeholder="Postal code"
                                  onChange={handleChange}
                                />
                              </Grid>
                            </Grid>
                          </form>
                        </form>
                      )}

                      {index === 1 && (
                        <form>
                          <Grid container spacing={1}>
                            <Grid item sm={12} md={6}>
                              <InputLabel>Preferred Gender</InputLabel>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={formData.gender.male}
                                    onChange={handleChange}
                                    name="male"
                                    color="primary"
                                  />
                                }
                                label="Male"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={formData.gender.female}
                                    onChange={handleChange}
                                    name="female"
                                    color="primary"
                                  />
                                }
                                label="Female"
                              />
                            </Grid>
                            <Grid item sm={12} md={6}>
                              <InputLabel>Pets</InputLabel>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={formData.pets === "okay"}
                                    onChange={handleChange}
                                    name="okay"
                                    color="primary"
                                  />
                                }
                                label="Okay"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={formData.pets === "not okay"}
                                    onChange={handleChange}
                                    name="not okay"
                                    color="primary"
                                  />
                                }
                                label="Not Okay"
                              />
                            </Grid>

                            <Grid item sm={12} md={6}>
                              <InputLabel>Smoking</InputLabel>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={formData.smoking === "Okay"}
                                    onChange={handleChange}
                                    name="Okay"
                                    color="primary"
                                  />
                                }
                                label="Okay"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={formData.smoking === "Not Okay"}
                                    onChange={handleChange}
                                    name="Not Okay"
                                    color="primary"
                                  />
                                }
                                label="Not Okay"
                              />
                            </Grid>

                            <Grid item sm={12} md={6}>
                              <InputLabel>Employment Status</InputLabel>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={
                                      formData.employmentStatus === "working"
                                    }
                                    onChange={handleChange}
                                    name="working"
                                    color="primary"
                                  />
                                }
                                label="Working"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={
                                      formData.employmentStatus === "student"
                                    }
                                    onChange={handleChange}
                                    name="student"
                                    color="primary"
                                  />
                                }
                                label="Student"
                              />
                            </Grid>
                          </Grid>
                        </form>
                      )}

                      {index === 2 && (
                        <form>
                          <Grid container spacing={1}>
                            <Grid item sm={12} md={12}>
                              <div className="lg:col-span-2 rounded-lg border-4 border-dashed w-full group text-center py-5">
                                <label>
                                  <div>
                                    <img
                                      className="w-16 h-16 mx-auto object-center cursor-pointer"
                                      src="https://i.ibb.co/GJcs8tx/upload.png"
                                      alt="upload image"
                                    />
                                    <p>Drag your images here </p>
                                    <p className="text-gray-600 text-xs">
                                      (Only *.jpeg, *.webp and *.png images will
                                      be accepted)
                                    </p>
                                  </div>
                                  <input
                                    type="file"
                                    name="images"
                                    multiple
                                    className="hidden"
                                    onChange={handleChange}
                                  />
                                </label>
                              </div>
                            </Grid>
                          </Grid>
                        </form>
                      )}
                      {index === 3 && (
                        <form>
                          <div className="flex justify-center gap-6 mt-12">
                            <Paper>
                              <Box
                                component="form"
                                sx={{
                                  "& .MuiTextField-root": { mt: 1 },
                                }}
                                style={{ padding: "4px" }}
                              >
                                <Grid item sm={12} md={6}>
                                  <InputLabel>Preferred Gender</InputLabel>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={formData.userGender === "Male"}
                                        onChange={handleChange}
                                        name="Male"
                                        color="primary"
                                      />
                                    }
                                    label="Male"
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={
                                          formData.userGender === "Female"
                                        }
                                        onChange={handleChange}
                                        name="Female"
                                        color="primary"
                                      />
                                    }
                                    label="Female"
                                  />
                                </Grid>
                                <Grid container spacing={1}>
                                  <Grid item sm={12} md={6}>
                                    <InputLabel>First Name</InputLabel>
                                    <TextField
                                      required
                                      fullWidth
                                      name="firstName"
                                      autoComplete="firstName"
                                      type="text"
                                      onChange={handleChange}
                                    />
                                  </Grid>
                                  <Grid item sm={12} md={6}>
                                    <InputLabel>Last Name</InputLabel>
                                    <TextField
                                      required
                                      fullWidth
                                      name="lastName"
                                      type="text"
                                      onChange={handleChange}
                                    />
                                  </Grid>

                                  <Grid item sm={12} md={6}>
                                    <InputLabel>Contact Number</InputLabel>
                                    <TextField
                                      required
                                      fullWidth
                                      id="phone"
                                      name="phone"
                                      type="tel"
                                      autoComplete="tel"
                                      autoFocus
                                      onChange={handleChange}
                                    />
                                  </Grid>
                                 
                                  <Grid
                                    item
                                    sm={12}
                                    md={6}
                                    style={{
                                      marginTop: "30px",
                                      paddingRight: "9px",
                                    }}
                                  >
                                    <InputLabel>Employment Status</InputLabel>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={
                                            formData.userEmploymentStatus ===
                                            "Working"
                                          }
                                          onChange={handleChange}
                                          name="Working"
                                          color="primary"
                                        />
                                      }
                                      label="Working"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={
                                            formData.userEmploymentStatus ===
                                            "Student"
                                          }
                                          onChange={handleChange}
                                          name="Student"
                                          color="primary"
                                        />
                                      }
                                      label="Student"
                                    />
                                  </Grid>
                                  <Grid item sm={12} md={6}>
                                    <div>
                                      <img
                                        className="w-20 h-20 mx-auto object-center cursor-pointer"
                                        src="https://i.ibb.co/GJcs8tx/upload.png"
                                        alt="upload image"
                                      />
                                    </div>
                                    <input
                                      type="file"
                                      name="image"
                                      onChange={handleChange}
                                      className=""
                                    />
                                  </Grid>
                                </Grid>
                                { formData.bedroomType &&
                    formData.date &&
                    formData.bathroom &&
                    formData.size &&
                    formData.rent &&
                    cityName &&
                    address &&
                    formData.gender &&
                    formData.pets &&
                    formData.smoking &&
                    formData.employmentStatus &&
                            images.length > 0 &&
                            formData.userGender &&
                            formData.firstName &&
                            formData.lastName &&
                            formData.userEmploymentStatus &&
                            formData.phone &&
                            image ? (
                              <Button
                                type="submit"
                                fullWidth
                                onClick={handleSubmit}
                                variant="contained"
                                sx={{
                                  mt: 3,
                                  mb: 2,
                                }}
                              >
                                Submit
                              </Button>
                            ) : (
                              <button
                                disabled
                                className="bg-gray-300 w-full py-2 px-3 my-2"
                              >
                                Submit
                              </button>
                            )}
                              </Box>
                            </Paper>
                          </div>
                        </form>
                      )}
                      {/* Add other form fields here for other steps */}
                    </div>
                    <Box sx={{ mb: 2 }}>
                      <div>
                     
                         <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                        {index === 0 &&
                    formData.bedroomType &&
                    formData.date &&
                    formData.bathroom &&
                    formData.size &&
                    formData.rent &&
                    cityName &&
                    address && (
                      <Button onClick={handleNext1} sx={{ mt: 1, mr: 1 }}>
                        {index === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    )}
                     {index === 1 &&
                    formData.gender &&
                    formData.pets &&
                    formData.smoking &&
                    formData.employmentStatus &&
                     (
                      <Button onClick={handleNext1} sx={{ mt: 1, mr: 1 }}>
                        {index === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    )}
                  {activeStep === 2 && images.length > 0 && (
                    <Button onClick={handleNext1} sx={{ mt: 1, mr: 1 }}>
                      {index === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  )}
                       
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>
                  All steps completed - you&apos;re finished
                </Typography>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Reset
                </Button>
              </Paper>
            )}
          </Box>
        </div>
      </div>
      <div className="mx-auto">
        <div
          onClick={() => setOpenModal(false)}
          className={`fixed z-[100] flex items-center justify-center ${
            openModal ? "visible opacity-100" : "invisible opacity-0"
          } inset-0 bg-black/20 backdrop-blur-sm duration-100 dark:bg-transparent`}
        >
          <div
            onClick={(e_) => e_.stopPropagation()}
            className={`text- absolute max-w-screen-xl rounded-lg bg-white p-6 drop-shadow-lg ${
              openModal
                ? "scale-1 opacity-1 duration-300"
                : "scale-0 opacity-0 duration-150"
            }`}
          >
            <div className="flex justify-end mb-3">
              <button
                onClick={closeHandleModal}
                className=" rounded-md border border-rose-600 px-6 py-[6px] text-rose-600 duration-150 hover:bg-rose-600 hover:text-white"
              >
                X
              </button>
            </div>
            <div className="w-72 md:max-w-[500px] lg:max-w-[700px] md:w-[700px]">
              {map}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
