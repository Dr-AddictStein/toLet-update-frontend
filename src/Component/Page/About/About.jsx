import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const About = () => {
  const [aboutInfo, setAboutInfo] = useState({});
  useEffect(() => {
    aboutData();
  }, []);

  const aboutData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/about`);
      setAboutInfo(response.data[0]);
    } catch (error) {
      console.log("An error occurred while fetching data.");
    }
  };
  return (
    <div>
      <div className="">
        <div className="bg-cover bg-center" style={{backgroundImage: `url(https://i.ibb.co/h1VLzB9/homme.jpg)`}}>
          <div className=" md:max-w-screen-2xl mx-auto p-24 justify-center">
            <h2 className="lg:text-6xl font-bold text-white/90 font-serif text-center">
              About
            </h2>
            <div className="mt-2 text-center">
              <NavLink
                to="/"
                className=" relative font-medium text-base text-white/90 mx-3"
              >
                Home /
              </NavLink>
              <NavLink
                to="/"
                className="relative font-medium text-base text-white/90"
              >
                About Details
              </NavLink>
              
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-center'>
          {aboutInfo && (
            
              <div className="text-center mt-10 w-8/12">
                {aboutInfo.description}
              </div>
            
               
       
          )}
        </div>
    </div>
  )
}

export default About