import { useState } from "react";

export default function EditProfile(profile) {
  const [profileData, setProfileData] = useState(profile);
  useEffect(() => {
    setProfileData(profile);
  }, [profile]);

  const handleSubmit = async (e) => {
    try {
      const response = await axios.post(`${apiUrl}/profile`, profileData, {
        headers: { "Content-Type": "application/json" },
      });
      setAlertState(true);
      if (response && response.status === 200) {
        console.log("Profile data updated successfully:", response.data);
        setStatus((prevStatus) => ({
          ...prevStatus, // Keep existing properties (like confirmationMessage)
          color: "success", // Set the color property to the string "success"
          confirmationMessage: "Profile updated successfully!",
        }));
      } else {
        console.error("Failed to update profile:", response.data);
        setStatus((prevStatus) => ({
          ...prevStatus, // Keep existing properties (like confirmationMessage)
          color: "danger", // Set the color property to the string "success"
          confirmationMessage: "Failed to update profile",
        }));
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      setStatus((prevStatus) => ({
        ...prevStatus, // Keep existing properties (like confirmationMessage)
        color: "danger", // Set the color property to the string "success"
        confirmationMessage: "Failed to update profile",
      }));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="update">
        <h3 className="label">Enter your primary choice of major.</h3>
        <div className="custom-field one">
          <input
            type="text"
            value={profileData.firstMajor ?? ""}
            onChange={(e) =>
              setProfileData({ ...profileData, firstMajor: e.target.value })
            }
            placeholder="e.g., Computer Science"
          />
        </div>

        <h3 className="label">Enter your secondary choice of major.</h3>
        <div className="custom-field one">
          <input
            type="text"
            value={profileData.secondMajor ?? ""}
            onChange={(e) =>
              setProfileData({ ...profileData, secondMajor: e.target.value })
            }
            placeholder="e.g., Math"
          />
        </div>
      </form>
    </div>
  );
}
