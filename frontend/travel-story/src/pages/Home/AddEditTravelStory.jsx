/* eslint-disable react/prop-types */
import {MdAdd, MdClose, MdDeleteOutline, MdUpdate} from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import {useState} from "react";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import moment from "moment";

import uploadImage from "../../utils/uploadImage";

import axiosInstance from "../../utils/axiosInstance";
import {toast} from "react-toastify";

const AddEditTravelStory = ({storyInfo, type, onClose, getAllTravelStories}) => {
  const [title, setTitle] = useState("");
  const [storyImg, setStoryImg] = useState(null);
  const [visitedLocation, setVisitedLocation] = useState([]);
  const [story, setStory] = useState("");
  const [visitedDate, setVisitedDate] = useState(null);
  const [error, setError] = useState("");

  const addTravelStory = async () => {
    try {
      let imageUrl = "";
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);

        imageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        visitedLocation,
        visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
        imageUrl: imageUrl || "",
      });

      if (response.data.data && response.data.data.travelStory) {
        toast.success("Story added successfully!");
        getAllTravelStories();
        console.log("onclose FUNCTION :", onClose());
        onClose();
      }
    } catch (error) {
      console.error(
        `An unexpected error occurred while ${type} story. Please try again!`,
        error.message
      );
    }
  };

  const updateTravelStory = async () => {};

  const handleAddOrUpdateClick = () => {
    if (!title) return setError("Please enter the title");
    if (!story) return setError("Please enter the story");

    setError("");

    if (type === "edit") {
      updateTravelStory();
    } else {
      addTravelStory();
    }
  };

  const handleDeleteStoryImg = () => {};

  return (
    <div>
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>

        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            {type === "add" ? (
              <button className="btn-small" onClick={handleAddOrUpdateClick}>
                <MdAdd className="text-lg" /> ADD STORY
              </button>
            ) : (
              <>
                <button className="btn-small" onClick={handleAddOrUpdateClick}>
                  <MdUpdate className="text-lg" /> UPDATE STORY
                </button>

                <button className="btn-small btn-delete" onClick={onClose}>
                  <MdDeleteOutline className="text-lg" /> Delete
                </button>
              </>
            )}

            <button className="" onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>

      <div>
        <div className="flex flex-1 flex-col gap-2 pt-4">
          <label className="input-label">TITLE</label>
          <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="A Day at the Great Wall"
            value={title}
            onChange={({target}) => setTitle(target.value)}
          />

          <div className="my-3">
            <DateSelector date={visitedDate} setDate={setVisitedDate} />
          </div>

          <ImageSelector
            image={storyImg}
            setImage={setStoryImg}
            handleDeleteImage={handleDeleteStoryImg}
          />

          <div className="flex flex-col gap-2 mt-4">
            <label className="input-label">STORY</label>
            <textarea
              type="text"
              className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
              placeholder="Your Story"
              rows={10}
              value={story}
              onChange={({target}) => setStory(target.value)}
            />
          </div>

          <div className="pt-3">
            <label className="input-label">VISITED LOCATIONS</label>
            <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;
