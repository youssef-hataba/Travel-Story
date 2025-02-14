import {useNavigate} from "react-router-dom";
import Navbar from "../../components/Navbar";
import {useEffect, useState} from "react";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState();
  const [allStories, setAllStories] = useState([]);

  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data.data && response.data.data.travelStories) {
        setAllStories(response.data.data.travelStories);
      }
    } catch (error) {
      console.error(
        "An unexpected error occured while set Stories. Please try again!",
        error.message
      );
    }
  };

  const handleEdit = async () => {}

  const handleViewStory = async() => {};

  const updateIsFavourite = async (story) => {};

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/get-user");
        if (response.data && response.data.user) {
          setUserInfo(response.data.user);
        }
      } catch (error) {
        if (error.response.status === 401) {
          // clear storage if unauthorized
          localStorage.clear();
          navigate("/login");
        }
      }
    };

    getUserInfo();
    getAllTravelStories();
  }, [navigate]);

  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item._id}
                      Story={item}
                      onEdit={() => handleEdit(item)}
                      onClick={() => handleViewStory(item)}
                      onFavoriteClick={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-lg font-semibold">No travel stories found yet.</p>
            )}
          </div>

          <div className="w-[320px]"></div>
        </div>
      </div>
    </>
  );
};

export default Home;
