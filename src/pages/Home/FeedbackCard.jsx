import FeedbackImage from "../../assets/images/winner3.png";
const FeedbackCard = ({ title, designation, review, description }) => {
  return (
    <div className="bg-white rounded-lg p-4 lg:p-6 2xl:p-8">
      <div className="flex gap-3">
        <div className="w-[50px] lg:w-[60px] 2xl:w-[70px]">
          <img src={FeedbackImage} alt="feedback image" className="w-full" />
        </div>
        <div className="flex-1">
          <h3 className="text-base xl:text-lg 2xl:text-xl font-semibold text-black600">
            {title}
          </h3>
          <span className="text-sm lg:text-base font-medium text-gray500 block">
            {designation}
          </span>
          <span className="text-white inline-block bg-primary py-0 px-3 rounded-full text-sm">
            {review}
          </span>
          <p className="text-sm text-gray500 mt-2 lg:mt-4 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
export default FeedbackCard;
