/* eslint-disable react/prop-types */
import moment from "moment/moment";
import {FaHeart} from "react-icons/fa6";
import {GrMapLocation} from "react-icons/gr";

const TravelStoryCard = ({Story, onFavoriteClick, onClick, onEdit}) => {
  return (
    <div
      className="border rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 
    transition-all ease-in-out relative cursor-pointer">
      <img
        src={Story.imageUrl}
        alt={Story.title}
        className="w-full h-56 object-cover rounded-t-lg"
        onClick={onClick}
      />

      <button
        className="w-12 h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute 
      top-4 right-4"
        onClick={onFavoriteClick}>
        <FaHeart
          className={`icon-btn hover:text-red-600 ${
            Story.isFavorite ? "text-red-600" : "text-white"
          }`}
        />
      </button>

      <div className="p-4" onClick={onClick}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h6 className="text-sm font-medium">{Story.title}</h6>
            <span className="text-xs text-slate-500">
              {Story.visitedDate ? moment(Story.visitedDate).format("Do MM YYYY") : "-"}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-2">{Story.story?.slice(0, 60)}</p>

        <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
          <GrMapLocation className="text-sm" />
          {Story.visitedLocation.map((item, index) =>
            Story.visitedLocation.length === index + 1 ? item : `${item}, `
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelStoryCard;
