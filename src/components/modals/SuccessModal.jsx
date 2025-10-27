import { IoMdClose } from "react-icons/io";
import Congrass from "../../assets/icons/congrass.png";
const SuccessModal = () => {
  return (
    <div className="bg-[var(--white)] shadow rounded-xl max-w-[500px] p-4">
      <div className="flex justify-end">
        <button>
          <IoMdClose size={20} />
        </button>
      </div>
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <div className="w-24 h-24 bg-[var(yellow300)] flex items-center justify-center rounded-full">
            <img src={Congrass} alt="congratulation icon0" width={50} />
          </div>
        </div>
        <h3 className="text-[var(--black600)] text-2xl font-semibold">
          Your Registration Successful!
        </h3>
        <div>
          <button className="text-white bg-[var(--black600)] py-2 px-6 text-base font-semibold rounded-lg">
            Thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
export default SuccessModal;
