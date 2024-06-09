import { Link , NavLink,} from "react-router-dom";
import MenuDropDown from "./MenuDropDown";
import { GiFamilyHouse } from "react-icons/gi";
import { useEffect, useState } from "react";
import axios from "axios";

const Navbar = () => {
  const [collapse, setCollapse] = useState(false);
  const [logo,setLogo] = useState()

  useEffect(() => {
    fetchLogo();
  },[])

  const fetchLogo = async () => {
    try {
      const response = await axios.get("http://localhost:5000/logo");
      setLogo(response.data[0]);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div className=" w-full bg-white z-10 shadow-sm lg:px-12 px-4">
      <div className="py-4 border-b-[1px]">
        <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
          {/* log0 */}
          <Link to="/">
            <img src={logo?.imagePath} className="md:w-12 lg:h-12 w-10 h-9" />
          </Link>
   
         {/* menu item  */}
         <div
            className={`!visible ${collapse ? "block" : "hidden"
              } absolute md:static top-14 bg-white w-full md:w-auto border md:border-none items-center px-3 lg:!flex lg:basis-auto z-50`}
          >
            <ul className="flex mx-auto flex-col md:flex-row justify-center gap-5 py-3">
              <li>
                <NavLink to="/about" className="border hover:text-primary border-white p-1 lg:p-2">
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="border hover:text-primary border-white p-1 lg:p-2">
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>
          {/* DropDown  */}
          <MenuDropDown />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
