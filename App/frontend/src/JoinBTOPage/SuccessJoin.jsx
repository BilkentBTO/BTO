import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import "./SuccessJoin.css";

function SuccessJoin() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData || {};

  useEffect(() => {
    document.title = "Registration Success - BTO";
    if (!formData.name) {
      navigate("/"); // Redirect if formData is missing
    }
  }, [formData, navigate]);

  return (
    <div className="successJoinPage">
      <HeaderGlobal name={"Registration Successful!"} />
      <div className="successMessage">
        <h2>Welcome to BTO, {formData.name}!</h2>
        <p>Your registration is complete.</p>
        <p>Email: {formData.mail}</p>
        <p>Bilkent ID: {formData.bilkentID}</p>
        <button onClick={() => navigate("/")} className="returnButton">
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default SuccessJoin;
