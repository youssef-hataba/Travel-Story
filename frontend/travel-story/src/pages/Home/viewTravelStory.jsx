import moment from "moment";
import {GrMapLocation} from "react-icons/gr";
import {MdClose, MdDeleteOutline, MdUpdate} from "react-icons/md";

const viewTravelStory = ({onClose, onEdit, onDelete, storyInfo}) => {
  return (
    <div className="relative">
      <div className="flex items-center justify-end">
        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg ">
            <button className="btn-small cursor-pointer" onClick={onEdit}>
              <MdUpdate className="texl-lg" /> Update Stroy
            </button>

            <button className="btn-small btn-delete cursor-pointer" onClick={onDelete}>
              <MdDeleteOutline className="text-lg" /> Delete
            </button>

            <button className="cursor-pointer" onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-1 flex-col gap-2 py-4">
          <h1 className="text-2xl text-slate-950">{storyInfo?.title}</h1>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {storyInfo && moment(storyInfo.visitedDate).format("Dddd MM YYYY")}
            </span>

            <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-1">
              <GrMapLocation className="text-sm" />
              {storyInfo?.visitedLocation?.map((item, index) =>
                storyInfo.visitedLocation.length === index + 1 ? `${item}` : `${item}, `
              )}
            </div>
          </div>
        </div>

        <img
          src={storyInfo?.imageUrl}
          alt={`${storyInfo?.title} Image`}
          className="w-full h-[300px] object-cover rounded-lg"
        />

        <div className="mt-4">
          <p className="text-sm leading-6 text-justify whitespace-pre-line text-slate-800">{storyInfo?.story}</p>
        </div>
      </div>
    </div>
  );
};

export default viewTravelStory;
