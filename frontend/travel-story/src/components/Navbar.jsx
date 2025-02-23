import {useNavigate} from "react-router-dom";
import LOGO from "../assets/images/logo3.png";
import ProfileInfo from "./Cards/ProfileInfo";
import SearchBar from "./Input/SearchBar";

/* eslint-disable react/prop-types */
const Navbar = ({userInfo,searchQuery,setSearchQuery,onSearchNote,handleClearSearch}) => {
  const navigate = useNavigate();

  const isToken = localStorage.getItem("token");

  const onLogOut = () => {
    localStorage.clear();

    navigate("/login");
  };

  const handleSearch = () => {
    if(searchQuery) onSearchNote(searchQuery)
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <img src={LOGO} alt="travel story" className="w-22" />

      {isToken && (
        <>
          <SearchBar
            value={searchQuery}
            onChange={({target}) => {
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
          <ProfileInfo userInfo={userInfo} onLogOut={onLogOut} />
        </>
      )}
    </div>
  );
};

export default Navbar;
