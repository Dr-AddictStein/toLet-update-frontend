import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useParams } from "react-router-dom";
import { useLoaderData } from "react-router-dom";

const WishListDetails = () => {
  const mapRef = useRef(null);
  const roomRef = useRef(null);
  const { data: wishListData } = useLoaderData();
  const [center, setCenter] = useState([23.8041, 90.4152]);
  const [roomCenter, setRoomCenter] = useState([23.8041, 90.4152]);
    const [openModal, setOpenModal] = useState(false);
    const [flatImageOpenModal, setFlatImageOpenModal]= useState(false);
    const [allRoommateImages, setAllRoommateImages] = useState([]);
    const[allFlatImages, setAllFlatImages]= useState([])
    const [details, setDetails] =useState([])
    const { id } = useParams();
    console.log(id);


    console.log("wishListData", wishListData?.roommateWishList?.roomateList?.description?.location?.lat, wishListData?.roommateWishList?.roomateList?.description?.location?.lon);

    useEffect(() => {
        const getWishListDetails = async () => {
            try {
              const response = await axios.get(
                `http://localhost:5000/wish/${id}`
              );
              setDetails(response.data);
              if (response?.data?.roommateWishList?.roomateList?.images) {
                setAllRoommateImages(response?.data?.roommateWishList?.roomateList?.images);
              }
              if (response.data.flatWishList?.flatList?.images) {
                setAllFlatImages(response?.data?.flatWishList?.flatList?.images);
              }
            } catch (error) {
              console.error("Error fetching flat details:", error);
            }
          };
        getWishListDetails();
      }, [id]);


// console.log("details",details);
// console.log("details",allRoommateImages);


useEffect(() => {
  const lat = parseFloat(wishListData?.roommateWishList?.roomateList?.description?.location?.lat);
  const lon = parseFloat(wishListData?.roommateWishList?.roomateList?.description?.location?.lon);
// console.log("ttttt",lat, lon);
  if (!isNaN(lat) && !isNaN(lon)) {
    setRoomCenter([lat, lon]);
  }
}, [wishListData]);

    useEffect(() => {
        if (roomRef.current) {
          roomRef.current.setView(roomCenter, 13);
        }
    }, [roomCenter]);

    const roomMap = (
        <MapContainer
            center={roomCenter}
            zoom={30}
            style={{
                height: "250px",
                width: "100%",
            }}
            ref={roomRef}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={roomCenter}>
                <Popup>
                {wishListData?.roommateWishList?.roomateList?.description?.location?.address}
                </Popup>
            </Marker>
        </MapContainer>
    );
//flat-----------------------------

useEffect(() => {
  setCenter([
      parseFloat(
        wishListData?.flatWishList
        ?.flatList
        ?.description?.location
        ?.lat),
      parseFloat(
        wishListData?.flatWishList
        ?.flatList
        ?.description?.location
        ?.lon),
  ]);
}, [wishListData]);

useEffect(() => {
  if (mapRef.current) {
      mapRef.current.setView(center, 13);
  }
}, [center]);

const maps = (
  <MapContainer
      center={center}
      zoom={30}
      style={{
          height: "250px",
          width: "100%",
      }}
      ref={mapRef}
  >
      <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={center}>
          <Popup>
       {  wishListData?.flatWishList?.flatList?.description?.location
        ?.address}
          </Popup>
      </Marker>
  </MapContainer>
);
console.log(maps);
  return (
 <>
      {/* Render roommate wishlist */}
      {details.roommateWishList && (
        <div>

        <div className="w-11/12 mx-auto lg:flex mt-3 md:rounded-lg lg:rounded-none gap-3 md:mb-5">
        <div className="lg:w-[50%] relative">
          <img
            src={`http://localhost:5000/images/${details.roommateWishList?.roomateList?.images[0]}`}
            alt=""
            className="lg:h-[800px] md:h-[400px] object-cover md:max-h-[500px] lg:max-h-[500px] max-h-[280px] w-full rounded-2xl lg:rounded-none lg:rounded-l-2xl  xl:rounded-l-2xl border border-gray-150 mb-3"
          />
           <div className="absolute left-0  bottom-[5%] w-full flex justify-end  text-center md:hidden">
              <div className=" bg-white text-black rounded-lg shadow-lg border-2 mr-3">
                <div>
                  <button
                    onClick={() => setOpenModal(true)}
                    className="rounded-sm bg-blue-400   px-5 py-[6px] text-white"
                    id="_modal_NavigateUI"
                  >
                    Show All Photo
                  </button>
                  <div
                    onClick={() => setOpenModal(false)}
                    className={`fixed z-[100] flex items-center justify-center ${
                      openModal ? "visible opacity-100" : "invisible opacity-0"
                    } inset-0 bg-black/20 backdrop-blur-sm duration-100 `}
                  >
                    <div
                      onClick={(e_) => e_.stopPropagation()}
                      className={`text- absolute max-w-xl rounded-sm h-96 overflow-y-auto bg-white p-6 drop-shadow-lg  ${
                        openModal
                          ? "scale-1 opacity-1 duration-300"
                          : "scale-0 opacity-0 duration-150"
                      }`}
                    >
                      <div className="flex justify-end">
                        <button
                          onClick={() => setOpenModal(false)}
                          className="rounded-sm border border-red-600 px-6 py-[6px] text-red-600 duration-150 hover:bg-red-600 hover:text-white"
                        >
                          X
                        </button>
                      </div>
                      <h1 className="mb-2 text-2xl font-semibold">
                        All Room Images!
                      </h1>
                      {allRoommateImages.map((image, index) => (
                        <div key={index} className="flex-1 gap-2 ">
                          <img
                            src={`http://localhost:5000/images/${image}`}
                            alt=""
                            className="lg:h-[500px] md:h-[400px] object-cover h-56 w-full mb-4 border border-gray-150 rounded-md"
                          />
                        </div>
                      ))}
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div className="lg:w-[50%] grid grid-cols-1 md:grid-cols-2  md:h-[500px] gap-3">
          <div className="bg-cover overflow-hidden relative ">
            <img
              src={`http://localhost:5000/images/${details.roommateWishList?.roomateList?.images[1]}`}
              alt=""
              className="w-full h-full border object-cover border-gray-150 md:block hidden rounded-tl-2xl  lg:rounded-tl"
            />
          </div>
          <div className="bg-cover overflow-hidden relative rounded-tr-2xl ">
            <img
              src={`http://localhost:5000/images/${details.roommateWishList?.roomateList?.images[2]}`}
              alt=""
              className="w-full h-full border object-cover border-gray-150 md:block hidden "
            />
          </div>
          <div className="bg-cover overflow-hidden relative">
            <img
              src={`http://localhost:5000/images/${details.roommateWishList?.roomateList?.images[3]}`}
              alt=""
              className="w-full h-full border object-cover border-gray-150 md:block hidden rounded-bl-2xl lg:rounded-none  lg:rounded-tl"
            />
          </div>
          <div className="bg-cover overflow-hidden relative rounded-br-2xl">
            <img
              src={`http://localhost:5000/images/${details.roommateWishList?.roomateList?.images[4]}`}
              alt=""
              className="w-full h-full object-cover rounded-br-2xl border border-gray-150 md:block hidden"
            />
            <div className="absolute left-0  bottom-[5%] w-full flex justify-end  text-center ">
              <div className=" bg-white px-3 py-2 text-black rounded-lg shadow-lg border-2  mr-3 md:block hidden">
                <div>
                  <button
                    onClick={() => setOpenModal(true)}
                    className="rounded-sm  px-5 py-[6px] text-black"
                    id="_modal_NavigateUI"
                  >
                    Show All Photo
                  </button>
                  <div
                    onClick={() => setOpenModal(false)}
                    className={`fixed z-[100] flex items-center justify-center ${
                      openModal ? "visible opacity-100" : "invisible opacity-0"
                    } inset-0 bg-black/20 backdrop-blur-sm duration-100 `}
                  >
                    <div
                      onClick={(e_) => e_.stopPropagation()}
                      className={`text- absolute max-w-xl rounded-sm h-96 overflow-y-auto bg-white p-6 drop-shadow-lg  ${
                        openModal
                          ? "scale-1 opacity-1 duration-300"
                          : "scale-0 opacity-0 duration-150"
                      }`}
                    >
                      <div className="flex justify-end">
                        <button
                          onClick={() => setOpenModal(false)}
                          className="rounded-sm border border-red-600 px-6 py-[6px] text-red-600 duration-150 hover:bg-red-600 hover:text-white"
                        >
                          X
                        </button>
                      </div>
                      <h1 className="mb-2 text-2xl font-semibold">
                        All Room Images!
                      </h1>
                      {allRoommateImages.map((image, index) => (
                        <div key={index} className="flex-1 gap-2 ">
                          <img
                            src={`http://localhost:5000/images/${image}`}
                            alt=""
                            className="lg:h-[500px] md:h-[400px] object-cover h-56 w-full mb-4 border border-gray-150 rounded-md"
                          />
                        </div>
                      ))}
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  {/* details sections starts */}
    <div className="mx-auto lg:mt-16 md:px-16 md:mt-7 mt-4">
         <div className="flex justify-center md:gap-24">
           <div className=" md:px-0  ">
             <div className="px-5 md:px-0 ">
               <div className="mb-16 flex-1 justify-center">
                 <div className="mb-5 flex justify-start gap-10">
                   <div>
                     {" "}
                     <img
                       src={`http://localhost:5000/images/${details.roommateWishList?.roomateList?.contact_person?.image}`}
                       alt=""
                       className="lg:w-16 md:w-32 object-cover md:h-14 lg:h-16 rounded-lg w-28 h-14"
                     />
                   </div>
                   <div className="mx-5 lg:mx-0">
                     <h2 className="lg:text-xl text-sm md:text-base capitalize  font-medium text-black">
                       User Name:{" "}
                       {
                         details.roommateWishList?.roomateList?.contact_person
                           ?.firstName
                       }{" "}
                       {details.roommateWishList?.roomateList?.contact_person?.lastName}
                     </h2>
                     <h2 className="lg:text-xl text-sm md:text-base capitalize  font-medium text-black">
                       Home type:{" "}
                       {details.roommateWishList?.roomateList?.description?.bedroomType}
                     </h2>
                     <p className="lg:text-xl text-sm md:text-base capitalize  font-medium text-black">
                       Location:{" "}
                       {
                         details.roommateWishList?.roomateList?.description?.location
                           ?.address
                       }
                       ,{" "}
                       {
                         details.roommateWishList?.roomateList?.description?.location
                           ?.city
                       }
                     </p>
                   </div>
                 </div>
                 {/* div for right side */}
                 <div className="flex flex-col gap-3 md:px-6 mt-4">
                                  <div className="h-auto p-5 lg:w-[416px] md:w-[356px] max-w-[420px] block md:hidden  md:mt-3 rounded-lg shadow-lg border border-gray-150">
               <div className="mx-5 lg:mx-0">
                 <div className="flex items-center justify-between">
                 <h2 className="lg:text-3xl font-bold md:my-5">
                     ${details.roommateWishList?.roomateList?.description?.rent}
                   </h2>
                 </div>
                 <button
                   className="text-white px-4 py-3 mx-2 w-full border-2 mt-16 rounded-lg bg-blue-400  
                                transition-all duration-500 capitalize items-center flex justify-center gap-5 lg:text-xl text-sm md:text-base  font-medium"
                 >
                   <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="1em"
                     height="1em"
                     viewBox="0 0 24 24"
                   >
                     <path
                       fill="currentColor"
                       d="m19.23 15.26l-2.54-.29a1.99 1.99 0 0 0-1.64.57l-1.84 1.84a15.045 15.045 0 0 1-6.59-6.59l1.85-1.85c.43-.43.64-1.03.57-1.64l-.29-2.52a2.001 2.001 0 0 0-1.99-1.77H5.03c-1.13 0-2.07.94-2 2.07c.53 8.54 7.36 15.36 15.89 15.89c1.13.07 2.07-.87 2.07-2v-1.73c.01-1.01-.75-1.86-1.76-1.98"
                     />
                   </svg>
                   +88 {details.roommateWishList?.roomateList?.contact_person?.phone}
                 </button>
               </div>
             </div>
            
           </div>
                 <div className="border-t-2 border-b-2 mx-5 lg:mx-0">
                   <h1 className="mt-8 lg:text-3xl  mb-[12px] text-sm md:text-base capitalize  font-medium text-black">
                     Personal Information
                   </h1>
                   <ul className="mb-8 lg:text-xl text-sm md:text-base capitalize  font-medium text-black">
                     <li>
                       - Name :{" "}
                       {
                         details.roommateWishList?.roomateList?.contact_person
                           ?.firstName
                       }
                     </li>
                     <li>- Available From : {
                         details.roommateWishList?.roomateList?.description
                           ?.availableFrom
                       }</li>
                     <li className="">
                       - Age and Gender :{" "}
                       {
                         details.roommateWishList?.roomateList?.contact_person
                           ?.userGender
                       }{" "}
                     </li>
                     <li>
                       - Employment :{" "}
                       {
                         details.roommateWishList?.roomateList?.contact_person
                           ?.userEmploymentStatus
                       }
                     </li>
                   </ul>
    
                   <h1 className="mt-8   mb-[12px] lg:text-3xl text-sm md:text-base capitalize  font-medium text-black">
                     Home Details
                   </h1>
                   <ul className="mb-8 lg:text-xl text-sm md:text-base capitalize  font-medium text-black">
                     <li>
                       - Bedroom Type :{" "}
                       {details.roommateWishList?.roomateList?.description?.bedroomType}
                     </li>
                   </ul>

                   <h1 className="mt-8 lg:text-3xl  mb-[12px] text-sm md:text-base capitalize  font-medium text-black">
                     Flatmate Preferences
                   </h1>
                   <ul className="mb-8 lg:text-xl text-sm md:text-base capitalize  font-medium text-black">
                     <li>
                       - Gender :{" "}
                       {
                         details.roommateWishList?.roomateList?.roomatePreferences
                           ?.gender
                       }{" "}
                     </li>
                     <li>
                       - Smoking at Home :{" "}
                       {
                        details.roommateWishList?.roomateList?.roomatePreferences
                           ?.smoking
                       }
                     </li>
                     <li>
                       - Pets :{" "}
                       {details.roommateWishList?.roomateList?.roomatePreferences?.pets}
                     </li>
                     <li>
                       - Employment :{" "}
                       {
                         details.roommateWishList?.roomateList?.roomatePreferences
                           ?.employmentStatus
                       }
                     </li>
                   </ul>
                 </div>

                
               </div>
             </div>
           </div>
           {/* div for right side */}
           <div className="flex flex-col gap-3">
             <div className="h-auto p-5 md:w-[360px] lg:w-[400px] w-96 max-w-[400px] md:block hidden  md:mt-3 rounded-lg shadow-lg border border-gray-150">
               <div>
                 <div className="flex items-center justify-between">
                   <h2 className="text-3xl font-bold my-5">
                     ${details.roommateWishList?.roomateList?.description?.rent}
                   </h2>
                 
                 </div>
                 <button
                   className="text-white px-4 py-3 mx-2 w-full border-2 mt-16 rounded-lg bg-blue-400  
                                transition-all duration-500 capitalize items-center flex justify-center gap-5"
                 >
                   <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="1em"
                     height="1em"
                     viewBox="0 0 24 24"
                   >
                     <path
                       fill="currentColor"
                       d="m19.23 15.26l-2.54-.29a1.99 1.99 0 0 0-1.64.57l-1.84 1.84a15.045 15.045 0 0 1-6.59-6.59l1.85-1.85c.43-.43.64-1.03.57-1.64l-.29-2.52a2.001 2.001 0 0 0-1.99-1.77H5.03c-1.13 0-2.07.94-2 2.07c.53 8.54 7.36 15.36 15.89 15.89c1.13.07 2.07-.87 2.07-2v-1.73c.01-1.01-.75-1.86-1.76-1.98"
                     />
                   </svg>
                   +88 {details.roommateWishList?.roomateList?.contact_person?.phone}
                 </button>
               </div>
             </div>
            
           </div>
         </div>
          {/* map */}
      {wishListData?.roommateWishList?.roomateList?.description?.location?.lat !=23.8041 && (<div className="relative h-full max-md:min-h-[350px] mt-16 px-3">

                  {roomMap}
                </div>)}
       </div>

   </div>
      )}

      {/* Render flat wishlist */}
      {details.flatWishList && (
        <div>

        <div className="w-11/12 mx-auto lg:flex mt-3 md:rounded-lg lg:rounded-none gap-3 mb-5">
        <div className="lg:w-[50%] relative">
          <img
            src={`http://localhost:5000/images/${details.flatWishList?.flatList?.images[0]}`}
            alt=""
            className="lg:h-[800px] md:h-[400px] object-cover md:max-h-[500px] lg:max-h-[500px] max-h-[280px] w-full rounded-2xl lg:rounded-none lg:rounded-l-2xl  xl:rounded-l-2xl border border-gray-150 mb-3"
          />
           <div className="absolute left-0  bottom-[5%] w-full flex justify-end text-center md:hidden ">
              <div className=" bg-white text-black rounded-lg shadow-lg border-2 mr-3">
                <div>
                  <button
                    onClick={() => setFlatImageOpenModal(true)}
                    className="rounded-sm  px-5 py-[6px] text-black"
                    id="_modal_NavigateUI"
                  >
                    Show All Photo
                  </button>
                  <div
                    onClick={() => setFlatImageOpenModal(false)}
                    className={`fixed z-[100] flex items-center justify-center ${
                      flatImageOpenModal ? "visible opacity-100" : "invisible opacity-0"
                    } inset-0 bg-black/20 backdrop-blur-sm duration-100 dark:bg-white/10`}
                  >
                    <div
                      onClick={(e_) => e_.stopPropagation()}
                      className={`text- absolute max-w-xl rounded-sm h-96 overflow-y-auto bg-white p-6 drop-shadow-lg dark:bg-black dark:text-white ${
                        flatImageOpenModal
                          ? "scale-1 opacity-1 duration-300"
                          : "scale-0 opacity-0 duration-150"
                      }`}
                    >
                      <div className="flex justify-end">
                        <button
                          onClick={() => setFlatImageOpenModal(false)}
                          className="rounded-sm border border-red-600 px-6 py-[6px] text-red-600 duration-150 hover:bg-red-600 hover:text-white"
                        >
                          X
                        </button>
                      </div>
                      <h1 className="mb-2 text-2xl font-semibold">
                        All Room Images!
                      </h1>
                      {allFlatImages.map((image, index) => (
                        <div key={index} className="flex-1 gap-2 ">
                          <img
                            src={`http://localhost:5000/images/${image}`}
                            alt=""
                            className="lg:h-[500px] object-cover md:h-[400px] h-56 w-full mb-4 border border-gray-150 rounded-md"
                          />
                        </div>
                      ))}
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div className="lg:w-[50%] grid grid-cols-1 md:grid-cols-2  md:h-[500px] gap-3">
          <div className="bg-cover overflow-hidden relative ">
            <img
              src={`http://localhost:5000/images/${details?.flatWishList?.flatList?.images[1]}`}
              alt=""
              className="w-full h-full border object-cover border-gray-150 md:block hidden rounded-tl-2xl  lg:rounded-tl"
            />
          </div>
          <div className="bg-cover overflow-hidden relative rounded-tr-2xl ">
            <img
              src={`http://localhost:5000/images/${details?.flatWishList?.flatList?.images[2]}`}
              alt=""
              className="w-full h-full object-cover border border-gray-150 md:block hidden "
            />
          </div>
          <div className="bg-cover overflow-hidden relative">
            <img
              src={`http://localhost:5000/images/${details?.flatWishList?.flatList?.images[3]}`}
              alt=""
              className="w-full h-full object-cover border border-gray-150 md:block hidden rounded-bl-2xl lg:rounded-none  lg:rounded-tl"
            />
          </div>
          <div className="bg-cover overflow-hidden relative rounded-br-2xl">
            <img
              src={`http://localhost:5000/images/${details?.flatWishList?.flatList?.images[4]}`}
              alt=""
              className="w-full h-full object-cover rounded-br-2xl border border-gray-150 md:block hidden"
            />
            <div className="absolute left-0  bottom-[5%] w-full flex justify-end  text-center ">
              <div className=" bg-white px-3 py-2 text-black rounded-lg shadow-lg border-2  mr-3 md:block hidden">
                <div>
                  <button
                    onClick={() => setFlatImageOpenModal(true)}
                    className="rounded-sm bg-blue-400  px-5 py-[6px] text-white"
                    id="_modal_NavigateUI"
                  >
                    Show All Photo
                  </button>
                  <div
                    onClick={() => setFlatImageOpenModal(false)}
                    className={`fixed z-[100] flex items-center justify-center ${
                      flatImageOpenModal ? "visible opacity-100" : "invisible opacity-0"
                    } inset-0 bg-black/20 backdrop-blur-sm duration-100 dark:bg-white/10`}
                  >
                    <div
                      onClick={(e_) => e_.stopPropagation()}
                      className={`text- absolute max-w-xl rounded-sm h-96 overflow-y-auto bg-white p-6 drop-shadow-lg dark:bg-black dark:text-white ${
                        flatImageOpenModal
                          ? "scale-1 opacity-1 duration-300"
                          : "scale-0 opacity-0 duration-150"
                      }`}
                    >
                      <h1 className="mb-2 text-2xl font-semibold">
                        All Room Images!
                      </h1>
                      {allFlatImages.map((image, index) => (
                        <div key={index} className="flex-1 gap-2 ">
                          <img
                            src={`http://localhost:5000/images/${image}`}
                            alt=""
                            className="lg:h-[500px] object-cover md:h-[400px] h-56 w-full mb-4 border border-gray-150 rounded-md"
                          />
                        </div>
                      ))}
                      <div className="flex justify-end">
                        <button
                          onClick={() => setFlatImageOpenModal(false)}
                          className="rounded-sm border border-red-600 px-6 py-[6px] text-red-600 duration-150 hover:bg-red-600 hover:text-white"
                        >
                          X
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  {/* details sections starts */}
  <div className="mx-auto lg:mt-16 md:px-16 md:mt-7 mt-4">
         <div className="flex justify-around  md:gap-24">
           <div className=" md:px-0 md:w-3/4 ">
             <div className=" px-5 md:px-0 ">
               <div className="mb-16 flex-1 justify-center">
                 <div className="mb-5 flex justify-start gap-10">
                   <div className="mx-5 lg:mx-0">
                     <h2 className="lg:text-xl text-sm md:text-base capitalize  font-medium text-black">
                       User Name:{" "}
                       {
                         details?.flatWishList?.flatList?.contact_person
                           ?.firstName
                       }{" "}
                       {details?.flatWishList?.flatList?.contact_person?.lastName}
                     </h2>
                     <h2 className="lg:text-xl text-sm md:text-base capitalize  font-medium text-black">
                       Home type:{" "}
                       {details?.flatWishList?.flatList?.description?.type}
                     </h2>
                     <p className="lg:text-xl text-sm md:text-base capitalize  font-medium text-black">
                       Location:{" "}
                       {
                         details?.flatWishList?.flatList?.description?.location
                           ?.address
                       }
                       ,{" "}
                       {
                         details?.flatWishList?.flatList?.description?.location
                           ?.city
                       }
                     </p>
                   </div>
                 </div>
                  {/* div for right side */}
           <div className="flex flex-col gap-3 md:px-6 mt-4 mb-5">
             <div className="h-auto p-5 lg:w-[416px] md:w-[356px] max-w-[470px] block md:hidden  md:mt-3 rounded-lg shadow-lg border border-gray-150">
               <div>
                 <div className="flex items-center justify-between">
                   <h2 className="lg:text-3xl font-bold md:my-5">
                     ${details?.flatWishList?.flatList?.description?.rent}
                   </h2>
            
                 </div>
                 <button
                   className="text-black px-4 py-3 mx-2 w-full border-2 mt-16 rounded-lg bg-blue-400  
                                transition-all duration-500 capitalize items-center flex justify-center gap-5"
                 >
                   <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="1em"
                     height="1em"
                     viewBox="0 0 24 24"
                   >
                     <path
                       fill="currentColor"
                       d="m19.23 15.26l-2.54-.29a1.99 1.99 0 0 0-1.64.57l-1.84 1.84a15.045 15.045 0 0 1-6.59-6.59l1.85-1.85c.43-.43.64-1.03.57-1.64l-.29-2.52a2.001 2.001 0 0 0-1.99-1.77H5.03c-1.13 0-2.07.94-2 2.07c.53 8.54 7.36 15.36 15.89 15.89c1.13.07 2.07-.87 2.07-2v-1.73c.01-1.01-.75-1.86-1.76-1.98"
                     />
                   </svg>
                   +88 {details?.flatWishList?.flatList?.contact_person?.phone}
                 </button>
               </div>
             </div>
           </div>
                 <div className="border-t-2 border-b-2 mx-5 lg:mx-0">
                   <h1 className="mt-8 lg:text-3xl  mb-[12px] font-semibold text-black">
                     Personal Information
                   </h1>
                   <ul className="lg:text-xl text-sm md:text-base capitalize  font-medium text-black">
                     <li>
                       - Name :{" "}
                       {
                         details?.flatWishList?.flatList?.contact_person
                           ?.firstName
                       }{" "}{
                        details?.flatWishList?.flatList?.contact_person
                          ?.lastName
                      }
                     </li>
                     <li>- Available From : {
                         details?.flatWishList?.flatList?.description
                           ?.availableFrom
                       }</li>
                     <li className="">
                       - City :{" "}
                       {
                         details?.flatWishList?.flatList?.contact_person
                           ?.userCity
                       }{" "}
                     </li>
                     <li>
                       - Postal Code:{" "}
                       {
                        details?.flatWishList?.flatList?.contact_person
                           ?.userPostalCode
                       }
                     </li>
                   </ul>
                  
                   <h1 className="mt-8 lg:text-3xl  mb-[12px] text-sm md:text-base capitalize  font-medium text-black">
                     Home Details
                   </h1>
                   <ul className="mb-8 lg:text-xl text-sm md:text-base capitalize  font-medium text-black">
                     <li>
                       - Bedroom Type :{" "}
                       {details?.flatWishList?.flatList?.description?.type}
                     </li>
                   </ul>
                 </div>

                
               </div>
             </div>
           </div>
           {/* div for right side */}
           <div className="flex flex-col gap-3">
             <div className="h-auto p-5 md:w-[360px] lg:w-[400px] w-96 max-w-[400px] md:block hidden  md:mt-3 rounded-lg shadow-lg border border-gray-150">
               <div>
                 <div className="flex items-center justify-between">
                   <h2 className="text-3xl font-bold my-5">
                     ${details?.flatWishList?.flatList?.description?.rent}
                   </h2>
                  
                 </div>
                 <button
                   className="text-white px-4 py-3 mx-2 w-full border-2 mt-16 rounded-lg bg-blue-400  
                                transition-all duration-500 capitalize items-center flex justify-center gap-5"
                 >
                   <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="1em"
                     height="1em"
                     viewBox="0 0 24 24"
                   >
                     <path
                       fill="currentColor"
                       d="m19.23 15.26l-2.54-.29a1.99 1.99 0 0 0-1.64.57l-1.84 1.84a15.045 15.045 0 0 1-6.59-6.59l1.85-1.85c.43-.43.64-1.03.57-1.64l-.29-2.52a2.001 2.001 0 0 0-1.99-1.77H5.03c-1.13 0-2.07.94-2 2.07c.53 8.54 7.36 15.36 15.89 15.89c1.13.07 2.07-.87 2.07-2v-1.73c.01-1.01-.75-1.86-1.76-1.98"
                     />
                   </svg>
                   +88 {details?.flatWishList?.flatList?.contact_person?.phone}
                 </button>
               </div>
             </div>
           </div>
         
         </div>

            {/* map */}
            { wishListData?.flatWishList
        ?.flatList
        ?.description?.location
        ?.lat != 23.8041 &&(<div className=" h-full max-md:min-h-[350px] mt-16 px-3">
                   {maps}
                 </div>)}
       </div>
   </div>
      )}
    </>
  );
};

  
export default WishListDetails