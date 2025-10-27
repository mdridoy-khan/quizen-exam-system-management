import { IoMdClose } from "react-icons/io";
import ModalIcon from "../../../assets/icons/smile.png";

const ParticipateModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-5 px-4">
      <div className="bg-[#FFFDF4] rounded-lg shadow-lg p-4 lg:p-6 w-[600px]">
        <div className="flex justify-end mb-2">
          <button onClick={onCancel}>
            <IoMdClose size={20} />
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="flex items-start">
            <img src={ModalIcon} alt="congratulation icon" width={50} />
          </div>

          <div className="flex-1">
            <h3 className="text-xl xl:text-2xl font-semibold text-black600 mb-1">
              Are you sure you want to participate in this quiz?
            </h3>
            <p className="text-gray500 text-base">
              By participating, you agree to follow the quiz rules and
              guidelines.
            </p>
            {/* <p className="text-gray500 text-base mt-3 flex items-center gap-1">
              More{" "}
              <Link className="text-black600 font-medium transition hover:text-primary">
                T&C
              </Link>
            </p> */}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onConfirm}
            className="w-1/2 bg-gradient-to-r from-gradientEnd to-gradientStart text-white py-2 px-4 rounded font-semibold transition hover:opacity-90"
          >
            Participate Now
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-primary text-white py-2 px-4 rounded font-semibold transition hover:opacity-90"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipateModal;
