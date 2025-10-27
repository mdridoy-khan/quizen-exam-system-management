import { FaArrowDownLong } from "react-icons/fa6";
import One from "../../assets/images/shape-arrow/1.png";
import Two from "../../assets/images/shape-arrow/2.png";
import Three from "../../assets/images/shape-arrow/3.png";
import Four from "../../assets/images/shape-arrow/4.png";
import LeftArrow from "../../assets/images/shape-arrow/left.png";
import RightArrow from "../../assets/images/shape-arrow/right.png";

const HowItWorks = () => {
  return (
    <section className="max-w-md mx-auto px-4 py-8 lg:py-20">
      <div className="text-center xl:mb-12 relative">
        <h2 className="text-xl md:text-2xl xl:text-4xl font-semibold text-black600 mb-1">
          How it Works
        </h2>
        <p className="text-base font-semibold text-black600">
          lorem ipsume this is main sub heading
        </p>
        <img
          src={LeftArrow}
          alt="LeftArrow image"
          className="absolute max-w-28 top-8 -left-16 hidden md:block"
        />
      </div>
      <div className="space-y-4">
        <div className="bg-white shadow-[0_4px_30px_rgba(0,0,0,0.09)] rounded-xl flex items-center gap-2 text-lg font-semibold py-4 px-8 relative">
          <img src={One} alt="Number" className="max-w-6" />
          Sign Up / Login
          <img
            src={RightArrow}
            alt="RightArrow image"
            className="absolute max-w-28 top-4 -right-20 hidden md:block"
          />
        </div>
        <div className="flex items-center justify-center md:hidden">
          <FaArrowDownLong size={20} />
        </div>
        <div className="bg-white shadow-[0_4px_30px_rgba(0,0,0,0.09)] rounded-xl flex items-center gap-2 text-lg font-semibold py-4 px-8 relative">
          <img src={Two} alt="Number" className="max-w-6" />
          Announcement Registration
          <img
            src={LeftArrow}
            alt="LeftArrow image"
            className="absolute max-w-28 top-4 -left-20 hidden md:block"
          />
        </div>
        <div className="flex items-center justify-center md:hidden">
          <FaArrowDownLong size={20} />
        </div>
        <div className="bg-white shadow-[0_4px_30px_rgba(0,0,0,0.09)] rounded-xl flex items-center gap-2 text-lg font-semibold py-4 px-8 relative">
          <img src={Three} alt="Number" className="max-w-6" />
          Participant in Quiz
          <img
            src={RightArrow}
            alt="RightArrow image"
            className="absolute max-w-28 top-4 -right-20 hidden md:block"
          />
        </div>
        <div className="flex items-center justify-center md:hidden">
          <FaArrowDownLong size={20} />
        </div>
        <div className="bg-white shadow-[0_4px_30px_rgba(0,0,0,0.09)] rounded-xl flex items-center gap-2 text-lg font-semibold py-4 px-8">
          <img src={Four} alt="Number" className="max-w-6" />
          View Results
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;
