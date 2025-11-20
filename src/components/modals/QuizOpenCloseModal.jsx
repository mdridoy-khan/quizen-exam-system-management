import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import API from "../../api/API";

const QuizOpenCloseModal = ({
  isOpen,
  onClose,
  message,
  onConfirm,
  endpoint,
  id,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await API.post(endpoint);
      console.log(`API response for ${endpoint}:`, response);
      toast.success(
        message.includes("open")
          ? "Announcement opened successfully"
          : "Announcement closed successfully"
      );
      onConfirm();
      onClose();
    } catch (err) {
      console.error(`Error calling ${endpoint}:`, err);
      toast.error("Something went wrong while updating status!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative mx-2">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <AiOutlineClose size={20} />
        </button>
        {/* Modal Content */}
        <h3 className="text-lg text-center font-semibold text-gray-800 mb-4">
          {message}
        </h3>
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            }`}
          >
            {isLoading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizOpenCloseModal;
