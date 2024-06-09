import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../../Provider/AuthProvider";

const PrivateRouter = ({ children }) => {
    const { auths,loading } = useContext(AuthContext);
    const user = auths?.user;
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";


    if (user && !loading) {
        return children;
    }
    return <Navigate to="/login" state={from} replace></Navigate>
};

export default PrivateRouter;