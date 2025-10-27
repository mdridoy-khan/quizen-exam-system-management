import { LuMoveRight } from "react-icons/lu";

const HeaderTop = ({ onAnnouncementClick }) => {
  return (
    <div className="bg-[#E8DACD]">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-1 py-2 lg:py-3 text-[12px] md:text-sm lg:text-base xl:text-base 2xl:text-lg">
        {" "}
        <p>New Announcement has been just posted. To see details</p>{" "}
        <button
          onClick={onAnnouncementClick}
          className="text-primary font-semibold flex items-center gap-1"
        >
          click here <LuMoveRight />
        </button>{" "}
      </div>
    </div>
  );
};

export default HeaderTop;
