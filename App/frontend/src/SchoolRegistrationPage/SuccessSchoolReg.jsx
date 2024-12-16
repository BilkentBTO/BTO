import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SuccessSchoolReg() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const formData = location.state?.formData || {};
    console.log(formData); // Log the form data for processing
    navigate("/"); // Redirect to the homepage
  }, [location, navigate]);

  return null; 
}

export default SuccessSchoolReg;
