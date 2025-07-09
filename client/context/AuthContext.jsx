import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // 👈


  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  
  
  // ✅ Connect to socket server
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    setSocket(newSocket);
    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  // ✅ Login
  const login = async (state, credentials) => {
  try {
    const { data } = await axios.post(`/api/auth/${state}`, credentials);

    if (data.success) {
      setAuthUser(data.userData);
      axios.defaults.headers.common["token"] = data.token;
      setToken(data.token);
      localStorage.setItem("token", data.token);
      connectSocket(data.userData);
      toast.success(data.message);

      if (state === "signup") {
        toast.success("Now login to continue.");
        navigate("/login");
      } else {
        navigate("/profile");
      }
    }

    return data; // ✅ return the response so caller can check `data.success`
  } catch (error) {
    toast.error("Login failed");
    return { success: false, message: error.message }; // ✅ return something even on error
  }}

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    delete axios.defaults.headers.common["token"];
    socket?.disconnect();
    toast.success("Logged Out Successfully");
    navigate("/login");
  };

  // ✅ Update profile
  const updateProfile = async (body) => {
    try {
      const response = await axios.put("/api/auth/update-profile", body);
      if (response.data.success) {
        setAuthUser(response.data.user);
        toast.success("Profile Updated Successfully");
       
      }
      return response;
    } catch (err) {
      toast.error("Profile update failed");
      return { data: { success: false, message: err.message } };
    }
  };
  // ✅ Check if user is authenticated

  const checkAuth = async () => {
  try {
    const { data } = await axios.get("/api/auth/check");
    if (data.success) {
      setAuthUser(data.user);
      connectSocket(data.user);
    }
  } catch (error) {
    toast.error("Session expired. Please login again.");
  } finally {
    setLoading(false); // ✅ Done loading
  }
};

useEffect(() => {
  const init = async () => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      await checkAuth();
    } else {
      setLoading(false);
    }
  };
  init();
}, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    token,
    socket,
    loading,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAppContext = () => useContext(AuthContext);
