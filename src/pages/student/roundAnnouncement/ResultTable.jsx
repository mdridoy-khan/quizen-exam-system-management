import { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import API from "../../../api/API";
import { formatDateTime } from "../../../utils/FormateDateTime";

const ResultTable = ({ roundId, next_round_qualifier }) => {
  const [quizQuestionList, setQuizQuestionList] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const limit = 10;
  const totalPages = Math.ceil(count / limit);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    const fetchQuizList = async () => {
      try {
        setLoading(true);
        setError("");
        const offset = (currentPage - 1) * limit;
        const response = await API.get(
          `/qzz/round-participant-list/${roundId}/?limit=${limit}&offset=${offset}`
        );
        setQuizQuestionList(response.data.results || []);
        setCount(response.data.count || 0);
      } catch (err) {
        const apiError =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to fetch data.";
        setError(apiError);
        setQuizQuestionList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizList();
  }, [roundId, currentPage]);

  const filteredList = quizQuestionList.filter((item) => {
    if (!searchTerm.trim()) return true;
    const lowerSearch = searchTerm.toLowerCase();
    return (
      item.student_name.toLowerCase().includes(lowerSearch) ||
      item.student_gmail.toLowerCase().includes(lowerSearch) ||
      item.student_phone.includes(lowerSearch)
    );
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <button className="bg-yellow500 flex items-center gap-1 rounded-lg p-1 text-sm font-semibold text-black600 ">
          NEXT ROUND QUALIFY {next_round_qualifier} PARTICIPANT
        </button>
        <form>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="border border-gray-200 py-1 px-3 rounded-full outline-none shadow-none focus:border-blue-600"
          />
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="border border-gray-300 text-sm sm:text-base w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border">SL</th>
              <th className="px-4 py-2 border">Student Name</th>
              {/* <th className="px-4 py-2 border">Student Gmail</th> 
              <th className="px-4 py-2 border">Phone</th> */}
              <th className="px-4 py-2 border">Time</th>
              <th className="px-4 py-2 border">Participate Date</th>
              <th className="px-4 py-2 border">Marks</th>
              <th className="px-4 py-2 border">View</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-6">
                  <div className="flex justify-center items-center">
                    <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-4 text-red-500 font-medium"
                >
                  {error}
                </td>
              </tr>
            ) : filteredList.length > 0 ? (
              filteredList.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2 border text-center relative">
                    {(currentPage - 1) * limit + (index + 1)}
                    <div className="absolute top-0 right-0">
                      {item.you === true && (
                        <span className="text-white px-[2px] rounded bg-green-500 text-[10px] leading-none">
                          you
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 border">{item.student_name}</td>
                  {/* <td className="px-4 py-2 border">{item.student_gmail}</td>
                  <td className="px-4 py-2 border">{item.student_phone}</td> */}
                  <td className="px-4 py-2 border">{item.completed_time}</td>
                  <td className="px-4 py-2 border">
                    {formatDateTime(item.completed_at)}
                  </td>
                  <td className="px-4 py-2 border">{item.marks_obtained}</td>
                  <td className="px-4 py-2 border text-center">
                    <Link to={`/quiz-answer/${roundId}`}>
                      <AiOutlineEye
                        size={20}
                        className="text-blue-500 cursor-pointer"
                      />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-4 text-red-500 font-medium"
                >
                  No matching result found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!searchTerm && !loading && !error && (
        <div className="flex justify-end items-center mt-8 gap-2 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 rounded border ${
                  currentPage === pageNum
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultTable;
