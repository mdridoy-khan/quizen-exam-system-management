import { useCallback, useEffect, useState } from "react";
import { FaExclamationCircle, FaRegEye } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { TbExclamationCircle } from "react-icons/tb";
import { Link, useParams } from "react-router-dom";
import API from "../../api/API";
import QuizQuestionInterface from "../../components/QuizQuestionInterface";

const SharedQuestionsPresident = () => {
  const [tutorQuestions, setTutorQuestions] = useState([]);
  const [questionView, setQuestionView] = useState(false);
  const [selectedTutorData, setSelectedTutorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rounds, setRounds] = useState(null);
  const [showNotice, setShowNotice] = useState(true);
  const [tutorSelections, setTutorSelections] = useState({});
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    perPage: 10,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState(null);
  const { roundId, annId } = useParams();
  // New state for save confirmation modal
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [savePayload, setSavePayload] = useState(null); // Store payload for second API call
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch single round details
  useEffect(() => {
    const getRound = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get(
          `/anc/single-round-details-view/${roundId}/`
        );
        setRounds(response.data.data);
      } catch (err) {
        console.error("Failed to fetch round details:", err);
        setError("Failed to fetch round details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getRound();
  }, [roundId]);

  // Fetch shared question list
  const fetchTutorQuestions = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get(
          `/anc/shared-question-shared-info/${annId}?page=${page}`
        );
        const results = response?.data?.results?.tutor_details || [];
        const totalItems = response?.data?.count || results.length;

        setTutorQuestions(results);
        setPagination((prev) => ({
          ...prev,
          total: totalItems,
          current: page,
        }));
      } catch (err) {
        console.error("Failed to fetch tutors:", err);
        setError("Failed to fetch tutors. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [annId]
  );

  useEffect(() => {
    fetchTutorQuestions();
  }, [fetchTutorQuestions]);

  const handleQuestionView = async (tutorId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(
        `/anc/tutor-shared-anc-quiz-set/${tutorId}`
      );
      setSelectedTutorData(response.data);
      setQuestionView(true);
    } catch (err) {
      console.error("Failed to fetch tutor quiz:", err);
      setError("Failed to fetch tutor quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setQuestionView(false);
    setSelectedTutorData(null);
    fetchTutorQuestions(pagination.current);
  };

  const handleQuestionSelectChange = (tutorId, selectedQuestions) => {
    setTutorSelections((prev) => ({
      ...prev,
      [tutorId]: selectedQuestions,
    }));

    setTutorQuestions((prev) =>
      prev.map((tutor) =>
        tutor.id === tutorId
          ? { ...tutor, selected_qs_number: selectedQuestions.length }
          : tutor
      )
    );
  };

  const totalPages = Math.ceil(pagination.total / pagination.perPage);

  const totalSelected = tutorQuestions.reduce(
    (sum, tutor) => sum + (tutor.selected_qs_number || 0),
    0
  );

  const requiredQuestions = rounds?.total_questions || 0;
  const remainingQuestions = requiredQuestions - totalSelected;
  const showWarning = totalSelected > requiredQuestions;

  const handleOpenConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleMakeRestQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const selectedQuestionIds = Object.values(tutorSelections).flat();

      const formData = new FormData();
      formData.append("type", "mcq");
      formData.append(
        "num_questions",
        remainingQuestions > 0 ? remainingQuestions : 0
      );
      formData.append(
        "selected_question_ids",
        JSON.stringify(selectedQuestionIds)
      );

      const response = await API.post(
        `/anc/president-shared-json-response/${annId}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Make rest questions response:", response.data);
      // Store the payload for the save confirmation
      setSavePayload({
        type: "mcq",
        num_questions: remainingQuestions > 0 ? remainingQuestions : 0,
        selected_question_ids: selectedQuestionIds,
      });
      // Show save confirmation modal
      setShowSaveConfirmModal(true);
      handleCloseConfirmModal(); // Close the original confirmation modal
    } catch (error) {
      console.error("Failed to create final quiz questions:", error);
      setError("Failed to create final quiz questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuizQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("type", savePayload.type);
      formData.append("num_questions", savePayload.num_questions);
      formData.append(
        "selected_question_ids",
        JSON.stringify(savePayload.selected_question_ids)
      );

      const response = await API.post(
        `/qzz/pre/anc/${annId}/round/${roundId}/save-quiz/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Quiz questions saved successfully!");
        fetchTutorQuestions(pagination.current); // Refresh tutor questions
      } else {
        setError("Failed to save quiz questions. Unexpected response.");
      }
    } catch (error) {
      console.error("Failed to save quiz questions:", error);
      setError("Failed to save quiz questions. Please try again.");
    } finally {
      setLoading(false);
      setShowSaveConfirmModal(false); // Close save confirmation modal
      setSavePayload(null); // Clear payload
    }
  };

  const handleCloseSaveConfirmModal = () => {
    setShowSaveConfirmModal(false);
    setSavePayload(null); // Clear payload
  };

  // const handleMakeRestQuestions = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const selectedQuestionIds = Object.values(tutorSelections).flat();

  //     const formData = new FormData();
  //     formData.append("type", "mcq");
  //     formData.append(
  //       "num_questions",
  //       remainingQuestions > 0 ? remainingQuestions : 0
  //     );
  //     formData.append(
  //       "selected_question_ids",
  //       JSON.stringify(selectedQuestionIds)
  //     );

  //     const response = await API.post(
  //       `/anc/president-shared-json-response/${annId}/`,
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       }
  //     );

  //     console.log("Make rest questions response:", response.data);
  //     fetchTutorQuestions(pagination.current);
  //     handleCloseConfirmModal();
  //   } catch (error) {
  //     console.error("Failed to create final quiz questions:", error);
  //     setError("Failed to create final quiz questions. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {/* Error Alert */}
      {error && (
        <div className="bg-red100 border-l-4 border-red-500 rounded-xl p-4 mb-6 text-red-700">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold">
              <RxCross2 />
            </button>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black600 bg-opacity-30 z-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex flex-col sm:flex-row items-center justify-center flex-wrap gap-2 mb-4">
          <span>Quiz Maker That's</span>
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Delightfully Easy
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 128"
            className="w-16 h-16 xl:w-[100px] xl:h-[100px] animate-softBounce"
          >
            <path
              fill="#a1887f"
              d="M64 47.54s7.72.19 18.71-3.94 15.6-9.79 23.1-12.25 14.55-2.31 18.07 5.69.25 17.17-1.22 21.18-9.2 11.73-18.4 15.82c0 0-20.98 5.42-40.25 6.22V47.54zm0 0s-7.72.19-18.71-3.94-15.7-9.8-23.2-12.26-14.45-2.3-17.97 5.7-.25 17.16 1.22 21.17 9.2 11.73 18.4 15.82c0 0 20.98 5.42 40.25 6.22V47.54z"
            />
            <path
              fill="#8d6e63"
              d="M30.85 36.16s-11.19-5.3-14.94-1.34c-2.23 2.36-1.87 7.49 5.49 13.63zm66.47 0s11.19-5.3 14.94-1.34c2.23 2.36 1.87 7.49-5.49 13.63z"
            />
            <path
              fill="#fcc21b"
              d="M64 19.77c-60.16 0-61.59 67.44-61.59 80.79S29.99 124.73 64 124.73c34.02 0 61.59-10.82 61.59-24.17S124.17 19.77 64 19.77"
            />
            <path
              fill="#bcaaa4"
              d="M64 6.57c-4.11 0-4.52-3.3-8.94-3.3-5.4 0-21.43 15.61-22.73 18.12-1.04 2-3.89 8.94-4.25 10.59-.38 1.74-2.85 1.47-4.01.68 0 0 9.5 7.6 19.41 11.14C53.39 47.33 64 47.68 64 47.68zm0 0c4.11 0 4.52-3.3 8.94-3.3 5.4 0 21.36 15.65 22.73 18.12 1.41 2.54 4.15 8.94 4.58 10.77.41 1.74.51 2.29 1.68 1.49 0 0-7.5 6.6-17.41 10.14S64 47.68 64 47.68z"
            />
            <path
              fill="#ed6c30"
              d="M89.47 88.41c-1.06-2.07-3.7-3.88-7.25-3.79-3.73.1-9.11 1.55-12.68 2.06-1.82.25-3.7.37-5.5.42-1.81-.05-3.69-.16-5.52-.42-3.57-.51-8.95-1.96-12.68-2.06-3.55-.09-6.19 1.72-7.25 3.79-2.68 5.14 2.96 12.12 7.73 15.32 5.03 3.38 9.63 5.06 14.79 5.74 1.22.16 4.58.2 5.94-.02 5.52-.9 9.5-2.33 14.54-5.72 4.76-3.2 10.56-10.18 7.88-15.32"
            />
            <path
              fill="#bcaaa4"
              d="M33.16 29.53s12.05-2.55 30.86-3.44L64 47.68s-18.71.29-37.14-12.88c0 0 5.22 1.76 6.3-5.27"
            />
            <path
              fill="#bcaaa4"
              d="M94.84 29.53s-12.5-2.34-30.83-3.44L64 47.68s18.48.44 36.91-12.74c0 .01-4.97 1.49-6.07-5.41"
            />
            <path
              fill="#bcaaa4"
              d="M126.4 34.65c-2.12-6.58-8.79-10.91-16.96-8.79-8.18 2.12-19.69 13.8-26.66 16.83S68.24 45.64 64 45.64v1.59s7.62.58 19.32-3.96 17.41-9.64 26.75-11.23c9.35-1.59 13.4 3.37 14.28 6.18 1.25 3.98 1.56 15.17-4.26 22.98-.11.15-.21.28-.31.41l.49 1.78c.61-.72 1.18-1.51 1.92-2.57 6.96-10 5.35-22.65 4.21-26.17M8.22 61.6c-.1-.13-.21-.26-.32-.4-6.06-7.62-5.51-19-4.26-22.98.88-2.81 4.77-7.94 14.12-6.35 9.35 1.59 15.38 7.02 27.08 11.56S64 47.23 64 47.23v-1.59c-4.24 0-11.81.08-18.78-2.95S26.74 28 18.56 25.87c-8.18-2.12-14.84 2.2-16.96 8.79-1.14 3.52-2.74 16.17 4.2 26.18.71 1.02 1.33 1.84 1.86 2.49z"
            />
            <path
              fill="#a1887f"
              d="M52.02 7.16c2.13-.93 5.51 1.1 5.69 3.96s-7.08 9.9-18.53 12.55S48.37 8.75 52.02 7.16m23.84 0c-2.13-.93-5.51 1.1-5.69 3.96s7.08 9.9 18.53 12.55S79.52 8.75 75.86 7.16"
              opacity="0.5"
            />
            <path
              fill="#bcaaa4"
              d="M41.6 40.81s10.71 6.14 22.4 6.14 20.62-5.15 20.62-5.15S64 48.22 41.6 40.81"
            />
            <path
              fill="#a1887f"
              d="M33.62 35.49s14.2-3.38 31.44-2.98 29.17 2.98 29.17 2.98l3.63-3.17S84.22 27.2 64.77 27.2s-34.63 5.14-34.63 5.14z"
            />
            <path
              fill="#8d6e63"
              d="M64.49 28.45c-.73 0-6.29 1.02-6.29 1.64s5.54 1.46 6.29 1.46 6.17-.77 6.17-1.3-5.72-1.8-6.17-1.8m16.38.99c-.64-.06-5.58.37-5.63.91s4.72 1.74 5.37 1.8 5.45-.16 5.5-.62-4.84-2.05-5.24-2.09m-33.59 0c.64-.06 5.58.37 5.63.91s-4.72 1.74-5.37 1.8-5.45-.16-5.5-.62c-.04-.46 4.84-2.05 5.24-2.09"
            />
            <path
              fill="#2f2f2f"
              d="M42.21 72.65c-4.49.04-8.17-4.27-8.22-9.62-.05-5.37 3.55-9.75 8.04-9.79 4.48-.04 8.17 4.27 8.22 9.64.05 5.36-3.55 9.73-8.04 9.77m44.11 0c4.48-.01 8.11-4.36 8.1-9.71-.01-5.37-3.66-9.7-8.14-9.69 4.49.01-8.13 4.36-8.12 9.73.01 5.36 3.67 9.69 8.16 9.67"
            />
          </svg>
        </h2>

        {/* Notice message */}
        {showNotice && (
          <div className="bg-gradient-to-r from-amber50 to-orange50 border-l-4 border-amber500 rounded-xl p-5 mb-8 text-left shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <TbExclamationCircle
                  size={24}
                  className="text-amber500 mt-1 mr-3 flex-shrink-0"
                />
                <div>
                  <h3 className="font-bold text-amber800 mb-1">Notice</h3>
                  <p className="text-amber700 text-sm">
                    We're truly excited to have you here! You're valued and
                    supported every step of the way. Make yourself at home,
                    explore freely, and don't hesitate to reach out if you need
                    anything. Once again, a heartfelt welcome — we're excited
                    for what lies ahead!
                  </p>
                </div>
              </div>
              <button
                className="text-amber500 hover:text-amber700"
                onClick={() => setShowNotice(false)}
              >
                <RxCross2 size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Warning message for exceeding required questions */}
        {showWarning && (
          <div className="bg-gradient-to-r from-red-50 to-red100 border-l-4 border-red500 rounded-xl p-5 mb-8 text-left shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <TbExclamationCircle
                  size={24}
                  className="text-red500 mt-1 mr-3 flex-shrink-0"
                />
                <div>
                  <h3 className="font-bold text-red800 mb-1">
                    Warning: Too Many Questions Selected
                  </h3>
                  <p className="text-red700 text-sm">
                    You have selected {totalSelected} questions, which exceeds
                    the required {requiredQuestions} questions. Please deselect{" "}
                    {totalSelected - requiredQuestions} question(s) to continue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Announcement info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <div className="text-sm">
              <div className="bg-blue50 text-primary px-3 py-2 md:py-1 rounded-full flex flex-col sm:flex-row items-center gap-2 text-sm font-medium mb-2 sm:mb-0">
                <FaExclamationCircle className="h-4 w-4" />
                YOU ARE MAKING QUESTIONS FOR
                {rounds?.announcement && (
                  <Link
                    to={`/quiz-details/${rounds.announcement}`}
                    className="text-primary hover:text-primary font-medium underline"
                    target="_blank"
                  >
                    {rounds.announcement_name}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {rounds?.topic_subject && (
            <div className="flex items-center">
              <span className="text-gray500 mr-2">Subject:</span>
              <span className="font-medium text-gray800">
                {rounds.topic_subject}
              </span>
            </div>
          )}

          {rounds?.total_questions && (
            <div className="flex items-center">
              <span className="text-gray500 mr-2">Required Questions:</span>
              <span className="font-medium text-gray800">
                {rounds.total_questions}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row mb-4 md:mb-0 items-center justify-between">
          <h2 className="text-2xl xl:text-4xl font-bold mb-6 flex items-center">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Shared Tutor List
            </span>
            <span className="ml-3 bg-indigo100 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {pagination.total} tutors
            </span>
          </h2>
          <button
            onClick={handleOpenConfirmModal}
            className="bg-gradient-to-r py-2 px-4 rounded-full text-sm font-medium from-primary to-secondary text-white disabled:opacity-50"
            disabled={loading || remainingQuestions <= 0 || showWarning}
          >
            MAKE REST QUESTION WITH UNSELECTED (
            {remainingQuestions > 0 ? remainingQuestions : 0})
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Table Wrapper */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-sm md:text-base">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-900">
                  <th className="px-3 sm:px-4 py-3 text-left font-semibold whitespace-nowrap">
                    #
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left font-semibold whitespace-nowrap">
                    Tutor Name
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left font-semibold hidden md:table-cell whitespace-nowrap">
                    Institution
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left font-semibold hidden lg:table-cell whitespace-nowrap">
                    Department
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center font-semibold whitespace-nowrap">
                    Selected
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center font-semibold whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="text-gray-500">Loading tutors...</p>
                      </div>
                    </td>
                  </tr>
                ) : tutorQuestions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="w-16 h-16 text-gray-300 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        <p className="text-gray-500 font-medium">
                          No tutors found
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tutorQuestions.map((tutor, index) => (
                    <tr
                      key={tutor.id}
                      className="hover:bg-indigo-50 transition-colors duration-150"
                    >
                      <td className="px-3 sm:px-4 py-3 text-gray-500 whitespace-nowrap">
                        {(pagination.current - 1) * pagination.perPage +
                          index +
                          1}
                      </td>

                      <td className="px-3 sm:px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                        <div className="flex items-center min-w-[150px]">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-primary font-semibold text-sm">
                              {tutor.tutor_name.charAt(0)}
                            </span>
                          </div>
                          <span className="truncate max-w-[150px] sm:max-w-[200px]">
                            {tutor.tutor_name}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 sm:px-4 py-3 text-gray-600 hidden md:table-cell truncate max-w-[180px]">
                        {tutor.tutor_institution}
                      </td>

                      <td className="px-3 sm:px-4 py-3 text-gray-600 hidden lg:table-cell truncate max-w-[180px]">
                        {tutor.tutor_department}
                      </td>

                      <td className="px-3 sm:px-4 py-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-primary">
                          {tutor.selected_qs_number || 0}
                          <span className="ml-1 hidden sm:inline">
                            questions
                          </span>
                        </span>
                      </td>

                      <td className="px-3 sm:px-4 py-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleQuestionView(tutor.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs sm:text-sm font-medium rounded-full shadow-sm text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                        >
                          <FaRegEye className="mr-1.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              <tfoot className="bg-gray-50">
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 sm:px-4 py-3 text-sm font-medium text-gray-900"
                  >
                    Total Selected
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-primary text-white whitespace-nowrap">
                      {totalSelected}
                      <span className="ml-1 text-xs hidden sm:inline">
                        questions
                      </span>
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="bg-white px-3 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-3 sm:gap-0">
            {/* Summary text */}
            <p className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
              Showing{" "}
              <span className="font-medium">
                {(pagination.current - 1) * pagination.perPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  pagination.current * pagination.perPage,
                  pagination.total
                )}
              </span>{" "}
              of <span className="font-medium">{pagination.total}</span> results
            </p>

            {/* Pagination Buttons */}
            <nav
              className="flex items-center justify-center flex-wrap gap-1 sm:gap-2"
              aria-label="Pagination"
            >
              {/* Prev */}
              <button
                onClick={() => fetchTutorQuestions(pagination.current - 1)}
                disabled={pagination.current === 1}
                className={`inline-flex items-center px-2 py-2 rounded-md border text-sm font-medium ${
                  pagination.current === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                }`}
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Pages */}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (pagination.current <= 3) {
                  page = i + 1;
                } else if (pagination.current >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = pagination.current - 2 + i;
                }

                return (
                  <button
                    key={page}
                    onClick={() => fetchTutorQuestions(page)}
                    className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md ${
                      pagination.current === page
                        ? "bg-indigo-50 border-primary text-primary"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Ellipsis */}
              {totalPages > 5 && pagination.current < totalPages - 2 && (
                <span className="inline-flex items-center px-3 py-1.5 border border-gray-300 bg-white text-sm font-medium text-gray-700 rounded-md">
                  ...
                </span>
              )}

              {/* Next */}
              <button
                onClick={() => fetchTutorQuestions(pagination.current + 1)}
                disabled={pagination.current === totalPages}
                className={`inline-flex items-center px-2 py-2 rounded-md border text-sm font-medium ${
                  pagination.current === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                }`}
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black600 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Action
              </h3>
              <button
                onClick={handleCloseConfirmModal}
                className="text-gray500 hover:text-gray-700"
              >
                <RxCross2 size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to save this? This action will create{" "}
              {remainingQuestions} additional MCQ questions using unselected
              questions.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseConfirmModal}
                className="px-4 py-2 bg-gray-200 text-gray800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleMakeRestQuestions}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary disabled:opacity-50"
                disabled={loading}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Error Alert */}
      {error && (
        <div className="bg-red100 border-l-4 border-red-500 rounded-xl p-4 mb-6 text-red-700">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold">
              <RxCross2 />
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 rounded-xl p-4 mb-6 text-green-700">
          <div className="flex justify-between items-center">
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage(null)}
              className="font-bold"
            >
              <RxCross2 />
            </button>
          </div>
        </div>
      )}

      {/* Existing Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black600 bg-opacity-30 z-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* ... (other existing JSX remains unchanged) */}

      {/* Save Confirmation Modal */}
      {showSaveConfirmModal && (
        <div className="fixed inset-0 bg-black600 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Save
              </h3>
              <button
                onClick={handleCloseSaveConfirmModal}
                className="text-gray500 hover:text-gray-700"
              >
                <RxCross2 size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to save quiz questions?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseSaveConfirmModal}
                className="px-4 py-2 bg-gray-200 text-gray800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuizQuestions}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary disabled:opacity-50"
                disabled={loading}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {questionView && selectedTutorData && (
        <QuizQuestionInterface
          tutorData={selectedTutorData.tutor_details}
          questions={selectedTutorData.questions}
          onClose={closeModal}
          loading={loading}
          onSelectionChange={handleQuestionSelectChange}
          selectedQuestions={
            tutorSelections[selectedTutorData.tutor_details.id] || []
          }
          roundId={roundId}
          annId={annId}
        />
      )}
    </div>
  );
};

export default SharedQuestionsPresident;
