import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { formatDateTime } from "../../../utils/FormateDateTime";

ChartJS.register(ArcElement, Tooltip, Legend);

const QuizResultCard = ({
  examDate,
  totalQuestions,
  correct,
  wrong,
  quizId,
  skipped,
  totalMarks,
  positiveMarks,
  negativeMarks,
  yourMarks,
  totalTime,
  onClose,
  onDashboard,
}) => {
  const data = {
    datasets: [
      {
        data: [correct, wrong, skipped],
        backgroundColor: ["#6B46C1", "#F6AD55", "#E53E3E"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
    labels: ["Correct", "Wrong", "Skipped"],
  };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-700">
          Quiz Results Card
        </h2>
        <p className="text-sm text-gray-500">
          Exam Date: {formatDateTime(examDate)}
        </p>
        <div className="relative mt-4">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-800 font-bold text-lg">
            <span>{totalQuestions}</span>
            Questions
          </div>
        </div>
        <div className="flex justify-around mt-4 text-sm">
          <span className="flex items-center text-sm font-medium">
            <span className="w-3 h-3 bg-purple-700 rounded-full mr-1"></span>{" "}
            Correct - {correct}
          </span>
          <span className="flex items-center text-sm font-medium">
            <span className="w-3 h-3 bg-orange-500 rounded-full mr-1"></span>{" "}
            Wrong - {wrong}
          </span>
          <span className="flex items-center text-sm font-medium">
            <span className="w-3 h-3 bg-red-600 rounded-full mr-1"></span>{" "}
            Skipped - {skipped}
          </span>
        </div>
        <div className="mt-6 space-y-2">
          <p className="text-sm">
            Total Marks <span className="float-right">{totalMarks}</span>
          </p>
          <p className="text-sm">
            Your Positive Marks{" "}
            <span className="float-right">{positiveMarks}</span>
          </p>
          <p className="text-sm">
            Your Negative Marks{" "}
            <span className="float-right text-red-600">{negativeMarks}</span>
          </p>
          <p className="text-sm font-semibold border-t pt-2">
            Your Marks <span className="float-right">{yourMarks}</span>
          </p>
          <p className="text-sm">
            Total Time <span className="float-right">{totalTime}</span>
          </p>
        </div>
        <div className="mt-6 flex justify-between">
          <Link
            to={`/student/announcement-round/${quizId}`}
            className="px-4 py-2 text-gray-600 border rounded-lg transition hover:bg-red-500 hover:text-white"
            onClick={onClose}
          >
            Close
          </Link>
          <Link
            to="/student/dashboard"
            className="px-4 py-2 bg-purple-700 text-white rounded-lg"
            onClick={onDashboard}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizResultCard;
