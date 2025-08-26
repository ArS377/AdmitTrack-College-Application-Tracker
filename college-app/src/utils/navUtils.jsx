import { useNavigate } from "react-router-dom";
export function goToCollegeInfo() {
  const navigate = useNavigate();
  navigate("/mycolleges");
}
