const Alert = ({ confirmationMessage, status }) => {
  return (
    <div className={`alert alert-${status}`} role="alert">
      {confirmationMessage
        ? confirmationMessage
        : "Profile updated successfully!"}
    </div>
  );
};

export default Alert;
