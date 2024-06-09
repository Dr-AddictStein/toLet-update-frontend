import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../Provider/AuthProvider";
const RommateList = () => {
    const [activeButton, setActiveButton] = useState("roommate");
    const [roomMate, setRoomMate] = useState([]);
    const [searchValueOwner, setSearchValueOwner] = useState("");
    const [searchValueLocation, setSearchValueLocation] = useState("");
    const [priceSort, setPriceSort] = useState("");
    const [gender, setGender] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [roommatesPerPage] = useState(24);
    const { auths } = useContext(AuthContext);
    const user = auths?.user;
    const [dropdownOpenPage, setDropDownPage] = useState(false);
    const [dropDown, setDropDown] = useState(false);
    const pageRef = useRef();
    const imgRef = useRef();
    const dropdownRefPage = useRef();
    const dropdownRef = useRef();

    window.addEventListener("click", (e) => {
        if (e.target !== dropdownRef.current && e.target !== imgRef.current) {
            setDropDown(false);
        }
        if (
            e.target !== dropdownRefPage.current &&
            e.target !== pageRef.current
        ) {
            setDropDownPage(false);
        }
    });

    const handleDropDownPage = () => {
        setDropDownPage(!dropdownOpenPage);
    };
    const handleDropDown = () => {
        setDropDown(!dropDown);
    };
    const handleClick = (button) => {
        console.log("Clicked button:", button);
        setActiveButton(button);
    };

    useEffect(() => {
        fetchData();
    }, [activeButton, searchValueOwner, searchValueLocation]);

    const fetchData = async () => {
        let url = "";
        if (activeButton === "flat") {
            url = `http://localhost:5000/flatList?search=${searchValueOwner}&location=${searchValueLocation}&type=flat`;
        } else if (activeButton === "sublet") {
            url = `http://localhost:5000/flatList?search=${searchValueOwner}&location=${searchValueLocation}&type=sublet`;
        } else if (activeButton === "roommate") {
            url = `http://localhost:5000/roommateList?search=${searchValueOwner}&location=${searchValueLocation}`;
        }
        const res = await axios.get(url);
        console.log(url);
        console.log(res.data);
        setRoomMate(res.data);
    };

    console.log("roomMate", roomMate);

    const handleSearchChangeOwner = (e) => {
        setSearchValueOwner(e.target.value.split(" ")[0]);
    };
    const handleSearchChangeLocation = (e) => {
        setSearchValueLocation(e.target.value);
    };

    const indexOfLastRoommate = currentPage * roommatesPerPage;
    const indexOfFirstRoommate = indexOfLastRoommate - roommatesPerPage;
    const currentRoommates = roomMate.slice(
        indexOfFirstRoommate,
        indexOfLastRoommate
    );
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDeleteRoommate = async (id) => {
        try {
            const response = await axios.delete(
                `http://localhost:5000/roommateList/${id}`
            );
            if (response.status === 200) {
                console.log("Roommate deleted successfully.");
                fetchData();
            }
        } catch (error) {
            // Handle error
            console.error("Error deleting roommate:", error);
        }
    };

    return (
        <>
            <div className="px-2 lg:px-12 flex flex-wrap justify-center lg:gap-10 gap-5 py-5">
                <div className="flex border border-black rounded-lg">
                    <Link to="/dashboard/listing">
                        <button
                            className={`md:px-6 px-2 py-3 rounded-lg mr-2 text-[10px] md:text-sm lg:text-base  ${
                                activeButton === "flat"
                                    ? "bg-blue-400 text-white font-semibold border border-black"
                                    : "bg-white text-black font-semibold"
                            }`}
                            onClick={() => handleClick("flat")}
                        >
                            Find Flat
                        </button>
                    </Link>
                    <Link to="/dashboard/subletList">
                        <button
                            className={`md:px-6 px-2 py-3 rounded-lg mr-2 text-[10px] md:text-sm lg:text-base ${
                                activeButton === "sublet"
                                    ? "bg-blue-400 text-white font-semibold border border-black"
                                    : "bg-white text-black font-semibold"
                            }`}
                            onClick={() => handleClick("sublet")}
                        >
                            Find Sublet
                        </button>
                    </Link>

                    <Link to="/dashboard/rommateList">
                        <button
                            className={`md:px-6 px-2 py-3 rounded-lg text-[10px] md:text-sm lg:text-base ${
                                activeButton === "roommate"
                                    ? "bg-blue-400 text-white font-semibold border border-black"
                                    : "bg-white text-black font-semibold"
                            }`}
                            onClick={() => handleClick("roommate")}
                        >
                            Find Roommate
                        </button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
                <div className="relative" onChange={handleSearchChangeOwner}>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <button
                            type="submit"
                            title="Search"
                            className="p-1 focus:outline-none focus:ring"
                        >
                            <svg
                                fill="currentColor"
                                viewBox="0 0 512 512"
                                className="w-4 h-4 dark:text-gray-800"
                            >
                                <path d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
                            </svg>
                        </button>
                    </span>
                    <input
                        type="search"
                        name="Search"
                        placeholder="Search by owner name"
                        className="md:w-64 px-6 py-2.5 pl-10 border border-gray-400 text-sm rounded-md "
                    />
                </div>
                <div className="">
                    <input
                        type="search"
                        onChange={handleSearchChangeLocation}
                        className="border rounded-lg md:w-56 lg:px-6 px-6 py-2 border-gray-400"
                        placeholder="   Search Location"
                    />
                </div>
            </div>
            {/* 
    //rommateList table */}
            <div className="overflow-x-auto">
                <table className="min-w-[100%] shadow-md border mx-auto border-gray-100 my-6 rounded-lg">
                    <thead>
                        <tr className="bg-green-500 rounded-lg text-white">
                            <th className="py-4 px-6 text-sm text-left border-b">
                                Room Image{" "}
                            </th>
                            <th className="py-4 px-6 text-sm text-left border-b">
                                Room Type
                            </th>
                            <th className="py-4 px-6 text-sm text-left border-b">
                                Room Owner
                            </th>
                            <th className="py-4 px-6 text-sm text-left border-b">
                                Owner Image{" "}
                            </th>
                            <th className="py-4 px-6 text-sm text-left border-b">
                                Contact Number
                            </th>
                            <th className="py-4 px-6 text-sm text-left border-b">
                                Location
                            </th>
                            <th className="py-4 px-6 text-sm border-b text-end">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRoommates.map((roommate, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 border-b transition duration-300"
                            >
                                <td className="py-4 px-4 flex justify-start">
                                    <img
                                        src={`http://localhost:5000/image/${roommate.roomateList.images[0]}`}
                                        alt="Flat"
                                        className="h-16 w-16 mt-2 object-cover rounded-2xl bg-gray-300"
                                    />
                                </td>
                                <td className="py-4 px-6 border-b text-sm uppercase font-medium">
                                    {
                                        roommate.roomateList.description
                                            .bedroomType
                                    }
                                </td>
                                {/* Assuming flat owner and contact number are available in flat data */}
                                <td className="py-4 px-6 border-b text-sm font-medium">
                                    {
                                        roommate.roomateList.contact_person
                                            .firstName
                                    }{" "}
                                    {
                                        roommate.roomateList.contact_person
                                            .lastName
                                    }
                                </td>
                                <td className="py-4 px-4 flex justify-start">
                                    <img
                                        src={`http://localhost:5000/image/${roommate?.roomateList?.contact_person?.image}`}
                                        alt="Flat"
                                        className="h-12 w-12 object-cover rounded-2xl bg-gray-300"
                                    />
                                </td>
                                <td className="py-4 px-6 border-b text-sm font-medium">
                                    {roommate.roomateList.contact_person.phone}
                                </td>
                                <td className="py-4 px-6 border-b text-sm font-medium">
                                    {" "}
                                    {
                                        roommate.roomateList.description
                                            .location.address
                                    }
                                    ,
                                    {
                                        roommate.roomateList.description
                                            .location.city
                                    }
                                    ,
                                </td>

                                <td className="py-4 px-6 border-b text-end">
                                    <button
                                        onClick={() =>
                                            handleDeleteRoommate(roommate._id)
                                        }
                                        className="bg-red-500 hover:scale-110 scale-100 transition-all duration-100 text-white py-2 px-4 rounded-md"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* for pagination */}

            <div className="  flex flex-wrap justify-center mb-10 mt-24 gap-2 md:gap-5">
                <button
                    className="join-item px-2 py-1 md:text-base text-sm rounded-md btn btn-outline mr-1 md:mr-2"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &larr; Previous
                </button>
                {Array.from(
                    { length: Math.ceil(roomMate.length / roommatesPerPage) },
                    (_, i) => (
                        <button
                            key={i}
                            className={`join-item px-3 md:px-4 md:text-base btn rounded-md btn-outline mr-1 md:mr-2 ${
                                currentPage === i + 1
                                    ? "bg-blue-400 text-white"
                                    : ""
                            }`}
                            onClick={() => paginate(i + 1)}
                        >
                            {i + 1}
                        </button>
                    )
                )}
                <button
                    className="join-item px-2 py-1 md:text-base rounded-md text-sm btn btn-outline mr-1 md:mr-2"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={
                        currentPage ===
                        Math.ceil(roomMate.length / roommatesPerPage)
                    }
                >
                    Next &rarr;
                </button>
            </div>
        </>
    );
};

export default RommateList;
