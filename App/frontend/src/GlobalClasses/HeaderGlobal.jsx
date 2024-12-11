import bilkentLogo from "../assets/bilkent_logo.png";
import "./HeaderGlobal.css";
import { useNavigate } from "react-router-dom";

function HeaderGlobal({ name }) {
  const navigate = useNavigate();
  const handleBilkentClick = () => {
    console.log("Bilkent button clicked!");
    navigate("/"); // Navigate to the root page
  };
  return (
    <header className="header">
      <div className="container">
        <div className="headerText">
          <button className="bilkentButton" onClick={handleBilkentClick}>
            <img src={bilkentLogo} alt="Bilkent Logo" className="logo" />
          </button>
          <div>
            <h1>Bilkent University</h1>
            <h2>Promotion Office</h2>
          </div>
        </div>
        <div className="title">
          <h1>{name}</h1>
        </div>
      </div>
    </header>
  );
}
export default HeaderGlobal;
