import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../Provider/AuthProvider";
const SubletList = () => {
    const [flatData, setFlatData] = useState([]);
    const [activeButton, setActiveButton] = useState("sublet");
    const [searchValueOwner, setSearchValueOwner] = useState("");
    const [searchValueLocation, setSearchValueLocation] = useState("");
    const [priceSort, setPriceSort] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [flatsPerPage] = useState(16);
    const { auths } = useContext(AuthContext);
    const user = auths?.user;
    const [dropdownOpenPage, setDropDownPage] = useState(false);
    const [dropdownOpen, setDropDown] = useState(false);
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

    const handleClick = (button) => {
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
      }
      console.log(url);
      const res = await axios.get(url);
      setFlatData(res.data);
  };

    console.log("flatdata", flatData);

    //search
    const handleSearchChangeOwner = (e) => {
      setSearchValueOwner(e.target.value);
  };
  const handleSearchChangeLocation = (e) => {
      setSearchValueLocation(e.target.value);
  };

    const handlePriceSort = (sortOrder) => {
        setPriceSort(sortOrder);
    };
    const dropDownIcon = (e) => {
        e.stopPropagation();
        setDropDownPage(!dropdownOpenPage);
    };

    // Logic for pagination
    const indexOfLastFlat = currentPage * flatsPerPage;
    const indexOfFirstFlat = indexOfLastFlat - flatsPerPage;
    const currentFlats = flatData.slice(indexOfFirstFlat, indexOfLastFlat);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div className="lg:px-14 flex justify-center lg:gap-10 px-2">
                {/* this is a two button */}

                <div className="flex justify-evenly flex-wrap lg:gap-10 gap-5 py-5 lg:px-6">
                    <div className="flex border border-black rounded-lg">
                        <Link to="/dashboard/listing">
                            <button
                                className={`md:px-6 px-2 py-3 rounded-lg mr-2 text-[10px] md:text-sm lg:text-base ${
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
                                className={`md:px-6 px-2 py-3 rounded-lg mr-2 text-[10px] md:text-sm lg:text-base  ${
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
            </div>
            {/* searchField  */}
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
            {/* find Flat table */}
            <div className="overflow-x-auto">
                <table className="min-w-[100%] shadow-md border mx-auto border-gray-100 my-6 rounded-lg">
                    <thead>
                        <tr className="bg-green-500 rounded-lg text-white">
                            <th className="py-4 px-6 lg:text-lg md:text-md text-sm  text-left border-b">
                                Flat Image{" "}
                            </th>
                            <th className="py-4 px-6 lg:text-lg md:text-md text-sm text-left border-b">
                                Flat Type
                            </th>
                            <th className="py-4 px-6 lg:text-lg md:text-md text-sm  text-left border-b">
                                Flat Owner
                            </th>
                            <th className="py-4 px-6 lg:text-lg md:text-md text-sm  text-left border-b">
                                Contact Number
                            </th>
                            <th className="py-4 px-6 lg:text-lg md:text-md text-sm  text-left border-b">
                                Location
                            </th>
                            <th className="py-4 px-6 lg:text-lg md:text-md text-sm  border-b text-end">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentFlats.map((flat, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 border-b transition duration-300"
                            >
                                <td className="py-4 px-4 flex justify-start">
                                    <img
                                        src={`http://localhost:5000/image/${flat.flatList.images[0]}`}
                                        alt="Flat"
                                        className="h-16 w-16 object-cover rounded-2xl bg-gray-300"
                                    />
                                </td>
                                <td className="py-4 px-6 border-b md:text-md text-sm uppercase font-medium">
                                    {flat.flatList.description.type}
                                </td>
                                {/* Assuming flat owner and contact number are available in flat data */}
                                <td className="py-4 px-6 border-b md:text-md text-sm  font-medium">
                                    {flat.flatList.contact_person.firstName}{" "}
                                    {flat.flatList.contact_person.lastName}
                                </td>
                                <td className="py-4 px-6 border-b md:text-md text-sm font-medium">
                                    {flat.flatList.contact_person.phone}
                                </td>
                                <td className="py-4 px-6 border-b md:text-md text-sm font-medium">
                                    {flat.flatList.description.location.address}
                                    , {flat.flatList.description.location.city},{" "}
                                    {
                                        flat.flatList.description.location
                                            .postalCode
                                    }
                                </td>

                                <td className="py-4 px-6 md:text-md text-sm border-b text-end">
                                    <button className="bg-red-500 hover:scale-110 scale-100 transition-all duration-100 text-white py-2 px-4 rounded-md">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* for pagination */}

            <div className=" flex flex-wrap justify-center mb-10 mt-24 gap-5">
                <button
                    className="join-item btn btn-outline mr-2"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &larr; Previous page
                </button>
                {Array.from(
                    { length: Math.ceil(flatData.length / flatsPerPage) },
                    (_, i) => (
                        <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`join-item btn btn-outline mr-2 ${
                                currentPage === i + 1
                                    ? "bg-blue-400 text-white"
                                    : ""
                            }`}
                        >
                            {i + 1}
                        </button>
                    )
                )}
                <button
                    className="join-item btn btn-outline mr-2"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={
                        currentPage ===
                        Math.ceil(flatData.length / flatsPerPage)
                    }
                >
                    Next &rarr;
                </button>
            </div>
        </>
    );
};

export default SubletList;
