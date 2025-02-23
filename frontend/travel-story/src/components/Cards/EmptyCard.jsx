import {IoNewspaper} from "react-icons/io5";

const EmptyCard = ({message}) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="bg-cyan-100 p-4 rounded-full flex justify-center items-center">
        <IoNewspaper className="text-cyan-700" size={50} />
      </div>

      <p className="text-sm w-1/2 font-medium text-slate-700 text-center leading-7 mt-5">
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;
