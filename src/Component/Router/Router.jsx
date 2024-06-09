import axios from "axios";
import { createBrowserRouter } from "react-router-dom";
import ForgetPassword from "../Authentication/ForgetPassword/ForgetPassword";
import Login from "../Authentication/Login/Login";
import ResetPassword from "../Authentication/ResetPassword/ResetPassword";
import SignUp from "../Authentication/SignUp/SignUp";
import { AllUsers } from "../DashboardRoutes/AllUsers";
import { CustomizeContent } from "../DashboardRoutes/CustomizeContent";
import Listing from "../DashboardRoutes/ListOFData/Listing";
import RommateList from "../DashboardRoutes/ListOFData/RommateList";
import SubletList from "../DashboardRoutes/ListOFData/SubletList";
import ReportListing from "../DashboardRoutes/ReportListing";
import { DashBoardLayout } from "../Layout/DashBoardLayout";
import Main from "../Layout/Main";
import About from "../Page/About/About";
import Contact from "../Page/Contact/Contact";
import FindFlat from "../Page/FindFlat/FindFlat";
import FindSublet from "../Page/FindFlat/FindSublet";
import FlatDetails from "../Page/FindFlat/FlatDetails";
import FindRoommate from "../Page/FindRoommate/FindRoommate";
import RoommateDetails from "../Page/FindRoommate/RoommateDetails";
import FlatListForm from "../Page/Form/FlatListForm/FlatListForm";
import RoommateListForm from "../Page/Form/RoommateListForm/RoommateListForm";
import Home from "../Page/Home/Home";
import FlatData from "../Page/Home/MyListing/FlatData";
import MyListing from "../Page/Home/MyListing/MyListing";
import RoomData from "../Page/Home/MyListing/RoomData";
import SubletData from "../Page/Home/MyListing/SubletData";
import MyAccount from "../Page/MyAcount/MyAccount";
import WishListDetails from "../Page/Wishlist/WishListDetails";
import Wishlist from "../Page/Wishlist/Wishlist";
import AdminRoute from "./AdminRoute";
import PrivateRouter from "./PrivateRouter";
import Logoupdate from "../DashboardRoutes/Logoupdate";



export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/about",
                element: <About />,
            },
            {
                path: "/contact",
                element: <Contact />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/forgetPassword",
                element: <ForgetPassword />,
            },
            {
                path: "/signUp",
                element: <SignUp />,
            },
            {
                path: "/reset_password/:id/:token",
                element: <ResetPassword />,
            },
            {
                path: "/findFlat",
                element: <FindFlat />,
            },
            {
                path: "/findSublet",
                element: <FindSublet />,
            },
            {
                path: "/findRoommate",
                element: <FindRoommate />,
            },
            {
                path: "/flatDetails/:id",
                loader: ({ params }) =>
                    axios.get(`http://localhost:5000/flatDetails/${params.id}`),
                element: (
                    <PrivateRouter>
                        <FlatDetails />
                    </PrivateRouter>
                ),
            },
            {
                path: "/roommateDetails/:id",
                loader: ({ params }) =>
                    axios.get(`http://localhost:5000/roommate/${params.id}`),
                element: (
                    <PrivateRouter>
                        {" "}
                        <RoommateDetails />
                    </PrivateRouter>
                ),
            },
            {
                path: "/createFlatList",
                element: <FlatListForm />,
            },
            {
                path: "/createRoommateList",
                element: <RoommateListForm />,
            },
            {
                path: "/wishlist",
                element: <Wishlist />,
            },
            {
                path: "/myAccount",
                element: <MyAccount />,
            },
            {
                path: "/myListing",
                element: <MyListing />,
            },
            {
                path: "/flatData",
                element: <FlatData />,
            },
            {
                path: "/subletData",
                element: <SubletData />,
            },
            {
                path: "/roomData",
                element: <RoomData />,
            },
            {
                path: "/listDetails/:id",
                loader: ({ params }) =>
                    axios.get(`http://localhost:5000/wish/${params.id}`),
                element: <WishListDetails />,
            },
        ],
    },
    {
        path: "/dashboard",
        element: (
            <AdminRoute>
                <PrivateRouter>
                    <DashBoardLayout />
                </PrivateRouter>
            </AdminRoute>
        ),
        children: [
            {
                path: "/dashboard",
                element: (
                    <AdminRoute>
                        <PrivateRouter>
                            {" "}
                            <AllUsers />
                        </PrivateRouter>
                    </AdminRoute>
                ),
            },
            {
                path: "/dashboard/listing",
                element: (
                    <AdminRoute>
                        <PrivateRouter>
                            <Listing />
                        </PrivateRouter>
                    </AdminRoute>
                ),
            },
            {
                path: "/dashboard/customize",
                element: (
                    <AdminRoute>
                        <PrivateRouter>
                            {" "}
                            <CustomizeContent />
                        </PrivateRouter>
                    </AdminRoute>
                ),
            },
            {
                path: "/dashboard/subletList",
                element: (
                    <AdminRoute>
                        <PrivateRouter>
                            {" "}
                            <SubletList />
                        </PrivateRouter>
                    </AdminRoute>
                ),
            },
            {
                path: "/dashboard/rommateList",
                element: (
                    <AdminRoute>
                        <PrivateRouter>
                            <RommateList />
                        </PrivateRouter>
                    </AdminRoute>
                ),
            },
            {
                path: "/dashboard/reportList",
                element: (
                    <AdminRoute>
                        <PrivateRouter>
                            <ReportListing />
                        </PrivateRouter>
                    </AdminRoute>
                ),
            },
            {
                path: "/dashboard/logoChange",
                element: (
                    <AdminRoute>
                        <PrivateRouter>
                            <Logoupdate />
                        </PrivateRouter>
                    </AdminRoute>
                ),
            },
        ],
    },
]);
