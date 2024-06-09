import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const ReportListing = () => {
  const [reportListData, setReportListData] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    
    getReportList();
  }, []);

  const getReportList = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/reports`);
      setReportListData(response.data);
    } catch (error) {
      console.error("Error fetching flat details:", error);
    }
  };
 
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/reportLists/${id}`);
      setReportListData((prevData) => prevData.filter((item) => item._id !== id));
      getReportList()
      message.success("Delete successfully!");
      mes
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  const [modalFlatData, setModalFlatData] = useState(null)
  const handleModal = async (flat) =>{
    setOpenModal(true)
    setModalFlatData(flat)
  }
  const handleModalClose = async (flat) =>{
    setOpenModal(false)
    setModalFlatData(null)
  }
  console.log("reportListData", reportListData);
  return (
    <>
      <div className="overflow-x-auto ">
        <table className="min-w-[100%] shadow-md border mx-auto border-gray-100 my-6 rounded-lg">
          <thead>
            <tr className="bg-green-500 rounded-lg text-white">
              <th className="py-4 px-6 text-lg text-left border-b">
                Flat Image
              </th>
              <th className="py-4 px-6 text-lg text-left border-b">
                Flat Type
              </th>
              <th className="py-4 px-6 text-lg text-left border-b">
                Flat Owner
              </th>
              <th className="py-4 px-6 text-lg text-left border-b">
                Contact Number
              </th>
              <th className="py-4 px-6 text-lg text-left border-b">Location</th>
              <th className="py-4 px-6 text-lg text-left border-b">Report</th>
              <th className="py-4 px-6 text-lg border-b text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {reportListData.map((flat, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 border-b transition duration-300"
              >
                <td className="py-4 px-4 flex justify-start">
                  <img
                    src={`http://localhost:5000/image/${flat?.flatWishList?.images}`}
                    alt="Flat"
                    className="h-16 w-16 object-cover rounded-2xl bg-gray-300"
                  />
                </td>
                <td className="py-4 px-6 border-b text-sm uppercase font-medium">
                  {flat.flatWishList.flatList ? (
                    <span>
                      {flat?.flatWishList?.flatList.description?.type}
                    </span>
                  ) : (
                    <span>
                      {
                        flat?.roommateWishList?.roomateList?.description
                          ?.bedroomType
                      }
                    </span>
                  )}
                </td>

                <td className="py-4 px-6 border-b text-sm font-medium">
                  {" "}
                  {flat.flatWishList.flatList ? (
                    <span>
                      {flat?.flatWishList?.flatList?.contact_person?.firstName}{" "}
                      {flat?.flatWishList?.flatList?.contact_person?.lastName}
                    </span>
                  ) : (
                    <span>
                      {
                        flat?.roommateWishList?.roomateList?.contact_person
                          ?.firstName
                      }
                      {
                        flat?.roommateWishList?.roomateList?.contact_person
                          ?.lastName
                      }
                    </span>
                  )}
                </td>
                <td className="py-4 px-6 border-b text-sm font-medium">
                  {" "}
                  {flat.flatWishList.flatList ? (
                    <span>
                      {flat?.flatWishList?.flatList?.contact_person?.phone}
                    </span>
                  ) : (
                    <span>
                      {
                        flat?.roommateWishList?.roomateList?.contact_person
                          ?.phone
                      }
                    </span>
                  )}
                </td>
                <td className="py-4 px-6 border-b w-48 text-sm font-medium">
                  {" "}
                  {flat.flatWishList.flatList ? (
                    <span>
                      {
                        flat?.flatWishList?.flatList?.description?.location
                          ?.address
                      }
                      ,{" "}
                      {
                        flat?.flatWishList?.flatList?.description?.location
                          ?.city
                      }
                      ,{" "}
                      {
                        flat?.flatWishList?.flatList?.description?.location
                          ?.postalCode
                      }
                    </span>
                  ) : (
                    <span>
                      {
                        flat?.roommateWishList?.roomateList?.description
                          ?.location?.address
                      }
                      {
                        flat?.roommateWishList?.roomateList?.description
                          ?.location?.city
                      }
                      {
                        flat?.roommateWishList?.roomateList?.description
                          ?.location?.postalCode
                     
                     }
                    </span>
                  )}
                </td>

                <td className="py-4 px-6 border-b text-sm font-medium">
                  <div className="mx-auto flex items-center justify-center">
                    <button
                      onClick={()=>handleModal(flat)}
                      className="rounded-md bg-blue-400 px-4 py-[6px] text-white"
                    >
                      Notes!
                    </button>
                    <div
                      onClick={()=>handleModalClose()}
                      className={`fixed z-[100] flex items-center justify-center ${
                        openModal ? "opacity-1 visible" : "invisible opacity-0"
                      } inset-0 bg-black/20 backdrop-blur-sm duration-100`}
                    >
                      <div
                        onClick={(e_) => e_.stopPropagation()}
                        className={`absolute w-80 rounded-lg bg-white p-6 text-center drop-shadow-2xl ${
                          openModal
                            ? "opacity-1 translate-y-0 duration-300"
                            : "translate-y-20 opacity-0 duration-150"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <svg
                            className="w-16 stroke-rose-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g strokeWidth="0"></g>
                            <g strokeLinecap="round" strokeLinejoin="round"></g>
                            <g>
                              <path
                                opacity="0.4"
                                d="M12 7.75V13"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                              <path
                                d="M21.0802 8.58003V15.42C21.0802 16.54 20.4802 17.58 19.5102 18.15L13.5702 21.58C12.6002 22.14 11.4002 22.14 10.4202 21.58L4.48016 18.15C3.51016 17.59 2.91016 16.55 2.91016 15.42V8.58003C2.91016 7.46003 3.51016 6.41999 4.48016 5.84999L10.4202 2.42C11.3902 1.86 12.5902 1.86 13.5702 2.42L19.5102 5.84999C20.4802 6.41999 21.0802 7.45003 21.0802 8.58003Z"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                              <path
                                opacity="0.4"
                                d="M12 16.2002V16.3002"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                            </g>
                          </svg>
                          {modalFlatData?.reportMessage}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-6 border-b text-end">
                  <button
                    onClick={() => handleDelete(flat._id)}
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
    </>
  );
};

export default ReportListing;
