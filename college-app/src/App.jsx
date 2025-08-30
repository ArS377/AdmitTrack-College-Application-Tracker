import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing.jsx";
import { RegisterUser } from "./pages/RegisterUser.jsx";
import { GLogin } from "./pages/GLogin.jsx";
import { Home } from "./pages/home.jsx";
import { AddCollege } from "./pages/AddCollege.jsx";
import { Profile } from "./pages/profile.jsx";
import { MyCollegeInfo } from "./pages/MyCollegeInfo.jsx";
import NavBar from "./components/NavBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Research from "./pages/Research.jsx";
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
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/addcollege" element={<AddCollege />} />
            <Route path="/research" element={<Research />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/collegeinfo" element={<MyCollegeInfo />} />
          </Route>
          <Route path="/login" element={<GLogin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
