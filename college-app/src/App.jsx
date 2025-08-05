import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing.jsx";
import { RegisterUser } from "./pages/RegisterUser.jsx";
import { GLogin } from "./pages/GLogin.jsx";
import { Home } from "./pages/home.jsx";
import { MyColleges } from "./pages/mycolleges.jsx";
import { Profile } from "./pages/profile.jsx";
import { CollegeInfo } from "./pages/CollegeInfo.jsx";
import NavBar from "./components/NavBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";
import "./utils/axiosConfig.js"; // Import axios configuration

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/mycolleges" element={<MyColleges />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/collegeinfo" element={<CollegeInfo />} />
          </Route>
          <Route path="/login" element={<GLogin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
