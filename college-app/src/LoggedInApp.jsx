import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { First } from "./pages/first.jsx";
import { Home } from "./pages/home.jsx";
import { MyColleges } from "./pages/mycolleges.jsx";
import { Profile } from "./pages/profile.jsx";
import NavBar from "./components/NavBar.jsx";
import App from "./App.jsx";

function LoggedInApp() {
  return (
    <>
      <HashRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/mycolleges" element={<MyColleges />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default LoggedInApp;
