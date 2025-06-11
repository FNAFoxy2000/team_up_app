import './DiscordBoton.css';
import { FaDiscord } from 'react-icons/fa';

const BotonDiscord = ({ onClick }) => {
  return (
    <>
      {/* From Uiverse.io by MrD4rio */}
      <button className="discord" onClick={onClick}>
        <div className="svg-wrapper-1">
          <div className="svg-wrapper">
            <FaDiscord className="icon" />
          </div>
        </div>
        <span>Discord</span>
      </button>
    </>
  );
};

export default BotonDiscord;
