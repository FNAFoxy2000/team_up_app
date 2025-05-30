import './GoogleBoton.css';
import {FaGoogle } from 'react-icons/fa';


const BotonGoogle = ({ onClick }) => {
  return (
    <>
      {/* credits to uiverse.io/profile/eirikvold */}
      <button className="google" onClick={onClick}>
        <div className="svg-wrapper-1">
          <div className="svg-wrapper">
            <FaGoogle className="icon"/>
          </div>
        </div>
        <span>Google</span>
      </button>
    </>
  );
};

export default BotonGoogle;
