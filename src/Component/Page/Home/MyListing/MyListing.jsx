import axios from "axios";
import "leaflet/dist/leaflet.css";
import { useContext, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../../Provider/AuthProvider";
import { message } from "antd";
const MyListing = () => {
  const [roommateData, setRoommateData] = useState([]);
  const [flatData, setFlatData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openRoommateModal, setOpenRoommateModal] = useState(false);
  const [openFlatDataModal, setOpenFlatDataModal] = useState(false);
  const { auths } = useContext(AuthContext);
  const [roomData, setRoomData] = useState(null);
  const [subletData, setSubletData] = useState(null);
  const [activeButton, setActiveButton] = useState("");
  const email = auths?.user?.email;
  const user = auths?.user;
  const [dropdownOpenPage, setDropDownPage] = useState(false);
  const [dropdownOpen, setDropDown] = useState(false);
  const pageRef = useRef();
  const imgRef = useRef();
  const dropdownRefPage = useRef();
  const dropdownRef = useRef();
  const mapRef = useRef(null);
  const flatRef = useRef(null);
  const [roomImage, setRoomImage] = useState();
  const [formsData, setFormsData] = useState({
    type: "",
    date: "",
    bedroom: "",
    bathroom: "",
    size: "",
    rent: "",
    address: "",
    city: "",
    postalCode: "",
    firstName: "",
    lastName: "",
    userCity: "",
    phone: "",
    userPostalCode: "",
    image: "",
  });
  window.addEventListener("click", (e) => {
    if (e.target !== dropdownRef.current && e.target !== imgRef.current) {
      setDropDown(false);
    }
    if (e.target !== dropdownRefPage.current && e.target !== pageRef.current) {
      setDropDownPage(false);
    }
  });

  const handleClick1 = (button) => {
    setActiveButton(button);
  };
  useEffect(() => {
    fetchData();
  }, [email]);

  const fetchData = async () => {
    try {
      const roommateResponse = await axios.get(
        `http://localhost:5000/roommateList/${email}`
      );
      setRoommateData(roommateResponse.data?.roommateLists);
    } catch (error) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  console.log("roommateData", roommateData);
  useEffect(() => {
    fetchFlatData();
  }, [email]);

  const fetchFlatData = async () => {
    try {
      const flatResponse = await axios.get(
        `http://localhost:5000/flatList/${email}`
      );
      setFlatData(flatResponse.data?.flatList);
    } catch (error) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoommate = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/roommateList/${id}`
      );
      if (response.status === 200) {
        console.log("Roommate deleted successfully.");
        alert("Deleted");
        window.location.reload();
      }
    } catch (error) {
      // Handle error
      console.error("Error deleting roommate:", error);
    }
  };

  const handleDeleteFlat = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/flat/${id}`);
      if (response.status === 200) {
        console.log("Flat deleted successfully.");
        fetchFlatData();
      }
    } catch (error) {
      // Handle error
      console.error("Error deleting flat:", error);
    }
  };

  const editRoommateData = (_id, roommate) => {
    setRoomData(roommate);
    setOpenRoommateModal(true);
  };
  const [image, setImage] = useState([]);
  const [multiImages, setMultiImages] = useState([]);

  const handleMultiImageChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images" && files && files.length > 0) {
      const filesArray = Array.from(files);
      setMultiImages((prevImages) => [...prevImages, ...filesArray]);
    }
    if (name === "image" && files && files.length > 0) {
      // Handle single file differently
      const selectedFile = files[files.length - 1];
      setImage(selectedFile);
    }
  };

  const updateRoommateData = async (e) => {
    e.preventDefault();
    console.log("e.target", e.target.cityName.value);

    try {
      const formDataSend = new FormData();
      formDataSend.append("userEmail", auths?.user?.email);
      formDataSend.append("userId", auths?.user?._id);
      formDataSend.append("bedroomType", e.target.bedroomType.value);
      formDataSend.append("availableFrom", e.target.date.value);
      formDataSend.append("bathroom", e.target.bathroom.value);

      formDataSend.append("size", e.target.size.value);
      formDataSend.append("rent", e.target.rent.value);
      if (center[0] !== 0 && center[1] !== 0) {
        formDataSend.append("lat", center[0]);
        formDataSend.append("lon", center[1]);
      } else {
        formDataSend.append(
          "lat",
          roomData?.roomateList?.description?.location?.lat
        );
        formDataSend.append(
          "lon",
          roomData?.roomateList?.description?.location?.lon
        );
      }
      formDataSend.append("address", e.target.address.value);
      formDataSend.append("city", e.target.cityName.value);
      formDataSend.append("postalCode", e.target.postalCode.value);

      formDataSend.append("gender", e.target.gender.value);
      formDataSend.append("pets", e.target.pets.value);
      formDataSend.append("smoking", e.target.smoking.value);
      formDataSend.append("employmentStatus", e.target.employmentStatus.value);

      formDataSend.append("userGender", e.target.userGender.value);
      formDataSend.append("firstName", e.target.firstName.value);
      formDataSend.append("lastName", e.target.lastName.value);
      formDataSend.append("phone", e.target.phone.value);
      formDataSend.append(
        "userEmploymentStatus",
        e.target.userEmploymentStatus.value
      );
      if (image) {
        formDataSend.append("image", image);
      }
      multiImages.forEach((image, index) => {
        formDataSend.append("images", image);
      });
      const roomId = roomData._id;
      const response = await fetch(
        `http://localhost:5000/roommateList/${roomId}`,
        {
          method: "PATCH",
          body: formDataSend,
        }
      );

      const data = await response.json();

      alert("Roommate list updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const editFlatData = (_id, flat) => {
    console.log("hhhhhhhhhhhhhhhhhhhhhhh", flat);
    setSubletData(flat);
    setOpenFlatDataModal(true);
  };

  const [images, setImages] = useState([]);
  const [flatImage, setFlatImage] = useState([]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, files } = e.target;

    if (name === "images" && files && files.length > 0) {
      const filesArray = Array.from(files);
      setImages((prevImages) => [...prevImages, ...filesArray]);
    }
    if (name === "image" && files && files.length > 0) {
      const selectedFile = files[files.length - 1];
      setFlatImage(selectedFile);
    }
  };

  const updateFlatData = async (e) => {
    e.preventDefault();
    console.log("this is formData", e.target.type.value);
    try {
      const formDataToSend = new FormData();

      formDataToSend.append("userEmail", auths?.user?.email);
      formDataToSend.append("userId", auths?.user?._id);
      formDataToSend.append("type", e.target.type.value);
      formDataToSend.append("availableFrom", e.target.availableFrom.value);
      formDataToSend.append("bedroom", e.target.bedroom.value);
      formDataToSend.append("bathroom", e.target.bathroom.value);
      formDataToSend.append("size", e.target.size.value);
      formDataToSend.append("rent", e.target.rent.value);
      if (center[0] !== 0 && center[1] !== 0) {
        formDataToSend.append("lat", center[0]);
        formDataToSend.append("lon", center[1]);
      } else {
        formDataToSend.append(
          "lat",
          subletData?.flatList?.description?.location?.lat
        );
        formDataToSend.append(
          "lon",
          subletData?.flatList?.description?.location?.lon
        );
      }
      formDataToSend.append("address", e.target.address.value);
      formDataToSend.append("city", e.target.city.value);
      formDataToSend.append("postalCode", e.target.postalCode.value);
      formDataToSend.append("firstName", e.target.firstName.value);
      formDataToSend.append("lastName", e.target.lastName.value);
      formDataToSend.append("userCity", e.target.userCity.value);
      formDataToSend.append("phone", e.target.phone.value);
      formDataToSend.append("userPostalCode", e.target.userPostalCode.value);
      if (flatImage) {
        formDataToSend.append("image", flatImage);
      }
      images.forEach((image, index) => {
        formDataToSend.append("images", image);
      });

      const flatId = subletData._id;
      console.log("flatId", flatId);
      const response = await axios.patch(
        `http://localhost:5000/flatList/${flatId}`,
        formDataToSend
      );
      alert("Flat list updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  //map-----------------------------

  // Custom hook to handle map events
  const MapEvents = () => {
    const map = useMapEvents({
      click: handleClick,
    });

    return null;
  };

  const [address, setAddress] = useState("");
  const [center, setCenter] = useState([0, 0]);
  const [openModal, setOpenModal] = useState(false);
  const [cityName, setCityName] = useState("");

  const roomModalClose = () => {
    setOpenModal(false);
    setOpenRoommateModal(false);
  };

  useEffect(() => {
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
  // console.log(formsData);

  //map flat- ----------------------------

  //flatinfo

  const [flatOpenModal, setFlatOpenModal] = useState(false);
  const [flatCityName, setFlatCityName] = useState("");
  const [flatAddress, setFlatAddress] = useState("");

  // Custom hook to handle map events
  const MapEvent = () => {
    const maps = useMapEvents({
      click: handleFlatClick,
    });

    return null;
  };
  useEffect(() => {
    if (flatRef.current) {
      flatRef.current.setView(center, 13);
    }
  }, [center]);

  const handleFlatDistrictChange = async (event) => {
    const selectedFlatCityName = event.target.value;
    setFlatCityName(selectedFlatCityName);
    const { data } = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${selectedFlatCityName}`
    );
    if (data.length > 0) {
      setCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
    }
    setFlatOpenModal(true);
  };

  const handleFlatClick = (event) => {
    const { lat, lng } = event.latlng;
    console.log(event);
    axios
      .get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      )
      .then((response) => {
        console.log(response.data.display_name);
        // You can now use the address in your application
        setFlatOpenModal(false);
        setFlatAddress(response.data.display_name);
      })
      .catch((error) => {
        console.error("Error fetching address:", error);
      });
  };
  const maps = (
    <MapContainer
      center={center}
      zoom={30}
      style={{
        height: "400px",
        width: "100%",
      }}
      ref={flatRef}
    >
      <MapEvent />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );

  // console.log("center", center);

  // const addToRoommateWishlist = async (roommate) => {
  //     console.log(roommate);
  //     try {
  //       const roomMates = {
  //         userEmail: user?.email,
  //         userId: user?._id,
  //         roommateWishList: roommate,
  //         flatWishList: "",
  //       };

  //       // console.log(roomMates);
  //      const response = await axios.post(`http://localhost:5000/wishlist`, roomMates);
  //      if (response.status === 201) {
  //       // console.log("Added to wishlist:", flat);
  //       message.success("Successfully Added to Wishlist!");
  //     } else if (response.status === 409) {
  //       message.error("Wishlist already exists for this user.");
  //     }
  //   } catch (error) {
  //     if (error.response && error.response.status === 409) {
  //       message.error("Wishlist already exists for this user.");
  //     } else {
  //       console.error("Error adding to wishlist:", error);
  //       message.error("An error occurred while adding to wishlist.");
  //     }
  //   }
  // };

  // //flat
  // const addToWishlist = async (flat) => {
  //     console.log(flat);
  //     try {
  //       const flatData = {
  //         userEmail: user?.email,
  //         userId: user?._id,
  //         flatWishList: flat,
  //         roommateWishList: "",
  //       };
  //       // console.log("hello", flatData);

  //       const response = await axios.post(`http://localhost:5000/wishList`, flatData);

  //       if (response.status === 201) {
  //         // console.log("Added to wishlist:", flat);
  //         message.success("Successfully Added to Wishlist!");
  //       } else if (response.status === 409) {
  //         message.error("Wishlist already exists for this user.");
  //       }
  //     } catch (error) {
  //       if (error.response && error.response.status === 409) {
  //         message.error("Wishlist already exists for this user.");
  //       } else {
  //         console.error("Error adding to wishlist:", error);
  //         message.error("An error occurred while adding to wishlist.");
  //       }
  //     }
  //   };
  return (
    <>
      <div className="lg:px-14 flex justify-center lg:gap-10  px-2">
        {/* this is a two button */}

        <div className="flex justify-evenly flex-wrap lg:gap-10 gap-5 py-5 lg:px-6">
          <div className="flex border border-black rounded-lg">
            <Link to="/flatData">
              <button
                className={`md:px-6 px-2 py-3 rounded-lg mr-2 text-[10px] md:text-sm lg:text-base ${
                  activeButton === "flat"
                    ? "bg-blue-400 text-white font-semibold border border-black"
                    : "bg-white text-black font-semibold"
                }`}
                onClick={() => handleClick1("flat")}
              >
                Find Flat
              </button>
            </Link>
            <Link to="/subletData">
              <button
                className={`md:px-6 px-2 py-3 rounded-lg mr-2 text-[10px] md:text-sm lg:text-base  ${
                  activeButton === "sublet"
                    ? "bg-blue-400 text-white font-semibold border border-black"
                    : "bg-white text-black font-semibold"
                }`}
                onClick={() => handleClick1("sublet")}
              >
                Find Sublet
              </button>
            </Link>

            <Link to="/roomData">
              <button
                className={`md:px-6 px-2 py-3 rounded-lg text-[10px] md:text-sm lg:text-base ${
                  activeButton === "roommate"
                    ? "bg-blue-400 text-white font-semibold border border-black"
                    : "bg-white text-black font-semibold"
                }`}
                onClick={() => handleClick1("roommate")}
              >
                Find Roommate
              </button>
            </Link>
          </div>
          {/* search functionality */}
        </div>
      </div>
      <div>
        <div>
          <div className="flex-1 justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-16 lg:gap-5 lg:px-14 px-6">
              {roommateData ? (
                roommateData.map((roommate, index) => (
                  <div key={index} className=" pb-6">
                    <div className=" pb-6 mt-10">
                      <div className="max-w-[350px] font-sans rounded-2xl  my-5 mx-auto ">
                        <div className="flex justify-center w-full relative">
                          <img
                            className="rounded-xl bg-black/40 object-cover w-full h-[230px] md:h-[290px] lg:h-[309px] border border-gray-150"
                            src={`http://localhost:5000/images/${roommate.roomateList.images[0]}`}
                            alt="Flat Image"
                          />
                        </div>
                        <div className="flex-1 text-sm mt-8 gap-3 ">
                          <div className="">
                            <div className="">
                              <p className="mt-1.5 text-pretty text-xs text-gray-500">
                                Address:{" "}
                                {
                                  roommate.roomateList.description.location
                                    .address
                                }
                              </p>
                              <p className="mt-1.5 text-pretty text-xs text-gray-500">
                                City:{" "}
                                {roommate.roomateList.description.location.city}
                              </p>
                              <p className="mt-1.5 text-pretty text-xs text-gray-500">
                                Postal Code:{" "}
                                {
                                  roommate.roomateList.description.location
                                    .postalCode
                                }
                              </p>
                              <p className="mt-1.5 text-pretty text-xs text-gray-500">
                                HomeType:{" "}
                                {roommate.roomateList.description.bedroomType}
                              </p>
                              <p className="mt-1.5 text-pretty text-xs text-gray-500">
                                Bedroom:{" "}
                                {roommate.roomateList.description.bathroom}{" "}
                              </p>
                              <p className="text-gray-900 font-bold text-lg">
                                Rent: {roommate.roomateList.description.rent}
                              </p>
                            </div>
                            {/* update Form*/}
                            <div className="flex flex-wrap items-center justify-between gap-4 md:gap-10 mt-3">
                              <div className="">
                                <button
                                  onClick={() =>
                                    editRoommateData(roommate._id, roommate)
                                  }
                                  className="rounded-md bg-blue-400 px-3 font-semibold py-[6px] text-white"
                                >
                                  Edit Button
                                </button>
                                <div
                                  onClick={() => setOpenRoommateModal(false)}
                                  className={`fixed z-[100] flex items-center justify-center ${
                                    openRoommateModal
                                      ? "visible opacity-100"
                                      : "invisible opacity-0"
                                  } inset-0 bg-black/20 backdrop-blur-sm duration-100 dark:bg-transparent`}
                                >
                                  <div
                                    onClick={(e_) => e_.stopPropagation()}
                                    className={`text- absolute max-w-md rounded-lg bg-white p-6 drop-shadow-lg  ${
                                      openRoommateModal
                                        ? "scale-1 opacity-1 duration-300"
                                        : "scale-0 opacity-0 duration-150"
                                    }`}
                                  >
                                    <form
                                      onSubmit={updateRoommateData}
                                      className=" h-[500px] overflow-y-scroll"
                                    >
                                      <h1 className="text-center font-semibold text-2xl mb-5 bg-green-500 text-black py-1 rounded-md">
                                        Description{" "}
                                      </h1>
                                      <div>
                                        <label className="">BedroomType</label>
                                        <div className="mt-3 mb-3">
                                          <input
                                            type="text"
                                            placeholder="Type here"
                                            className="input input-bordered input-info w-full max-w-xs"
                                            id="bedroomType"
                                            name="bedroomType"
                                            defaultValue={
                                              roomData
                                                ? roomData.roomateList
                                                    .description.bedroomType
                                                : ""
                                            }
                                          />
                                        </div>
                                        <label>Available Date</label>
                                        <div className="mt-3 mb-3">
                                          <input
                                            placeholder="Type here"
                                            className="input input-bordered input-info w-full max-w-xs"
                                            name="date"
                                            type="date"
                                            defaultValue={
                                              roomData
                                                ? roomData?.roomateList
                                                    ?.description?.availableFrom
                                                : ""
                                            }
                                          />
                                        </div>
                                        <label>Bathroom</label>
                                        <div className="mt-3 mb-3">
                                          <input
                                            placeholder="Type here"
                                            className="input input-bordered input-info w-full max-w-xs"
                                            id="bathroom"
                                            name="bathroom"
                                            type="bathroom"
                                            defaultValue={
                                              roomData
                                                ? roomData?.roomateList
                                                    ?.description?.bathroom
                                                : ""
                                            }
                                          />
                                        </div>
                                        <label>Size (sqft)</label>
                                        <div className="mt-3 mb-3">
                                          <input
                                            placeholder="Type here"
                                            className="input input-bordered input-info w-full max-w-xs"
                                            id="size"
                                            name="size"
                                            type="number"
                                            defaultValue={
                                              roomData
                                                ? roomData?.roomateList
                                                    ?.description?.size
                                                : ""
                                            }
                                          />
                                        </div>
                                        <label>Rent</label>
                                        <div className="mt-2 mb-3">
                                          <input
                                            placeholder="Type here"
                                            className="input input-bordered input-info w-full max-w-xs"
                                            id="rent"
                                            name="rent"
                                            type="rent"
                                            defaultValue={
                                              roomData
                                                ? roomData?.roomateList
                                                    ?.description?.rent
                                                : ""
                                            }
                                          />
                                        </div>
                                        <label>Address</label>
                                        <div className="mt-2 mb-3">
                                          <input
                                            type="text"
                                            className="input input-bordered input-info w-full max-w-xs"
                                            id="address"
                                            value={
                                              address ||
                                              roomData?.roomateList?.description
                                                ?.location?.address
                                            }
                                            name="address"
                                            placeholder="Address"
                                          />
                                        </div>
                                        <label>City</label>
                                        <select
                                          name="cityName"
                                          className="w-full px-4 py-3 rounded-md border  focus:outline-none focus:ring"
                                          onChange={handleDistrictChange}
                                          value={
                                            cityName ||
                                            roomData?.roomateList?.description
                                              ?.location?.city
                                          }
                                        >
                                          {districts &&
                                            districts?.map((category) => (
                                              //   console.log(category),
                                              <option
                                                key={category._id}
                                                value={category}
                                              >
                                                {category}
                                              </option>
                                            ))}
                                        </select>
                                        <div className="mx-auto">
                                          <div
                                            onClick={roomModalClose}
                                            className={`fixed z-[100] flex items-center justify-center ${
                                              openModal
                                                ? "visible opacity-100"
                                                : "invisible opacity-0"
                                            } inset-0 bg-black/20 backdrop-blur-sm duration-100 dark:bg-transparent`}
                                          >
                                            <div
                                              onClick={(e_) =>
                                                e_.stopPropagation()
                                              }
                                              className={`text- absolute max-w-screen-xl rounded-lg bg-white p-6 drop-shadow-lg ${
                                                openModal
                                                  ? "scale-1 opacity-1 duration-300"
                                                  : "scale-0 opacity-0 duration-150"
                                              }`}
                                            >
                                              <div className="w-[700px]">
                                                {map}
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <label>Zip Code</label>
                                        <div className="mt-2 mb-3">
                                          <input
                                            className="input input-bordered input-info w-full max-w-xs"
                                            id="postalCode"
                                            name="postalCode"
                                            placeholder="Postal code"
                                            defaultValue={
                                              roomData?.roomateList?.description
                                                ?.location?.postalCode
                                            }
                                          />
                                        </div>
                                      </div>
                                      <h1 className="text-center font-semibold text-2xl mb-5 bg-green-500 text-white py-1 rounded-md mt-5">
                                        ROOMMATE PREFERENCES
                                      </h1>
                                      <div>
                                        <label>Preferred Gender</label>
                                        <div className="mt-2 mb-3">
                                          <input
                                            type="text"
                                            className="input input-bordered input-info w-full max-w-xs"
                                            id="gender"
                                            name="gender"
                                            placeholder="Male or Female"
                                            defaultValue={
                                              roomData?.roomateList
                                                ?.roomatePreferences?.gender
                                            }
                                          />
                                        </div>
                                        <label>Pets</label>
                                        <div className="mt-2 mb-3">
                                          <input
                                            type="text"
                                            className="input input-bordered input-info w-full max-w-xs"
                                            defaultValue={
                                              roomData?.roomateList
                                                ?.roomatePreferences?.pets
                                            }
                                            name="pets"
                                            placeholder="Okay or Not okay"
                                          />
                                        </div>
                                        <label>Smoking</label>
                                        <div className="mt-2 mb-3">
                                          <input
                                            type="text"
                                            className="input input-bordered input-info w-full max-w-xs"
                                            defaultValue={
                                              roomData?.roomateList
                                                ?.roomatePreferences?.smoking
                                            }
                                            id="smoking"
                                            name="smoking"
                                            placeholder="Okay or Not okay"
                                          />
                                        </div>
                                        <label>Employment Status</label>
                                        <div className="mt-2 mb-3">
                                          <input
                                            type="text"
                                            className="input input-bordered input-info w-full max-w-xs"
                                            defaultValue={
                                              roomData?.roomateList
                                                ?.roomatePreferences
                                                ?.employmentStatus
                                            }
                                            id="EmploymentStatus"
                                            name="employmentStatus"
                                            placeholder="Working or Student"
                                          />
                                        </div>
                                      </div>
                                      <h1 className="text-center font-semibold text-2xl mb-8 bg-green-500 text-white py-1 rounded-md mt-12">
                                        IMAGES
                                      </h1>
                                      <div>
                                        <div>
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
                                                  (Only *.jpeg, *.webp and *.png
                                                  images will be accepted)
                                                </p>
                                              </div>
                                              <input
                                                type="file"
                                                multiple
                                                id="images"
                                                onChange={
                                                  handleMultiImageChange
                                                }
                                                name="images"
                                                defaultValue={
                                                  roomData?.roomateList?.images
                                                }
                                                className="hidden"
                                              />
                                            </label>
                                          </div>
                                          <h1 className="text-center font-semibold text-2xl mb-5 bg-green-500 text-white py-1 rounded-md mt-12">
                                            CONTACT PERSON
                                          </h1>
                                        </div>
                                      </div>
                                      <div className="flex justify-center gap-6 mt-4">
                                        <div>
                                          <div>
                                            <label>Preferred Gender</label>
                                            <div className="mt-2 mb-3">
                                              <input
                                                type="text"
                                                className="input input-bordered input-info w-full max-w-xs"
                                                defaultValue={
                                                  roomData?.roomateList
                                                    ?.contact_person?.userGender
                                                }
                                                id="userGender"
                                                name="userGender"
                                                placeholder="Male or Female"
                                              />
                                            </div>
                                            <div>
                                              <label>First Name</label>
                                              <div className="mt-2 mb-3">
                                                <input
                                                  type="text"
                                                  className="input input-bordered input-info w-full max-w-xs"
                                                  defaultValue={
                                                    roomData?.roomateList
                                                      ?.contact_person
                                                      ?.firstName
                                                  }
                                                  name="firstName"
                                                />
                                              </div>
                                              <label>Last Name</label>
                                              <div className="mt-2 mb-3">
                                                <input
                                                  type="text"
                                                  className="input input-bordered input-info w-full max-w-xs"
                                                  defaultValue={
                                                    roomData?.roomateList
                                                      ?.contact_person?.lastName
                                                  }
                                                  name="lastName"
                                                />
                                              </div>
                                              <label>Contact Number</label>
                                              <div className="mt-2 mb-3">
                                                <input
                                                  type="number"
                                                  name="phone"
                                                  className="input input-bordered input-info w-full max-w-xs"
                                                  defaultValue={
                                                    roomData?.roomateList
                                                      ?.contact_person?.phone
                                                  }
                                                />
                                              </div>
                                              <label htmlFor="">
                                                Employment Status
                                              </label>
                                              <div className="mt-2 mb-3">
                                                <input
                                                  type="text"
                                                  className="input input-bordered input-info w-full max-w-xs"
                                                  defaultValue={
                                                    roomData?.roomateList
                                                      ?.contact_person
                                                      ?.userEmploymentStatus
                                                  }
                                                  id="userEmploymentStatus"
                                                  name="userEmploymentStatus"
                                                  placeholder="Working or Student"
                                                />
                                              </div>

                                              <div>
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
                                                  defaultValue={
                                                    roomData?.roomateList
                                                      ?.contact_person?.image
                                                  }
                                                  className=""
                                                  onChange={
                                                    handleMultiImageChange
                                                  }
                                                />
                                              </div>
                                            </div>
                                            <button
                                              className="w-full bg bg-blue-400 text-white"
                                              type="submit"
                                              fullWidth
                                              variant="contained"
                                              sx={{
                                                mt: 3,
                                                mb: 2,
                                              }}
                                            >
                                              Submit
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </form>

                                    <div className="flex justify-between mb-10">
                                      <button
                                        onClick={roomModalClose}
                                        className="rounded-md border border-rose-600 px-6 py-[6px] text-rose-600 duration-150 hover:bg-rose-600 hover:text-white"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="space-x-3">
                                <button
                                  onClick={() =>
                                    handleDeleteRoommate(roommate._id)
                                  }
                                  className="bg-red-500 hover:scale-110 scale-100 transition-all duration-100 text-white py-[6px] px-4 rounded-md"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <h3>There is no room data</h3>
              )}

              {flatData ? (
                flatData.map((flat, index) => (
                  <div key={index} className="pb-6">
                    <div className=" pb-6 mt-10">
                      <div className="max-w-[350px] font-sans rounded-2xl my-5 mx-auto">
                        <div className="flex justify-center w-full relative">
                          <img
                            className="rounded-xl bg-black/40 object-cover w-full h-[230px] md:h-[290px] lg:h-[309px] border border-gray-150"
                            src={`http://localhost:5000/images/${flat.flatList.images[0]}`}
                            alt="Flat Image"
                          />
                        </div>
                        <div className="flex-1 text-sm mt-8 gap-3">
                          <div>
                            <div className="">
                              <p className="mt-1.5 text-pretty text-xs text-gray-500">
                                Address:{" "}
                                {flat.flatList.description.location.address}
                              </p>
                              <p className="mt-1.5 text-pretty text-xs text-gray-500">
                                City: {flat.flatList.description.location.city}
                              </p>
                              <p className="mt-1.5 text-pretty text-xs text-gray-500">
                                Postal Code:{" "}
                                {flat.flatList.description.location.postalCode}
                              </p>
                              <p className="mt-1.5 text-pretty text-xs text-gray-500">
                                HomeType: {flat.flatList.description.type}
                              </p>
                              <p className="mt-1.5 text-pretty text-xs text-gray-500">
                                Bedroom: {flat.flatList.description.bedroom}{" "}
                                Bedroom
                              </p>
                              <p className="text-gray-900 font-bold text-lg">
                                Rent: {flat.flatList.description.rent}
                              </p>
                            </div>
                            {/* update Form*/}
                            <div className="flex flex-wrap items-center justify-between gap-4 md:gap-10 mt-3">
                              <div className="">
                                <button
                                  onClick={() => editFlatData(flat._id, flat)}
                                  className="rounded-md bg-blue-400 px-3 font-semibold py-[6px] text-white"
                                >
                                  Edit Button
                                </button>
                                {/* Modal */}
                                <div
                                  onClick={() => setOpenFlatDataModal(false)}
                                  className={`fixed z-[100] flex items-center justify-center ${
                                    openFlatDataModal
                                      ? "visible opacity-100"
                                      : "invisible opacity-0"
                                  } inset-0 bg-black/20 backdrop-blur-sm duration-100 dark:bg-transparent`}
                                >
                                  <div
                                    onClick={(e_) => e_.stopPropagation()}
                                    className={`text- absolute max-w-md rounded-lg bg-white p-6 drop-shadow-lg  ${
                                      openFlatDataModal
                                        ? "scale-1 opacity-1 duration-300"
                                        : "scale-0 opacity-0 duration-150"
                                    }`}
                                  >
                                    <form
                                      onSubmit={updateFlatData}
                                      className=" h-[500px] overflow-y-scroll"
                                    >
                                      <h1 className="text-center font-semibold text-2xl mb-5 bg-green-500 text-white py-1 rounded-md">
                                        Description{" "}
                                      </h1>
                                      <div>
                                        <label className="">Type</label>
                                        <div className="mt-3 mb-3">
                                          <input
                                            type="text"
                                            onChange={handleChange}
                                            placeholder="flat or sublet"
                                            className="input input-bordered input-info w-full max-w-xs"
                                            id="type"
                                            name="type"
                                            defaultValue={
                                              subletData?.flatList?.description
                                                ?.type
                                            }
                                          />
                                        </div>
                                        <label>Available Date</label>
                                        <div className="mt-3 mb-3">
                                          <input
                                            placeholder="Type here"
                                            className="input input-bordered input-info w-full max-w-xs"
                                            name="availableFrom"
                                            onChange={handleChange}
                                            type="date"
                                            defaultValue={
                                              subletData?.flatList?.description
                                                ?.availableFrom
                                            }
                                          />
                                        </div>
                                        <label>Bedroom</label>
                                        <div className="mt-3 mb-3">
                                          <input
                                            placeholder="Type here"
                                            className="input input-bordered input-info w-full max-w-xs"
                                            id="bedroom"
                                            onChange={handleChange}
                                            name="bedroom"
                                            type="bedroom"
                                            defaultValue={
                                              subletData?.flatList?.description
                                                ?.bedroom
                                            }
                                          />
                                        </div>
                                        <label>Bathroom</label>
                                        <div className="mt-3 mb-3">
                                          <input
                                            placeholder="Type here"
                                            className="input input-bordered input-info w-full max-w-xs"
                                            onChange={handleChange}
                                            id="bathroom"
                                            name="bathroom"
                                            type="bathroom"
                                            defaultValue={
                                              subletData?.flatList?.description
                                                ?.bathroom
                                            }
                                          />
                                        </div>
                                        <label>Size (sqft)</label>
                                        <div className="mt-3 mb-3">
                                          <input
                                            placeholder="Type here"
                                            className="input input-bordered input-info w-full max-w-xs"
                                            id="number"
                                            name="size"
                                            onChange={handleChange}
                                            type="number"
                                            defaultValue={
                                              subletData?.flatList?.description
                                                ?.size
                                            }
                                          />
                                        </div>
                                        <label>Rent</label>
                                        <div className="mt-2 mb-3">
                                          <input
                                            placeholder="Type here"
                                            className="input input-bordered input-info w-full max-w-xs"
                                            id="rent"
                                            name="rent"
                                            onChange={handleChange}
                                            type="rent"
                                            defaultValue={
                                              subletData?.flatList?.description
                                                ?.rent
                                            }
                                          />
                                        </div>
                                        <label>Address</label>
                                        <div className="mt-2 mb-3">
                                          <input
                                            type="text"
                                            className="input input-bordered input-info w-full max-w-xs"
                                            id="address"
                                            onChange={handleChange}
                                            name="address"
                                            placeholder="Address"
                                            value={
                                              flatAddress ||
                                              subletData?.flatList?.description
                                                ?.location?.address
                                            }
                                          />
                                        </div>
                                        <label>City</label>
                                        <select
                                          name="city"
                                          className="w-full px-4 py-3 rounded-md border  focus:outline-none focus:ring"
                                          onChange={handleFlatDistrictChange}
                                          value={
                                            flatCityName ||
                                            subletData?.flatList?.description
                                              ?.location?.city
                                          }
                                        >
                                          {districts &&
                                            districts?.map((category) => (
                                              //   console.log(category),
                                              <option
                                                key={category._id}
                                                value={category}
                                              >
                                                {category}
                                              </option>
                                            ))}
                                        </select>
                                        <div className="mx-auto">
                                          <div
                                            onClick={() =>
                                              setFlatOpenModal(false)
                                            }
                                            className={`fixed z-[100] flex items-center justify-center ${
                                              flatOpenModal
                                                ? "visible opacity-100"
                                                : "invisible opacity-0"
                                            } inset-0 bg-black/20 backdrop-blur-sm duration-100 dark:bg-transparent`}
                                          >
                                            <div
                                              onClick={(e_) =>
                                                e_.stopPropagation()
                                              }
                                              className={`text- absolute max-w-screen-xl rounded-lg bg-white p-6 drop-shadow-lg ${
                                                flatOpenModal
                                                  ? "scale-1 opacity-1 duration-300"
                                                  : "scale-0 opacity-0 duration-150"
                                              }`}
                                            >
                                              <div className="w-[700px]">
                                                {maps}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <label>Zip Code</label>
                                        <div className="mt-2 mb-3">
                                          <input
                                            className="input input-bordered input-info w-full max-w-xs"
                                            id="postalCode"
                                            name="postalCode"
                                            placeholder="Postal code"
                                            onChange={handleChange}
                                            defaultValue={
                                              subletData?.flatList?.description
                                                ?.location?.postalCode
                                            }
                                          />
                                        </div>
                                      </div>

                                      <h1 className="text-center font-semibold text-2xl mb-8 bg-green-500 text-white py-1 rounded-md mt-12">
                                        IMAGES
                                      </h1>
                                      <div>
                                        <div>
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
                                                  (Only *.jpeg, *.webp and *.png
                                                  images will be accepted)
                                                </p>
                                              </div>
                                              <input
                                                type="file"
                                                name="images"
                                                onChange={handleChange}
                                                multiple
                                                defaultValue={
                                                  subletData?.flatList?.images
                                                }
                                                className="hidden"
                                              />
                                            </label>
                                          </div>
                                          <h1 className="text-center font-semibold text-2xl mb-5 bg-green-500 text-white py-1 rounded-md mt-12">
                                            CONTACT PERSON
                                          </h1>
                                        </div>
                                      </div>
                                      <div className="flex justify-center gap-6 mt-4">
                                        <div>
                                          <div>
                                            <div>
                                              <label>First Name</label>
                                              <div className="mt-2 mb-3">
                                                <input
                                                  type="text"
                                                  onChange={handleChange}
                                                  name="firstName"
                                                  className="input input-bordered input-info w-full max-w-xs"
                                                  defaultValue={
                                                    subletData?.flatList
                                                      ?.contact_person
                                                      ?.firstName
                                                  }
                                                />
                                              </div>
                                              <label>Last Name</label>
                                              <div className="mt-2 mb-3">
                                                <input
                                                  type="text"
                                                  className="input input-bordered input-info w-full max-w-xs"
                                                  defaultValue={
                                                    subletData?.flatList
                                                      ?.contact_person?.lastName
                                                  }
                                                  name="lastName"
                                                  onChange={handleChange}
                                                />
                                              </div>
                                              <label>Contact Number</label>
                                              <div className="mt-2 mb-3">
                                                <input
                                                  type="number"
                                                  name="phone"
                                                  className="input input-bordered input-info w-full max-w-xs"
                                                  defaultValue={
                                                    subletData?.flatList
                                                      ?.contact_person?.phone
                                                  }
                                                  onChange={handleChange}
                                                />
                                              </div>
                                              <label htmlFor="">
                                                User City
                                              </label>
                                              <div className="mt-2 mb-3">
                                                <input
                                                  type="text"
                                                  className="input input-bordered input-info w-full max-w-xs"
                                                  defaultValue={
                                                    subletData?.flatList
                                                      ?.contact_person?.userCity
                                                  }
                                                  id="userCity"
                                                  name="userCity"
                                                  placeholder="Working or Student"
                                                  onChange={handleChange}
                                                />
                                              </div>
                                              <label htmlFor="">
                                                Postal Code
                                              </label>
                                              <div className="mt-2 mb-3">
                                                <input
                                                  type="text"
                                                  className="input input-bordered input-info w-full max-w-xs"
                                                  defaultValue={
                                                    subletData?.flatList
                                                      ?.contact_person
                                                      ?.userPostalCode
                                                  }
                                                  id="userPostalCode"
                                                  name="userPostalCode"
                                                  placeholder="Postal Code"
                                                  onChange={handleChange}
                                                />
                                              </div>
                                              <div>
                                                <div>
                                                  <img
                                                    className="w-20 h-20 mx-auto object-center cursor-pointer"
                                                    src="https://i.ibb.co/GJcs8tx/upload.png"
                                                    alt="upload image"
                                                  />
                                                </div>
                                                <input
                                                  onChange={handleChange}
                                                  type="file"
                                                  name="image"
                                                  defaultValue={
                                                    subletData?.flatList
                                                      ?.contact_person?.image
                                                  }
                                                  className=""
                                                />
                                              </div>
                                            </div>
                                            <button
                                              className="w-full bg bg-blue-400 text-white"
                                              type="submit"
                                              fullWidth
                                              variant="contained"
                                              sx={{
                                                mt: 3,
                                                mb: 2,
                                              }}
                                            >
                                              Submit
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </form>

                                    <div className="flex justify-between mb-10">
                                      <button
                                        onClick={() =>
                                          setOpenFlatDataModal(false)
                                        }
                                        className="rounded-md border border-rose-600 px-4 py-[6px] text-rose-600 duration-150 hover:bg-rose-600 hover:text-white"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="space-x-3">
                                <button
                                  onClick={() => handleDeleteFlat(flat._id)}
                                  className="bg-red-500 hover:scale-110 scale-100 transition-all duration-100 text-white py-[6px] px-4 rounded-md mb-5 lg:mb-0"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <h3>There is not flat data</h3>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyListing;
