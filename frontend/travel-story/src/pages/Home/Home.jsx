import {useNavigate} from "react-router-dom";
import Navbar from "../../components/Navbar";
import {useEffect, useState} from "react";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import Modal from "react-modal";

import {ToastContainer, toast} from "react-toastify";

import {MdAdd} from "react-icons/md";
import AddEditTravelStory from "./AddEditTravelStory";

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState();
  const [allStories, setAllStories] = useState([]);

  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

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

  const handleEdit = async () => {};

  const handleViewStory = async () => {};

  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;

    try {
      const response = await axiosInstance.patch(`/update-is-favorite/${storyId}`, {
        isFavorite: !storyData.isFavorite,
      });

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully!");
        getAllTravelStories();
      }
    } catch (error) {
      console.error(
        "An unexpected error occured while updating favorite status. Please try again!",
        error.message
      );
    }
  };

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

      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box scrollbar">
        <AddEditTravelStory
          storyInfo={openAddEditModel.data}
          onClose={() => {
            setOpenAddEditModel({isShown: false, type: "add", data: null});
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary 
        hover:bg-cyan-400 fixed right-10 bottom-10 transition-all duration-300 group"
        onClick={() => setOpenAddEditModel({isShown: true, type: "add", data: null})}>
        <MdAdd className="text-[32px] text-white group-hover:scale-110 transition-all duration-300" />
      </button>

      <ToastContainer />
    </>
  );
};

export default Home;
