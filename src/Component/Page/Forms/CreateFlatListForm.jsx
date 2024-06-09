import * as React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Grid,
  Input,
  Paper,
  Box,
  IconButton,
  StepContent,
  InputLabel,
} from "@mui/material";
import { AuthContext } from "../../../Provider/AuthProvider";
import { message } from "antd";
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

  console.log(auths.user);

  const [images, setImages] = React.useState([]);

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
    e.preventDefault();
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      const selectedFiles = Array.from(files);
      setImages((prevImages) => [...prevImages, ...selectedFiles]);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  console.log(images);
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { userEmail } = auths.user?.email;
      const { userId } = auths.user?._id;
      const formDataToSend = new FormData();
      formDataToSend.append("userEmail", userEmail);
      formDataToSend.append("userId", userId);
      formDataToSend.append("bedroomType", formData.bedroomType);
      formDataToSend.append("availableFrom", formData.date);
      formDataToSend.append("bedroom", formData.bedroom);
      formDataToSend.append("bathroom", formData.bathroom);
      formDataToSend.append("size", formData.size);
      formDataToSend.append("rent", formData.rent);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("postalCode", formData.postalCode);

      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("pets", formData.pets);
      formDataToSend.append("smoking", formData.smoking);
      formDataToSend.append("employmentStatus", formData.employmentStatus);

      formDataToSend.append("userGender", formData.userGender);
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("Phone", formData.phone);
      formDataToSend.append(
        "userEmploymentStatus",
        formData.userEmploymentStatus
      );
      if (formData.image) {
        formDataToSend.append("image", formData.image);
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
      } else {
        console.error("Failed to submit form data");
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };
  //new code

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

  return (
    <>
      <div className="flex justify-start lg:justify-center mt-5">
        <div className=" w-6/12  md:block hidden">
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
                          <InputLabel>bedroomType</InputLabel>
                          <TextField
                            required
                            fullWidth
                            id="bedroomType"
                            name="bedroomType"
                            autoComplete="bedroomType"
                            placeholder="Private or Shared"
                            autoFocus
                            onChange={handleChange}
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
                          <TextField
                            required
                            fullWidth
                            id="number"
                            name="bathroom"
                            type="number"
                            autoComplete="number"
                            autoFocus
                            onChange={handleChange}
                          />
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
                          <InputLabel>Address</InputLabel>
                          <TextField
                            required
                            fullWidth
                            id="name"
                            name="address"
                            autoComplete="address"
                            autoFocus
                            placeholder="Address"
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item sm={12} md={6}>
                          <InputLabel>Enter City</InputLabel>
                          <TextField
                            required
                            fullWidth
                            name="city"
                            type="text"
                            placeholder="City"
                            onChange={handleChange}
                          />
                        </Grid>
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
                  )}
                  {activeStep === 1 && (
                    <form>
                      <Grid container spacing={1}>
                        <Grid item sm={12} md={6}>
                          <InputLabel>Preferred Gender</InputLabel>
                          <TextField
                            required
                            fullWidth
                            id="userGender"
                            name="userGender"
                            autoComplete="userGender"
                            placeholder="Male or Female"
                            autoFocus
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item sm={12} md={6}>
                          <InputLabel>Pets</InputLabel>
                          <TextField
                            required
                            fullWidth
                            id="pets"
                            name="pets"
                            type="pets"
                            placeholder="Okay or Not okay"
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item sm={12} md={6}>
                          <InputLabel>Smoking</InputLabel>
                          <TextField
                            required
                            fullWidth
                            id="smoking"
                            name="smoking"
                            type="smoking"
                            autoComplete="Okay or Not okay"
                            placeholder="Okay or Not okay"
                            autoFocus
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item sm={12} md={6}>
                          <InputLabel>Employment Status</InputLabel>
                          <TextField
                            required
                            fullWidth
                            id="EmploymentStatus"
                            name="employmentStatus"
                            type="employmentStatus"
                            autoComplete="Working or Student"
                            placeholder="Working or Student"
                            autoFocus
                            onChange={handleChange}
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

                  {activeStep === 3 && (
                    <form>
                      <div className="flex justify-center gap-6 mt-12">
                        <Paper>
                          <Box
                            component="form"
                            sx={{
                              "& .MuiTextField-root": { mt: 1 }, 
                            }} style={{padding:"4px"}}
                          >
                            <Grid item sm={12} md={6}>
                              <InputLabel>Preferred Gender</InputLabel>
                              <TextField
                                required
                                fullWidth
                                id="gender"
                                name="gender"
                                autoComplete="male or female"
                                placeholder="Male or Female"
                                autoFocus
                                onChange={handleChange}
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
                              <Grid item sm={12} md={6}>
                                <InputLabel>Employment Status</InputLabel>
                                <TextField
                                  required
                                  fullWidth
                                  id="userEmploymentStatus"
                                  name="userEmploymentStatus"
                                  type="userEmploymentStatus"
                                  autoComplete="Working or Student"
                                  placeholder="Working or Student"
                                  autoFocus
                                  onChange={handleChange}
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
                            <Button
                              type="submit"
                              fullWidth
                              onClick={handleSubmit}
                              variant="contained"
                              sx={{ mt: 3, mb: 2 }}
                            >
                              Submit
                            </Button>
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
                  {isStepOptional(activeStep) && (
                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                      Skip
                    </Button>
                  )}

                  <Button onClick={handleNext1}>
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </Box>
        </div>
      </div>

      <div className="flex justify-start lg:justify-center">
        <div className="md:hidden">
          <Box sx={{ maxWidth: 400 }}>
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
                        <Grid container spacing={1}>
                          <Grid item sm={12} md={6}>
                            <InputLabel>bedroomType</InputLabel>
                            <TextField
                              required
                              fullWidth
                              id="bedroomType"
                              name="bedroomType"
                              autoComplete="bedroomType"
                              placeholder="Private or Shared"
                              autoFocus
                              onChange={handleChange}
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
                            <TextField
                              required
                              fullWidth
                              id="number"
                              name="bathroom"
                              type="number"
                              autoComplete="number"
                              autoFocus
                              onChange={handleChange}
                            />
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
                            <InputLabel>Address</InputLabel>
                            <TextField
                              required
                              fullWidth
                              id="name"
                              name="address"
                              autoComplete="address"
                              autoFocus
                              placeholder="Address"
                              onChange={handleChange}
                            />
                          </Grid>
                          <Grid item sm={12} md={6}>
                            <InputLabel>Enter City</InputLabel>
                            <TextField
                              required
                              fullWidth
                              name="city"
                              type="text"
                              placeholder="City"
                              onChange={handleChange}
                            />
                          </Grid>
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
                      )}

                      {index === 1 && (
                       <form>
                       <Grid container spacing={1}>
                         <Grid item sm={12} md={6}>
                           <InputLabel>Preferred Gender</InputLabel>
                           <TextField
                             required
                             fullWidth
                             id="userGender"
                             name="userGender"
                             autoComplete="userGender"
                             placeholder="Male or Female"
                             autoFocus
                             onChange={handleChange}
                           />
                         </Grid>
                         <Grid item sm={12} md={6}>
                           <InputLabel>Pets</InputLabel>
                           <TextField
                             required
                             fullWidth
                             id="pets"
                             name="pets"
                             type="pets"
                             placeholder="Okay or Not okay"
                             onChange={handleChange}
                           />
                         </Grid>
                         <Grid item sm={12} md={6}>
                           <InputLabel>Smoking</InputLabel>
                           <TextField
                             required
                             fullWidth
                             id="smoking"
                             name="smoking"
                             type="smoking"
                             autoComplete="Okay or Not okay"
                             placeholder="Okay or Not okay"
                             autoFocus
                             onChange={handleChange}
                           />
                         </Grid>
                         <Grid item sm={12} md={6}>
                           <InputLabel>Employment Status</InputLabel>
                           <TextField
                             required
                             fullWidth
                             id="EmploymentStatus"
                             name="employmentStatus"
                             type="employmentStatus"
                             autoComplete="Working or Student"
                             placeholder="Working or Student"
                             autoFocus
                             onChange={handleChange}
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
                                     (Only *.jpeg, *.webp and *.png images will be
                                     accepted)
                                   </p>
                                 </div>
                                 <input
                                   type="file"
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
                            }} style={{padding:"4px"}}
                          >
                            <Grid item sm={12} md={6}>
                              <InputLabel>Preferred Gender</InputLabel>
                              <TextField
                                required
                                fullWidth
                                id="gender"
                                name="gender"
                                autoComplete="male or female"
                                placeholder="Male or Female"
                                autoFocus
                                onChange={handleChange}
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
                              <Grid item sm={12} md={6}>
                                <InputLabel>Employment Status</InputLabel>
                                <TextField
                                  required
                                  fullWidth
                                  id="userEmploymentStatus"
                                  name="userEmploymentStatus"
                                  type="userEmploymentStatus"
                                  autoComplete="Working or Student"
                                  placeholder="Working or Student"
                                  autoFocus
                                  onChange={handleChange}
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
                              {/* Render uploaded images */}
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
                            <Button
                              type="submit"
                              fullWidth
                              onClick={handleSubmit}
                              variant="contained"
                              sx={{ mt: 3, mb: 2 }}
                            >
                              Submit
                            </Button>
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
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === steps.length - 1 ? "Finish" : "Continue"}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
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
    </>
  );
}
