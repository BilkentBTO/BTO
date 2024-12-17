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
    <header className="headerGlobal">
      <div className="headerGlobalContainer">
        <div className="headerGlobalText">
          <button className="bilkentButton" onClick={handleBilkentClick}>
            <img src={bilkentLogo} alt="Bilkent Logo" className="bilkentLogo" />
          </button>
          <div>
            <h1>Bilkent University</h1>
            <h2>Information Office</h2>
          </div>
        </div>
        <h1 className="headerGlobalTitle">{name}</h1>
      </div>
    </header>
  );
}
export default HeaderGlobal;
