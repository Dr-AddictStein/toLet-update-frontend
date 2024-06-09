import { message } from "antd";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../Provider/AuthProvider";
const FindRoommate = () => {
  const [activeButton, setActiveButton] = useState("roommate");
  const [roomMate, setRoomMate] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [gender, setGender] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roommatesPerPage] = useState(30);
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
    if (e.target !== dropdownRefPage.current && e.target !== pageRef.current) {
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
    const fetchData = async () => {
      let url = "";
      if (activeButton === "flat") {
        url = `http://localhost:5000/flatList?location=${searchValue}&sort=${priceSort}&type=flat`;
      } else if (activeButton === "sublet") {
        url = `http://localhost:5000/flatList?location=${searchValue}&sort=${priceSort}&type=sublet`;
      } else if (activeButton === "roommate") {
        url = `http://localhost:5000/roommateList?location=${searchValue}&sort=${priceSort}&gender=${gender}`;
      }
      const res = await axios.get(url);
      setRoomMate(res.data);
    };

    fetchData();
  }, [activeButton, searchValue, priceSort, gender]);

  console.log("roomMate", roomMate);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handlePriceSort = (sortValue) => {
    setPriceSort(sortValue);
    fetchData();
  };

  const handleGenderFilter = (value) => {
    setGender(value);
  };

  console.log(gender, "click");
  const dropDownIcon = (e) => {
    e.stopPropagation();
    setDropDownPage(!dropdownOpenPage);
  };

  const genderDropDownIcon = (e) => {
    e.stopPropagation();
    setDropDown(!dropDown);
  };
  const indexOfLastRoommate = currentPage * roommatesPerPage;
  const indexOfFirstRoommate = indexOfLastRoommate - roommatesPerPage;
  const currentRoommates = roomMate.slice(
    indexOfFirstRoommate,
    indexOfLastRoommate
  );
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // add To Roommate Wishlist ---------------------------

  const addToRoommateWishlist = async (roommate) => {
    console.log(roommate);
    try {
      const roomMates = {
        userEmail: user?.email,
        userId: user?._id,
        roommateWishList: roommate,
        flatWishList: "",
      };

      // console.log(roomMates);
      const response = await axios.post(
        `http://localhost:5000/wishlist`,
        roomMates
      );
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
  const truncateText = (text, length, flatId) => {
    if (text.length > length) {
      return (
        <>
          {text.substring(0, length)}...
          <Link to={`/roommateDetails/${flatId}`} className="link link-primary">
            Read more
          </Link>
        </>
      );
    }
    return text;
  };
  
  return (
    <>
      <div className="flex justify-center flex-wrap lg:flex-nowrap md:gap-2 lg:gap-2 gap-3 py-5">
        <div className="w-full sm:w-full md:w-full lg:w-2/5 flex border border-black rounded-lg mx-5 lg:mx-0">
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
        <div className="flex flex-col lg:flex-row gap-2  w-full mx-5 lg:mx-0 relative lg:w-auto">
          <div className="w-full sm:w-auto">
            <input
              value={searchValue}
              onChange={handleSearch}
              className="border border-black rounded-lg sm:px-6 px-1 py-2 sm:py-3 w-full"
              placeholder="Search Locations"
            />
          </div>
          <div className="flex flex-col md:flex-row w-full sm:w-auto">
            <div className="flex gap-1 md:gap-2 w-full">
              <div className="dropdown dropdown-bottom flex-1">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-wide  bg-blue-400 text-white py-2 sm:py-3 w-full"
                >
                  <span className="flex items-center justify-center gap-1">
                    Gender <IoIosArrowDown />
                  </span>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 text-black"
                >
                  <li>
                    <a onClick={() => handleGenderFilter("male")}>Male</a>
                  </li>
                  <li>
                    <a onClick={() => handleGenderFilter("female")}>Female</a>
                  </li>
                </ul>
              </div>
              <div className="dropdown dropdown-end flex-1">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-wide  bg-blue-400 text-white py-2 sm:py-3 w-full"
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

      <div className="flex justify-center mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-5 lg:px-9 px-6">
          {currentRoommates.map((roommate, index) => (
            <Link
              key={index}
              to={`/roommateDetails/${roommate._id}`}
              className="block"
            >
              <div className="bg-white md:px-4 py-5 rounded-lg ">
                <div className="relative border border-gray-150 grid h-[15rem] md:h-[20rem] w-full lg:max-w-[22rem] flex-col items-end justify-end overflow-hidden rounded-xl bg-white bg-clip-border text-center text-gray-700">
                  <div
                    className="absolute inset-0 m-0 h-[230px] md:h-[290px] lg:h-[319px] border rounded-md border-gray-150 w-full overflow-hidden bg-black/40   bg-cover bg-clip-border bg-center text-gray-700 shadow-none"
                    style={{
                      backgroundImage: `url('http://localhost:5000/images/${roommate?.roomateList?.images[0]}')`,
                    }}
                  >
                    <div className="flex justify-end items-center left-4 right-4 top-4 absolute">
                      <button
                        className="flex justify-end px-5 py-6"
                        onClick={() => addToRoommateWishlist(roommate)}
                      >
                        <svg
                          width={30}
                          className="hover:fill-red-500 hover:stroke-red-500 stroke-2 fill-transparent stroke-white "
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
                  </div>
                  <div className="relative lg:top-1 -top-5 md:-top-10 p-6 px-6 lg:py-6 md:px-5">
                    <img
                      alt="user"
                      src={`http://localhost:5000/images/${roommate?.roomateList?.contact_person?.image}`}
                      className="relative inline-block h-[50px] w-[50px] md:h-[70px] md:w-[70px] lg:h-[80px] lg:w-[80px] !rounded-lg border-2 border-white object-cover object-center"
                    />
                  </div>
                </div>
                <div className="mt-3 flex-1 text-sm">
                  <div>
                    <h3 className="text-gray-900 group-hover:underline group-hover:underline-offset-4">
                    Location:{" "}
                    {truncateText(
                      roommate?.roomateList?.description.location.address,
                      50,
                      roommate._id
                    )}
                    </h3>
                    <p className="mt-2 text-pretty text-xs text-gray-500">
                      HomeType: {roommate.roomateList.description.bedroomType}
                    </p>
                  </div>
                  <p className="text-gray-900 font-bold text-lg mt-2">
                    $ {roommate.roomateList.description.rent}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* for pagination */}

      <div className=" flex flex-wrap justify-center mb-10 mt-24">
        <button
          className="join-item px-2 py-1 md:text-base text-sm rounded-md btn btn-outline mr-2"
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
                currentPage === i + 1 ? "bg-blue-400 text-white" : ""
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
            currentPage === Math.ceil(roomMate.length / roommatesPerPage)
          }
        >
          Next &rarr;
        </button>
      </div>
    </>
  );
};

export default FindRoommate;
