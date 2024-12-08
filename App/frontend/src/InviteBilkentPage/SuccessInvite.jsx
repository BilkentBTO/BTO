import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SuccessInvite() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const formData = location.state?.formData || {};
    console.log("Invite", formData); // Log the form data for processing
    navigate("/"); // Redirect to the homepage
  }, [location, navigate]);

  return null; // Render nothing
}

export default SuccessInvite;
