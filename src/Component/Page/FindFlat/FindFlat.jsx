import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../Provider/AuthProvider";
import { IoIosArrowDown } from "react-icons/io";
import { message } from "antd";

const FindFlat = () => {
  const [flatData, setFlatData] = useState([]);
  const [activeButton, setActiveButton] = useState("flat");
  const [searchValue, setSearchValue] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [flatsPerPage] = useState(24);
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
  if (e.target !== dropdownRefPage.current && e.target !== pageRef.current) {
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
  const fetchData = async () => {
    let url = "";
    if (activeButton === "flat") {
      url = `http://localhost:5000/flatList?search=${searchValue}&sort=${priceSort}&type=flat`;
    } else if (activeButton === "sublet") {
      url = `http://localhost:5000/flatList?search=${searchValue}&sort=${priceSort}&type=sublet`;
    }
    const res = await axios.get(url);
    setFlatData(res.data);
  };

  fetchData();
}, [activeButton, searchValue, priceSort]);

console.log("flatdataUUUU", flatData);

  //search
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handlePriceSort = (sortOrder) => {
    setPriceSort(sortOrder);
  };

  // // add To flat Wishlist-----------------------
  // const addToWishlist = async (flat) => {
  //   console.log(flat);
  //   try {
  //     const flatData = {
  //       userEmail: user?.email,
  //       userId: user?._id,
  //       flatWishList: flat,
  //       roommateWishList: "",
  //     };
  //     console.log("hello", flatData);
      
  //     await axios.post(`http://localhost:5000/wishList`, flatData);
  //     console.log("Added to wishlist:", flat);
  //     message.success("Successfully Added WishList!");
  //   } catch (error) {
  //     console.error("Error adding to wishlist:", error);
  //   }
  // };
  const addToWishlist = async (flat) => {
    console.log(flat);
    try {
      const flatData = {
        userEmail: user?.email,
        userId: user?._id,
        flatWishList: flat,
        roommateWishList: "",
      };
      // console.log("hello", flatData);
  
      const response = await axios.post(`http://localhost:5000/wishList`, flatData);
      
      if (response.status === 201) {
        // console.log("Added to wishlist:", flat);
        message.success("Successfully Added to Wishlist!");
      } else if (response.status === 409) {
        message.error("Wishlist already exists for this user.");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        message.error("Wishlist already exists for this user.");
      } else {
        console.error("Error adding to wishlist:", error);
        message.error("An error occurred while adding to wishlist.");
      }
    }
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
  const truncateText = (text, length, flatId) => {
    if (text.length > length) {
      return (
        <>
          {text.substring(0, length)}...
          <Link to={`/flatDetails/${flatId}`} className="link link-primary">
            Read more
          </Link>
        </>
      );
    }
    return text;
  };
  return (
    <>
      <div className="lg:px-14 flex justify-center lg:gap-10  px-4">
        {/* this is a two button */}

        <div className="flex flex-wrap sm:flex-nowrap md:gap-2 lg:gap-10 gap-5 py-5">
        <div className="w-full sm:w-[270px] md:w-[450px] lg:w-[500px] flex border border-black rounded-lg mx-5 sm:mx-0">
            <div className="flex w-full items-center justify-around">
              <Link to="/findFlat" className="flex-1">
                <button
                  className={`w-full md:px-6 px-2 py-3 sm:py-4 lg:py-3  rounded-lg text-[10px] md:text-sm lg:text-base ${
                    activeButton === "flat"
                      ? "bg-blue-400 text-white font-semibold border border-black"
                      : "bg-white text-black font-semibold"
                  }`}
                  onClick={() => handleClick("flat")}
                >
                  Find Flat
                </button>
              </Link>
              <Link to="/findSublet" className="flex-1">
                <button
                  className={`w-full md:px-6 px-2 py-3 sm:py-4 lg:py-3 rounded-lg text-[10px] md:text-sm lg:text-base ${
                    activeButton === "sublet"
                      ? "bg-blue-400 text-white font-semibold border border-black"
                      : "bg-white text-black font-semibold"
                  }`}
                  onClick={() => handleClick("sublet")}
                >
                  Find Sublet
                </button>
              </Link>
              <Link to="/findRoommate" className="flex-1">
                <button
                  className={`w-full md:px-6 px-2 py-3 sm:py-4 lg:py-3 rounded-lg text-[10px] md:text-sm lg:text-base ${
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
          {/* search functionality */}
          <div className="flex flex-row gap-1 lg:gap-2 mx-5 sm:mx-0 relative">
            <div className="w-full md:w-auto flex-1 ">
              <input
                value={searchValue}
                onChange={handleSearchChange}
                className="border border-black rounded-lg sm:px-6 px-1 py-2 sm:py-3"
                placeholder="Search Locations"
              />
            </div>
            <div className="">
              <div className="dropdown dropdown-bottom dropdown-end w-28">
                <div
                  tabIndex={0}
                  role="button"
                  className="py-2 sm:py-3 w-full  rounded-lg bg-blue-400 text-white"
                >
                  <span className="flex items-center justify-center gap-1">
                    Sort <IoIosArrowDown />
                  </span>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <a onClick={() => handlePriceSort("High To Low")}>
                      Price (high to low)
                    </a>
                  </li>
                  <li>
                    <a onClick={() => handlePriceSort("Low To High")}>
                      Price (low to high)
                    </a>
                  </li>
                  <li>
                    <a onClick={() => handlePriceSort("Relevance")}>
                      Relevance
                    </a>
                  </li>
                  <li>
                    <a onClick={() => handlePriceSort("Newest Arrivals")}>
                      Newest Arrivals
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* find Flat cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:px-14 px-6">
        {currentFlats.map((flat, index) => (
          <Link key={index} to={`/flatDetails/${flat._id}`} className="">
            <div className="max-w-[350px] font-sans rounded-2xl space-y-6 my-5 mx-auto bg-white">
              <div className="flex justify-center w-full relative">
                <div className="flex justify-end items-center left-4 right-4 top-4 absolute">
                  <button
                    className="flex items-center"
                    onClick={() => addToWishlist(flat)}
                  >
                    <svg
                      width={30}
                      className="hover:fill-red-500 hover:stroke-red-500 stroke-2 fill-transparent stroke-white"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ cursor: "pointer" }}
                    >
                      <g strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"></path>
                      </g>
                    </svg>
                  </button>
                </div>
                <img
                  className="rounded-xl bg-black/40 w-full h-[230px] object-cover md:h-[290px] lg:h-[309px] border border-gray-150"
                  src={`http://localhost:5000/images/${flat.flatList.images[0]}`}
                  alt="Flat Image"
                />
              </div>
              <div className="flex-1 text-sm mt-8 gap-3 space-y-2">
                <div>
                  <h3 className="text-gray-900">
                  Location:{" "}
                    {truncateText(
                      flat.flatList.description.location.address,
                      50,
                      flat._id
                    )}
                  </h3>
                  <p className="mt-1.5 text-pretty text-xs text-gray-500">
                    HomeType:<span className="uppercase"> {flat.flatList.description.type},</span>
                  </p>
                  <p className="mt-1.5 text-pretty text-xs text-gray-500">
                    Bedroom: {flat.flatList.description.bedroom} bedroom Flat
                  </p>
                </div>
                <p className="text-gray-900 font-bold text-lg">
                  $ {flat.flatList.description.rent}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* for pagination */}

      <div className=" flex flex-wrap justify-center mb-10 mt-24 gap-5">
        <button
         className="join-item px-2 py-1 md:text-base text-sm rounded-md btn btn-outline mr-2"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &larr; Previous
        </button>
        {Array.from(
          { length: Math.ceil(flatData.length / flatsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`join-item px-3 md:px-4 md:text-base btn rounded-md btn-outline mr-2 ${
                currentPage === i + 1 ? "bg-blue-400 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          )
        )}
        <button
           className="join-item px-2 py-1 md:text-base rounded-md text-sm btn btn-outline mr-2"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(flatData.length / flatsPerPage)}
        >
          Next &rarr;
        </button>
      </div>
    </>
  );
};

export default FindFlat;
