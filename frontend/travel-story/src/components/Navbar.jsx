import {useNavigate} from "react-router-dom";
import LOGO from "../assets/images/logo3.png";
import ProfileInfo from "./Cards/ProfileInfo";
/* eslint-disable react/prop-types */
const Navbar = ({userInfo}) => {
  const navigate = useNavigate();

  const isToken = localStorage.getItem("token");

  const onLogOut = () => {
    localStorage.clear();

    navigate("/login");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <img src={LOGO} alt="travel story" className="w-22" />

      {isToken && <ProfileInfo userInfo={userInfo} onLogOut={onLogOut} />}
    </div>
  );
};

export default Navbar;
