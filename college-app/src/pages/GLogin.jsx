import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { setUser } from "../User";

export function GLogin() {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  return (
    <>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          const decoded = jwtDecode(credentialResponse.credential);
          const name = decoded.name;
          const email = decoded.email;

          setUser({ name, email });

          await fetch(`${apiUrl}/users`, {
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
