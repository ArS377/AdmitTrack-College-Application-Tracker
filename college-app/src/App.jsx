import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing.jsx";
import { RegisterUser } from "./pages/RegisterUser.jsx";
import { GLogin } from "./pages/GLogin.jsx";
import { Home } from "./pages/home.jsx";
import { MyColleges } from "./pages/mycolleges.jsx";
import { Profile } from "./pages/profile.jsx";
import NavBar from "./components/NavBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/reset-password" element={<RegisterUser />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/mycolleges" element={<MyColleges />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/login" element={<GLogin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
