import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footers from "../Page/Footer/Footers";


const Main = () => {
  
  return (
    <div>
    {/* this is navbar  */}
     <Navbar/>
      
      <Outlet />  
      <Footers/>
    </div>
  );
};

export default Main;
