/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";


const AdminRoute = ({ children }) => {
    const { auths, loading } = useContext(AuthContext);
    const user = auths?.user;
    const adminEmail = "codingjedi048@gmail.com"; 
    const location = useLocation();

    if (loading) {
        return <p>Loading.........</p>;
    }

    if (user && user.role === "admin") {
        return children;
    }

    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AdminRoute;
