import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { setUser } from "../User";

export function Login() {
  const navigate = useNavigate();
  return (
    <>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          const decoded = jwtDecode(credentialResponse.credential);
          const name = decoded.name;
          const email = decoded.email;

          setUser({ name, email });

          await fetch("http://localhost:3000/api/save-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email }),
          });

          navigate("/home");
        }}
        onError={() => console.log("Login failed")}
      />
    </>
  );
}
