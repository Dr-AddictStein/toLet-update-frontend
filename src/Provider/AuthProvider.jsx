import { message } from "antd";
import axios from "axios";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { app } from "../firebase/firebase.config";

export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const FBprovider = new FacebookAuthProvider();

const AuthProvider = ({ children }) => {
  const [auths, setAuths] = useState({ status: null, user: null });
  const [loading, setLoading] = useState(true);
  

  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider).finally(() =>
      setLoading(false)
    );
  };

  const facebookSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, FBprovider).finally(() => setLoading(false));
  };
  
  const verifyToken = async () => {
    try {
      const token = localStorage.getItem("access-token");
      if (token) {
        const response = await axios.get("http://localhost:5000/verifyToken", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response) {
          console.log("Responseeee",response)
          setAuths({ status: "manual", user: response.data.user });
          
        }
      }
    } catch (error) {
      console.error("Error verifying token:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const logOut = () => {
    setLoading(true);
    signOut(auth)
      .then(() => {
        localStorage.removeItem("access-token");
        setAuths({ status: null, user: null });
      })
      .catch((error) => console.error("Sign out error:", error))
      .finally(() => setLoading(false));
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      
      const { token,user } = response.data;
      localStorage.setItem("access-token", token);
      setAuths({ status: "manual", user });
      message.success("Login successful");
    } catch (error) {
      console.error("Login failed:", error.message);
      message.error("Invalid Email and Password")
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/user/${email}`);
      const userData = response.data.user;

      setAuths({ status: "firebase", user: userData });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Check if the user was authenticated using Firebase providers
        if (
          currentUser.providerData &&
          currentUser.providerData.length > 0 &&
          (currentUser.providerData[0].providerId === "google.com" ||
            currentUser.providerData[0].providerId === "facebook.com")
        ) {
          const { email } = currentUser;
          fetchUserData(email);
        } else {
          console.log("sdfjsd",currentUser)
          setAuths({ status: "manual", user: currentUser });
        }
      }
    });
    return () => unsubscribe();
  }, []);
  
  const authInfo = {
    login,
    auths,
    setAuths,
    loading,
    logOut,
    googleSignIn,
    facebookSignIn,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
