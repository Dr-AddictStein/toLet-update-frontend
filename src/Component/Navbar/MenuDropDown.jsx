import { useContext, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import avatarImg from "../../assets/placeholder.jpg";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";

const MenuDropDown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { auths, logOut } = useContext(AuthContext);
  const user = auths?.user;
  // console.log(user);
  // const adminEmail = "admin@admin.com";
  const isAdmin = user && user.role === "admin";

  const [collapse, setCollapse] = useState(false);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-2 md:gap-3">
        <div className="flex items-center">
          {isAdmin && (
              <Link to="/dashboard">
                <button className="hidden md:block disabled:cursor-not-allowed cursor-pointer bg-blue-400 rounded-lg px-2 py-2  md:px-4 text-[10px] sm:text-xs font-semibold  transition text-white md:mr-2">
                  Dashboard
                </button>
              </Link>
            )}
          <div>
          <Link to="/createFlatList">
            <button className="disabled:cursor-not-allowed cursor-pointer bg-blue-400 rounded-lg px-2 py-2 text-[10px] sm:text-xs  md:px-4 font-semibold transition text-white">
              Create flat
            </button>
          </Link>
          <Link to="/createRoommateList">
            <button className="disabled:cursor-not-allowed ms-2 cursor-pointer bg-blue-400 rounded-lg px-2 py-2  md:px-4 text-[10px] sm:text-xs font-semibold  transition text-white">
              Create roommate listing
            </button>
          </Link>
          </div>
        </div>
        {/* DropDownButton
         */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="sm:p-4 sm:py-1 sm:px-2 sm:border-[1px] sm:border-neutral-2 sm:flex sm:flex-row sm:items-center 
          sm:gap-3 sm:rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu />
          <div className="avatar hidden sm:block">
            <div className="sm:w-8 md:rounded-full ">
              <img alt="profile" src={user?.user_image} />
            </div>
          </div>
          <div className="">{/* avatar  */}</div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[90vw] md:w-[15vw] xl:w-[10vw] bg-white overflow-hidden right-0 top-12 text-sm z-10">
          <div className="flex flex-col cursor-pointer">
            <div className="flex flex-col px-2">
              {isAdmin && (
                <Link to="/dashboard">
                  <button className="block w-full mt-5 lg:mt-0 px-11 py-1 md:hidden text-[10px] disabled:cursor-not-allowed ms-2 cursor-pointer bg-blue-400 rounded-lg lg:py-3 lg:px-4 lg:text-sm text-white font-semibold transition">
                    Dashboard
                  </button>
                </Link>
              )}
              {/* <Link to="/createFlatList">
                <button className="block mt-5 lg:mt-0 px-7 py-1 md:hidden text-[10px] disabled:cursor-not-allowed ms-2 cursor-pointer w-full bg-blue-400 rounded-lg text-white lg:py-3 lg:px-4 lg:text-sm font-semibold  transition">
                  Create flat
                </button>
              </Link>
              <Link to="/createRoommateList">
                <button className="block mt-5 lg:mt-0 px-3 py-1 md:hidden disabled:cursor-not-allowed text-[10px] ms-2 cursor-pointer w-full bg-blue-400 rounded-lg text-white lg:py-3 lg:px-4 lg:text-sm font-semibold  transition">
                  Create roommate listing
                </button>
              </Link> */}
            </div>
            <Link
              to="/"
              className="block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold"
            >
              Home
            </Link>
            <Link
              to="/"
              className="block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold"
            >
              About
            </Link>
            <Link
              to="/"
              className="block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold"
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to="/wishlist"
                  className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                >
                  Wishlist
                </Link>
                <Link
                  to="/myAccount"
                  className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                >
                  My Account
                </Link>
                <Link
                  to="/myListing"
                  className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                >
                  My Listing
                </Link>
                <Link
                  onClick={logOut}
                  className="px-5 py-2 border hover:bg-neutral-100 font-semibold cursor-pointer"
                >
                  LogOut
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/signUp"
                  className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuDropDown;
