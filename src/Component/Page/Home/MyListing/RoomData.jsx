import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../../Provider/AuthProvider";
import { Link } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
const RoomData = () => {
    const [openRoommateModal, setOpenRoommateModal] = useState(false);
    const [roommateData, setRoommateData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [roomData, setRoomData] = useState(null);
    const { auths } = useContext(AuthContext);
    const [activeButton, setActiveButton] = useState("roommate");
    const email = auths?.user?.email;
    const mapRef = useRef(null);

    const handleClick1 = (button) => {
        console.log("Clicked button:", button);
        setActiveButton(button);
      };
    useEffect(() => {
        fetchData();
    }, [email]); 
    
    const fetchData = async () => {
        try {
            let url = ""; 
    
          
            if (activeButton === "flat") {
                url = `http://localhost:5000/flatList/${email}?type=flat`; 
            } else if (activeButton === "sublet") {
                url = `http://localhost:5000/flatList/${email}?type=sublet`; 
            } else if (activeButton === "roommate") {
                url = `http://localhost:5000/roommateList/${email}`; 
            }
    
            // Make the request with the constructed URL
            const roommateResponse = await axios.get(url);
    
            // Update the state with the response data
            setRoommateData(roommateResponse.data?.roommateLists);
        } catch (error) {
            // Handle errors
            setError("An error occurred while fetching data.");
        } finally {
            // Update loading state
            setLoading(false);
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
            formDataSend.append(
                "employmentStatus",
                e.target.employmentStatus.value
            );

            formDataSend.append("userGender", e.target.userGender.value);
            formDataSend.append("firstName", e.target.firstName.value);
            formDataSend.append("lastName", e.target.lastName.value);
            formDataSend.append("phone", e.target.phone.value);
            formDataSend.append(
                "userEmploymentStatus",
                e.target.userEmploymentStatus.value
            );
            if(image){
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



    const handleDeleteRoommate = async (id) => {
        try {
            const response = await axios.delete(
                `http://localhost:5000/roommateList/${id}`
            );
            if (response.status === 200) {
                console.log("Roommate deleted successfully.");
                alert("Roommate deleted successfully.");
                window.location.reload();
            }
        } catch (error) {
            // Handle error
            console.error("Error deleting roommate:", error);
        }
    };
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
                // console.log(response.data.display_name);
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
     

    </div>
    
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:px-14 px-6">
                        {roommateData ? (
                            roommateData.map((roommate, index) => (
                                <div key={index} className=" pb-6">
                                    <div className=" pb-6">
                                        <div className="max-w-[350px] font-sans rounded-2xl space-y-6 my-5 mx-auto bg-white">
                                            <div className="flex justify-center w-full relative">
                                                <div className="flex justify-end items-center left-4 right-4 top-4 absolute">
                                                    
                                                </div>
                                                <img
                                                    className="rounded-xl bg-black/40 object-cover w-full h-[230px] md:h-[290px] lg:h-[309px] border border-gray-150"
                                                    src={`http://localhost:5000/images/${roommate.roomateList.images[0]}`}
                                                    alt="Flat Image"
                                                />
                                            </div>
                                            <div className="flex-1 text-sm mt-8 gap-3 space-y-2">
                                                <div>
                                                    <div className="space-y-4">
                                                        <p className="mt-1.5 text-pretty text-xs text-gray-500 space-y-5">
                                                            Address:{" "}
                                                            {
                                                                roommate
                                                                    .roomateList
                                                                    .description
                                                                    .location
                                                                    .address
                                                            }
                                                        </p>
                                                        <p className="mt-1.5 text-pretty text-xs text-gray-500">
                                                            City:{" "}
                                                            {
                                                                roommate
                                                                    .roomateList
                                                                    .description
                                                                    .location
                                                                    .city
                                                            }
                                                        </p>
                                                        <p className="mt-1.5 text-pretty text-xs text-gray-500">
                                                            Postal Code:{" "}
                                                            {
                                                                roommate
                                                                    .roomateList
                                                                    .description
                                                                    .location
                                                                    .postalCode
                                                            }
                                                        </p>
                                                        <p className="mt-1.5 text-pretty text-xs text-gray-500">
                                                            HomeType:{" "}
                                                            {
                                                                roommate
                                                                    .roomateList
                                                                    .description
                                                                    .bedroomType
                                                            }
                                                        </p>
                                                        <p className="mt-1.5 text-pretty text-xs text-gray-500">
                                                            Bedroom:{" "}
                                                            {
                                                                roommate
                                                                    .roomateList
                                                                    .description
                                                                    .bathroom
                                                            }{" "}
                                                        </p>
                                                        <p className="text-gray-900 font-bold text-lg">
                                                            Rent:{" "}
                                                            {
                                                                roommate
                                                                    .roomateList
                                                                    .description
                                                                    .rent
                                                            }
                                                        </p>
                                                    </div>
                                                     {/* update Form*/}
                                                     <div className="flex flex-wrap items-center justify-between gap-4 md:gap-10 mt-3">
                                                            <div className="">
                                                                <button
                                                                    onClick={() =>
                                                                        editRoommateData(
                                                                            roommate._id,
                                                                            roommate
                                                                        )
                                                                    }
                                                                    className="rounded-md bg-blue-400 px-3 font-semibold py-[6px] text-white"
                                                                >
                                                                    Edit Button
                                                                </button>
                                                                <div
                                                                    onClick={() =>
                                                                        setOpenRoommateModal(
                                                                            false
                                                                        )
                                                                    }
                                                                    className={`fixed z-[100] flex items-center justify-center ${
                                                                        openRoommateModal
                                                                            ? "visible opacity-100"
                                                                            : "invisible opacity-0"
                                                                    } inset-0 bg-black/20 backdrop-blur-sm duration-100 dark:bg-transparent`}
                                                                >
                                                                    <div
                                                                        onClick={(
                                                                            e_
                                                                        ) =>
                                                                            e_.stopPropagation()
                                                                        }
                                                                        className={`text- absolute max-w-md rounded-lg bg-white p-6 drop-shadow-lg  ${
                                                                            openRoommateModal
                                                                                ? "scale-1 opacity-1 duration-300"
                                                                                : "scale-0 opacity-0 duration-150"
                                                                        }`}
                                                                    >
                                                                        <form
                                                                            onSubmit={
                                                                                updateRoommateData
                                                                            }
                                                                            className=" h-[500px] overflow-y-scroll"
                                                                        >
                                                                            <h1 className="text-center font-semibold text-2xl mb-5 bg-green-500 text-black py-1 rounded-md">
                                                                                Description{" "}
                                                                            </h1>
                                                                            <div>
                                                                                <label className="">
                                                                                    BedroomType
                                                                                </label>
                                                                                <div className="mt-3 mb-3">
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder="Type here"
                                                                                        className="input input-bordered input-info w-full max-w-xs"
                                                                                        id="bedroomType"
                                                                                        name="bedroomType"
                                                                                        defaultValue={
                                                                                            roomData
                                                                                                ? roomData
                                                                                                      .roomateList
                                                                                                      .description
                                                                                                      .bedroomType
                                                                                                : ""
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                                <label>
                                                                                    Available
                                                                                    Date
                                                                                </label>
                                                                                <div className="mt-3 mb-3">
                                                                                    <input
                                                                                        placeholder="Type here"
                                                                                        className="input input-bordered input-info w-full max-w-xs"
                                                                                        name="date"
                                                                                        type="date"
                                                                                        defaultValue={
                                                                                            roomData
                                                                                                ? roomData
                                                                                                      ?.roomateList
                                                                                                      ?.description
                                                                                                      ?.availableFrom
                                                                                                : ""
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                                <label>
                                                                                    Bathroom
                                                                                </label>
                                                                                <div className="mt-3 mb-3">
                                                                                    <input
                                                                                        placeholder="Type here"
                                                                                        className="input input-bordered input-info w-full max-w-xs"
                                                                                        id="bathroom"
                                                                                        name="bathroom"
                                                                                        type="bathroom"
                                                                                        defaultValue={
                                                                                            roomData
                                                                                                ? roomData
                                                                                                      ?.roomateList
                                                                                                      ?.description
                                                                                                      ?.bathroom
                                                                                                : ""
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                                <label>
                                                                                    Size
                                                                                    (sqft)
                                                                                </label>
                                                                                <div className="mt-3 mb-3">
                                                                                    <input
                                                                                        placeholder="Type here"
                                                                                        className="input input-bordered input-info w-full max-w-xs"
                                                                                        id="size"
                                                                                        name="size"
                                                                                        type="number"
                                                                                        defaultValue={
                                                                                            roomData
                                                                                                ? roomData
                                                                                                      ?.roomateList
                                                                                                      ?.description
                                                                                                      ?.size
                                                                                                : ""
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                                <label>
                                                                                    Rent
                                                                                </label>
                                                                                <div className="mt-2 mb-3">
                                                                                    <input
                                                                                        placeholder="Type here"
                                                                                        className="input input-bordered input-info w-full max-w-xs"
                                                                                        id="rent"
                                                                                        name="rent"
                                                                                        type="rent"
                                                                                        defaultValue={
                                                                                            roomData
                                                                                                ? roomData
                                                                                                      ?.roomateList
                                                                                                      ?.description
                                                                                                      ?.rent
                                                                                                : ""
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                                <label>
                                                                                    Address
                                                                                </label>
                                                                                <div className="mt-2 mb-3">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="input input-bordered input-info w-full max-w-xs"
                                                                                        id="address"
                                                                                        value={
                                                                                            address ||
                                                                                            roomData
                                                                                                ?.roomateList
                                                                                                ?.description
                                                                                                ?.location
                                                                                                ?.address
                                                                                        }
                                                                                        name="address"
                                                                                        placeholder="Address"
                                                                                    />
                                                                                </div>
                                                                                <label>
                                                                                    City
                                                                                </label>
                                                                                <select
                                                                                    name="cityName"
                                                                                    className="w-full px-4 py-3 rounded-md border  focus:outline-none focus:ring"
                                                                                    onChange={
                                                                                        handleDistrictChange
                                                                                    }
                                                                                    value={
                                                                                        cityName ||
                                                                                        roomData
                                                                                            ?.roomateList
                                                                                            ?.description
                                                                                            ?.location
                                                                                            ?.city
                                                                                    }
                                                                                >
                                                                                    {districts &&
                                                                                        districts?.map(
                                                                                            (
                                                                                                category
                                                                                            ) => (
                                                                                                //   console.log(category),
                                                                                                <option
                                                                                                    key={
                                                                                                        category._id
                                                                                                    }
                                                                                                    value={
                                                                                                        category
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        category
                                                                                                    }
                                                                                                </option>
                                                                                            )
                                                                                        )}
                                                                                </select>
                                                                                <div className="mx-auto">
                                                                                    <div
                                                                                        onClick={
                                                                                            roomModalClose
                                                                                        }
                                                                                        className={`fixed z-[100] flex items-center justify-center ${
                                                                                            openModal
                                                                                                ? "visible opacity-100"
                                                                                                : "invisible opacity-0"
                                                                                        } inset-0 bg-black/20 backdrop-blur-sm duration-100 dark:bg-transparent`}
                                                                                    >
                                                                                        <div
                                                                                            onClick={(
                                                                                                e_
                                                                                            ) =>
                                                                                                e_.stopPropagation()
                                                                                            }
                                                                                            className={`text- absolute max-w-screen-xl rounded-lg bg-white p-6 drop-shadow-lg ${
                                                                                                openModal
                                                                                                    ? "scale-1 opacity-1 duration-300"
                                                                                                    : "scale-0 opacity-0 duration-150"
                                                                                            }`}
                                                                                        >
                                                                                            <div className="w-[700px]">
                                                                                                {
                                                                                                    map
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                <label>
                                                                                    Zip
                                                                                    Code
                                                                                </label>
                                                                                <div className="mt-2 mb-3">
                                                                                    <input
                                                                                        className="input input-bordered input-info w-full max-w-xs"
                                                                                        id="postalCode"
                                                                                        name="postalCode"
                                                                                        placeholder="Postal code"
                                                                                        defaultValue={
                                                                                            roomData
                                                                                                ?.roomateList
                                                                                                ?.description
                                                                                                ?.location
                                                                                                ?.postalCode
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <h1 className="text-center font-semibold text-2xl mb-5 bg-green-500 text-white py-1 rounded-md mt-5">
                                                                                ROOMMATE
                                                                                PREFERENCES
                                                                            </h1>
                                                                            <div>
                                                                                <label>
                                                                                    Preferred
                                                                                    Gender
                                                                                </label>
                                                                                <div className="mt-2 mb-3">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="input input-bordered input-info w-full max-w-xs"
                                                                                        id="gender"
                                                                                        name="gender"
                                                                                        placeholder="Male or Female"
                                                                                        defaultValue={
                                                                                            roomData
                                                                                                ?.roomateList
                                                                                                ?.roomatePreferences
                                                                                                ?.gender
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                                <label>
                                                                                    Pets
                                                                                </label>
                                                                                <div className="mt-2 mb-3">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="input input-bordered input-info w-full max-w-xs"
                                                                                        defaultValue={
                                                                                            roomData
                                                                                                ?.roomateList
                                                                                                ?.roomatePreferences
                                                                                                ?.pets
                                                                                        }
                                                                                        name="pets"
                                                                                        placeholder="Okay or Not okay"
                                                                                    />
                                                                                </div>
                                                                                <label>
                                                                                    Smoking
                                                                                </label>
                                                                                <div className="mt-2 mb-3">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="input input-bordered input-info w-full max-w-xs"
                                                                                        defaultValue={
                                                                                            roomData
                                                                                                ?.roomateList
                                                                                                ?.roomatePreferences
                                                                                                ?.smoking
                                                                                        }
                                                                                        id="smoking"
                                                                                        name="smoking"
                                                                                        placeholder="Okay or Not okay"
                                                                                    />
                                                                                </div>
                                                                                <label>
                                                                                    Employment
                                                                                    Status
                                                                                </label>
                                                                                <div className="mt-2 mb-3">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="input input-bordered input-info w-full max-w-xs"
                                                                                        defaultValue={
                                                                                            roomData
                                                                                                ?.roomateList
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
                                                                                                <p>
                                                                                                    Drag
                                                                                                    your
                                                                                                    images
                                                                                                    here{" "}
                                                                                                </p>
                                                                                                <p className="text-gray-600 text-xs">
                                                                                                    (Only
                                                                                                    *.jpeg,
                                                                                                    *.webp
                                                                                                    and
                                                                                                    *.png
                                                                                                    images
                                                                                                    will
                                                                                                    be
                                                                                                    accepted)
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
                                                                                                    roomData
                                                                                                        ?.roomateList
                                                                                                        ?.images
                                                                                                }
                                                                                                className="hidden"
                                                                                            />
                                                                                        </label>
                                                                                    </div>
                                                                                    <h1 className="text-center font-semibold text-2xl mb-5 bg-green-500 text-white py-1 rounded-md mt-12">
                                                                                        CONTACT
                                                                                        PERSON
                                                                                    </h1>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-center gap-6 mt-4">
                                                                                <div>
                                                                                    <div>
                                                                                        <label>
                                                                                            Preferred
                                                                                            Gender
                                                                                        </label>
                                                                                        <div className="mt-2 mb-3">
                                                                                            <input
                                                                                                type="text"
                                                                                                className="input input-bordered input-info w-full max-w-xs"
                                                                                                defaultValue={
                                                                                                    roomData
                                                                                                        ?.roomateList
                                                                                                        ?.contact_person
                                                                                                        ?.userGender
                                                                                                }
                                                                                                id="userGender"
                                                                                                name="userGender"
                                                                                                placeholder="Male or Female"
                                                                                            />
                                                                                        </div>
                                                                                        <div>
                                                                                            <label>
                                                                                                First
                                                                                                Name
                                                                                            </label>
                                                                                            <div className="mt-2 mb-3">
                                                                                                <input
                                                                                                    type="text"
                                                                                                    className="input input-bordered input-info w-full max-w-xs"
                                                                                                    defaultValue={
                                                                                                        roomData
                                                                                                            ?.roomateList
                                                                                                            ?.contact_person
                                                                                                            ?.firstName
                                                                                                    }
                                                                                                    name="firstName"
                                                                                                />
                                                                                            </div>
                                                                                            <label>
                                                                                                Last
                                                                                                Name
                                                                                            </label>
                                                                                            <div className="mt-2 mb-3">
                                                                                                <input
                                                                                                    type="text"
                                                                                                    className="input input-bordered input-info w-full max-w-xs"
                                                                                                    defaultValue={
                                                                                                        roomData
                                                                                                            ?.roomateList
                                                                                                            ?.contact_person
                                                                                                            ?.lastName
                                                                                                    }
                                                                                                    name="lastName"
                                                                                                />
                                                                                            </div>
                                                                                            <label>
                                                                                                Contact
                                                                                                Number
                                                                                            </label>
                                                                                            <div className="mt-2 mb-3">
                                                                                                <input
                                                                                                    type="number"
                                                                                                    name="phone"
                                                                                                    className="input input-bordered input-info w-full max-w-xs"
                                                                                                    defaultValue={
                                                                                                        roomData
                                                                                                            ?.roomateList
                                                                                                            ?.contact_person
                                                                                                            ?.phone
                                                                                                    }
                                                                                                />
                                                                                            </div>
                                                                                            <label htmlFor="">
                                                                                                Employment
                                                                                                Status
                                                                                            </label>
                                                                                            <div className="mt-2 mb-3">
                                                                                                <input
                                                                                                    type="text"
                                                                                                    className="input input-bordered input-info w-full max-w-xs"
                                                                                                    defaultValue={
                                                                                                        roomData
                                                                                                            ?.roomateList
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
                                                                                                        roomData
                                                                                                            ?.roomateList
                                                                                                            ?.contact_person
                                                                                                            ?.image
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
                                                                                onClick={
                                                                                    roomModalClose
                                                                                }
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
                                                                        handleDeleteRoommate(
                                                                            roommate._id
                                                                        )
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
                    </div>
    </>
  )
}

export default RoomData