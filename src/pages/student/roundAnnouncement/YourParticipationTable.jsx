import { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import API from "../../../api/API";
import { formatDateTime } from "../../../utils/FormateDateTime";

const YourParticipationTable = () => {
  const [quizQuestionList, setQuizQuestionList] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const limit = 5; // per-page limit
  const totalPages = Math.ceil(count / limit);

  const fetchQuizList = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const offset = (page - 1) * limit;
      const response = await API.get(
        `/qzz/view-own-participation-list/?limit=${limit}&offset=${offset}`
      );

      if (response?.data?.results?.participation_data) {
        setQuizQuestionList(response.data.results.participation_data);
        setCount(response.data.count || 0);
      } else {
        setQuizQuestionList([]);
        setCount(0);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Something went wrong while fetching participation data."
      );
      setQuizQuestionList([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizList(currentPage);
  }, [currentPage]);

  // Filter logic
  const filteredList = Array.isArray(quizQuestionList)
    ? quizQuestionList.filter((item) => {
        if (!searchTerm.trim()) return true;
        const lowerSearch = searchTerm.toLowerCase();
        return (
          item.announcement_name.toLowerCase().includes(lowerSearch) ||
          item.round_name.toLowerCase().includes(lowerSearch)
        );
      })
    : [];

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="w-full">
      {/* Search */}
      <div className="flex justify-center md:justify-end mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search announcements or rounds..."
          className="border border-primary rounded-lg py-1 px-2 shadow-none outline-none appearance-none bg-transparent focus:border-primary"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 text-red-600 text-sm font-semibold bg-red-50 px-4 py-2 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm sm:text-base border-collapse">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-left text-gray-700">
            <tr>
              <th className="px-4 py-3 border">SL</th>
              <th className="px-4 py-3 border">Announcement</th>
              <th className="px-4 py-3 border">Round</th>
              <th className="px-4 py-3 border">Position</th>
              <th className="px-4 py-3 border">Participants</th>
              <th className="px-4 py-3 border">Time</th>
              <th className="px-4 py-3 border">Completed</th>
              <th className="px-4 py-3 border">Marks</th>
              <th className="px-4 py-3 border text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : filteredList.length > 0 ? (
              filteredList.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="px-4 py-2 border text-center">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="px-4 py-2 border font-medium text-gray-800">
                    {item.announcement_name}
                  </td>
                  <td className="px-4 py-2 border">{item.round_name}</td>
                  <td className="px-4 py-2 border text-center">
                    {item.your_position}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {item.total_participants}
                  </td>
                  <td className="px-4 py-2 border">{item.completed_time}</td>
                  <td className="px-4 py-2 border">
                    {formatDateTime(item.completed_at)}
                  </td>
                  <td className="px-4 py-2 border text-center font-semibold">
                    {item.marks_obtained}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <Link
                      to={`/quiz-answer/${item.round_id}`}
                      state={{ Id: item.round_id }}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all"
                    >
                      <AiOutlineEye size={20} />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!searchTerm && totalPages > 1 && (
        <div className="flex justify-end items-center mt-6 gap-2 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white border hover:bg-gray-100"
            }`}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                  currentPage === pageNum
                    ? "bg-primary text-white shadow-md scale-105"
                    : "bg-white border text-gray-600 hover:bg-blue-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-primary border text-white hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default YourParticipationTable;
