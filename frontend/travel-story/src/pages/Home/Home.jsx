import {useNavigate} from "react-router-dom";
import Navbar from "../../components/Navbar";
import {useEffect, useState} from "react";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import Modal from "react-modal";

import {ToastContainer, toast} from "react-toastify";

import {MdAdd} from "react-icons/md";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStroy from "./viewTravelStory";
import EmptyCard from "../../components/Cards/EmptyCard";

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState();
  const [allStories, setAllStories] = useState([]);

  const [filterType, setFilterType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModel, setOpenViewModel] = useState({
    isShown: false,
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

  const handleViewStory = async (data) => {
    setOpenViewModel({isShown: true, data});
  };

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

  const handleEdit = (data) => {
    setOpenAddEditModel({isShown: true, type: "edit", data: data});
  };

  const handleDeleteStory = async (data) => {
    const storyId = data._id;

    try {
      const response = await axiosInstance.delete(`/delete-story/${storyId}`);
      if (response.data && !response.data.error) {
        toast.error("Story Deleted Successfully!");
        getAllTravelStories();
        setOpenViewModel((prev) => ({...prev, isShown: false}));
      }
    } catch (error) {
      console.error(
        "An unexpected error occured while deleting story. Please try again!",
        error.message
      );
    }
  };

  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get('/search', {
        params: {
          query,
        },
      });

      console.log("resposne :",response);

      if (response.data && response.data.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.error(
        "An unexpected error occured while searching stories. Please try again!",
        error.message
      );
    }
  };

  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
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
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />
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
                      onClick={() => handleViewStory(item)}
                      onFavoriteClick={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center items-center w-screen">
                <EmptyCard
                  message={`Start creating your first Travel Story! Click the "Add" button to got down your thoughts, ideas and memories. let's get started!`}
                />
              </div>
            )}
          </div>

          <div className="w-[320px]"></div>
        </div>
      </div>

      {/* Add Travel Story Model */}
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
        className="model-box">
        <AddEditTravelStory
          type={openAddEditModel.type}
          storyInfo={openAddEditModel.data}
          onClose={() => {
            setOpenAddEditModel({isShown: false, type: "add", data: null});
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      {/* View Travel Story Model */}
      <Modal
        isOpen={openViewModel.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box">
        <ViewTravelStroy
          onClose={() => {
            setOpenViewModel((prev) => ({...prev, isShown: false}));
          }}
          onEdit={() => {
            setOpenViewModel((prev) => ({...prev, isShown: false}));
            handleEdit(openViewModel.data || null);
          }}
          onDelete={() => {
            handleDeleteStory(openViewModel.data || null);
          }}
          storyInfo={openViewModel.data}
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
