import { useEffect, useRef, useState } from "react";
import {
  FaBook,
  FaBuilding,
  FaCalendarAlt,
  FaCertificate,
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaRegCalendarAlt,
  FaSpinner,
} from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "../../api/API";
import BannerImage from "../../assets/images/banner-images/2.jpg";
import Banner from "../../components/Banner";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { formatDateTime } from "../../utils/FormateDateTime";

const QuizDetails = () => {
  const { quizId } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quickRegistration, setQuickRegistration] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  const gratificationsRef = useRef(null);
  const termsRef = useRef(null);

  // fetch announcement details
  useEffect(() => {
    const getAnnouncement = async () => {
      try {
        const response = await API.get(
          `/anc/single-announcement-details/${quizId}`
        );
        setAnnouncement(response?.data?.data || null);
      } catch (err) {
        console.error("Error fetching announcement:", err);
        setAnnouncement(null);
      } finally {
        setLoading(false);
      }
    };
    getAnnouncement();
  }, [quizId]);

  // get user type
  const userDataInfo = JSON.parse(localStorage.getItem("UserData"));
  const userType = userDataInfo?.user_type;
  // console.log("userType:", userType);

  // handle reference
  useEffect(() => {
    if (!announcement) return;
    if (
      location.state?.scrollTo === "gratifications" &&
      gratificationsRef.current
    ) {
      setTimeout(
        () => gratificationsRef.current.scrollIntoView({ behavior: "smooth" }),
        200
      );
    }
    if (location.state?.scrollTo === "terms" && termsRef.current) {
      setTimeout(
        () => termsRef.current.scrollIntoView({ behavior: "smooth" }),
        200
      );
    }
  }, [location.state, announcement]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <FaSpinner className="animate-spin text-3xl xl:text-4xl text-primary" />
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="text-center py-20 text-lg font-medium text-red-500">
        Announcement not found.
      </div>
    );
  }

  const handleQuickRegistration = () => setQuickRegistration(true);
  const handleCloseModal = () => setQuickRegistration(false);

  return (
    <>
      <Header />
      <Banner image={announcement?.announcement_event_banner || BannerImage} />

      {/* Quiz Details Section */}
      <div className="container mx-auto px-4 mt-8 mb-12">
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-0">
              Event Details
            </h2>
            {userType === "president" ? (
              ""
            ) : (
              <button
                onClick={handleQuickRegistration}
                className="bg-pink-500 text-white font-semibold px-6 py-2 rounded-full shadow hover:bg-primary transition"
              >
                Register Now
              </button>
            )}
          </div>

          {/* Quiz Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoItem
              icon={<FaBook />}
              label="Subject"
              value={announcement.subject}
            />
            <InfoItem
              icon={<FaBuilding />}
              label="Department Name"
              value={announcement.department_name}
            />
            <InfoItem
              icon={<FaMapMarkerAlt />}
              label="Address"
              value={announcement.address || "Online"}
            />
            <InfoItem
              icon={<FaRegCalendarAlt />}
              label="Registration Start"
              value={formatDateTime(announcement.registration_start_date)}
            />
            <InfoItem
              icon={<FaCalendarAlt />}
              label="Registration End"
              value={formatDateTime(announcement.registration_end_date)}
            />
            <InfoItem
              icon={<FaClock />}
              label="Total Days"
              value={announcement.total_days}
            />
            <InfoItem
              icon={<FaRegCalendarAlt />}
              label="Post Date"
              value={formatDateTime(announcement.created_at)}
            />
            <InfoItem
              icon={<FaRegCalendarAlt />}
              label="Last Update"
              value={formatDateTime(announcement.updated_at)}
            />
            <InfoItem
              icon={<FaBook />}
              label="Exam Type"
              value={announcement.exam_type || "MCQ"}
            />
          </div>
        </div>
      </div>

      {/* announcement details */}
      <div className="container mx-auto px-4 mt-8 mb-12">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Quiz Information</h3>
          <p>{announcement.announcement_details}</p>
        </div>
      </div>

      {/* Gratifications + Terms */}
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
        {/* Gratifications */}
        <div
          ref={gratificationsRef}
          className="bg-white rounded-2xl shadow-md p-6"
        >
          <h3 className="text-xl font-semibold mb-4">Gratifications</h3>
          <ul className="space-y-3 text-gray-700">
            {announcement.price_money && (
              <li className="flex items-center gap-2">
                <FaMoneyBillWave className="text-green-500" />
                <span>
                  Price Money: <b>{announcement.price_money}</b>
                </span>
              </li>
            )}
            <li className="flex items-center gap-2">
              <FaCertificate className="text-blue-500" />
              <span>
                Certificate: <b>{announcement.is_certificate ? "Yes" : "No"}</b>
              </span>
            </li>
            <li className="flex gap-2">
              <FaCertificate className="text-blue-500 mt-1" />
              <div>
                Exciting Price:{" "}
                <b>
                  {announcement?.exciting_prizes?.length ? (
                    announcement.exciting_prizes.map((item) => (
                      <p key={item.id} className="flex flex-col">
                        <span>Price Name: {item.item_name}</span>
                        <span>Quantity: {item.quantity}</span>
                      </p>
                    ))
                  ) : (
                    <p>No Exciting Prize</p>
                  )}
                </b>
              </div>
            </li>
          </ul>
        </div>

        {/* Terms & Conditions */}
        <div
          ref={termsRef}
          className="bg-white rounded-2xl shadow-md p-6 lg:col-span-2"
        >
          <h3 className="text-xl font-semibold mb-4">Terms And Conditions</h3>
          <div className="text-gray-700 leading-relaxed space-y-2">
            {announcement.terms_condition ? (
              <p>{announcement.terms_condition}</p>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                <li>All participants must be at least 18 years of age.</li>
                <li>Each participant may only enter the quiz once.</li>
                <li>
                  The quiz must be completed within the specified time limit.
                </li>
                <li>Decisions of the quiz organizers are final and binding.</li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* quick registration modal */}
      {quickRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Modal Container */}
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-lg font-semibold text-gray-500 hover:text-gray-800"
              // onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            {/* Modal Heading */}
            <h2 className="text-2xl font-bold mb-4 text-center">
              Important Note
            </h2>

            {/* Important Note Content */}
            <p className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-6">
              Before completing the registration, please carefully read the
              following instructions to ensure you select the correct category
              and provide accurate information.
            </p>

            {/* Registration Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">For Students</h3>
                <p className="text-gray-700 mt-1">
                  To participate in the quiz or register, please complete the
                  registration under the{" "}
                  <span className="font-medium">'Student'</span> tab in the
                  registration form.
                </p>
                <button
                  onClick={() =>
                    navigate("/register", {
                      state: { userType: "student" },
                    })
                  }
                  className="py-1 px-3 text-sm font-semibold bg-primary rounded text-white mt-2"
                >
                  Register Now
                </button>
              </div>

              <div>
                <h3 className="text-xl font-semibold">For Tutors</h3>
                <p className="text-gray-700 mt-1">
                  To create and share quiz questions, please complete your
                  registration via the{" "}
                  <span className="font-medium">'Tutor'</span> tab in the
                  registration form.
                </p>
                <button
                  onClick={() =>
                    navigate("/register", { state: { userType: "tutor" } })
                  }
                  className="py-1 px-3 text-sm font-semibold bg-primary rounded text-white mt-2"
                >
                  Register Now
                </button>
              </div>
            </div>

            {/* Registration Button */}
            {/* <div className="mt-6 text-center">
              <Link
                to="/register"
                className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Register Now
              </Link>
            </div> */}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

//  Reusable info item component
const InfoItem = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="text-pink-500 text-xl mt-1">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-900 font-medium">{value}</p>
      </div>
    </div>
  );
};

export default QuizDetails;

// import { useEffect, useRef, useState } from "react";
// import {
//   FaBook,
//   FaBuilding,
//   FaCalendarAlt,
//   FaCertificate,
//   FaClock,
//   FaMapMarkerAlt,
//   FaMoneyBillWave,
//   FaRegCalendarAlt,
// } from "react-icons/fa";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import API from "../../api/API";
// import BannerImage from "../../assets/images/banner-images/2.jpg";
// import Banner from "../../components/Banner";
// import Footer from "../../components/Footer";
// import Header from "../../components/Header";
// import { formatDateTime } from "../../utils/FormateDateTime";

// const QuizDetails = () => {
//   const { quizId } = useParams();
//   const [announcement, setAnnouncement] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [quickRegistration, setQuickRegistration] = useState(false);
//   const location = useLocation();

//   const navigate = useNavigate();

//   const gratificationsRef = useRef(null);
//   const termsRef = useRef(null);

//   useEffect(() => {
//     const getAnnouncement = async () => {
//       try {
//         const response = await API.get(
//           `/anc/single-announcement-details/${quizId}`
//         );
//         setAnnouncement(response?.data?.data || null);
//       } catch (err) {
//         console.error("Error fetching announcement:", err);
//         setAnnouncement(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getAnnouncement();
//   }, [quizId]);

//   useEffect(() => {
//     if (!announcement) return;
//     if (
//       location.state?.scrollTo === "gratifications" &&
//       gratificationsRef.current
//     ) {
//       setTimeout(
//         () => gratificationsRef.current.scrollIntoView({ behavior: "smooth" }),
//         200
//       );
//     }
//     if (location.state?.scrollTo === "terms" && termsRef.current) {
//       setTimeout(
//         () => termsRef.current.scrollIntoView({ behavior: "smooth" }),
//         200
//       );
//     }
//   }, [location.state, announcement]);

//   if (loading) {
//     return (
//       <div className="text-center py-20 text-lg font-medium">
//         Loading announcement details...
//       </div>
//     );
//   }

//   if (!announcement) {
//     return (
//       <div className="text-center py-20 text-lg font-medium text-red-500">
//         Announcement not found.
//       </div>
//     );
//   }

//   const handleQuickRegistration = () => setQuickRegistration(true);
//   const handleCloseModal = () => setQuickRegistration(false);

//   return (
//     <>
//       <Header />
//       <Banner image={announcement?.announcement_event_banner || BannerImage} />

//       {/* Quiz Details Section */}
//       <div className="container mx-auto px-4 mt-8 mb-12">
//         <div className="bg-white shadow-lg rounded-2xl p-6 md:p-10">
//           {/* Header */}
//           <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
//             <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-0">
//               Event Details
//             </h2>
//             <button
//               onClick={handleQuickRegistration}
//               className="bg-pink-500 text-white font-semibold px-6 py-2 rounded-full shadow hover:bg-pink-600 transition"
//             >
//               Register Now
//             </button>
//           </div>

//           {/* Quiz Info Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             <InfoItem
//               icon={<FaBook />}
//               label="Subject"
//               value={announcement.subject}
//             />
//             <InfoItem
//               icon={<FaBuilding />}
//               label="Department Name"
//               value={announcement.department_name}
//             />
//             <InfoItem
//               icon={<FaMapMarkerAlt />}
//               label="Address"
//               value={announcement.address || "Online"}
//             />
//             <InfoItem
//               icon={<FaRegCalendarAlt />}
//               label="Registration Start"
//               value={formatDateTime(announcement.registration_start_date)}
//             />
//             <InfoItem
//               icon={<FaCalendarAlt />}
//               label="Registration End"
//               value={formatDateTime(announcement.registration_end_date)}
//             />
//             <InfoItem
//               icon={<FaClock />}
//               label="Total Days"
//               value={announcement.total_days}
//             />
//             <InfoItem
//               icon={<FaRegCalendarAlt />}
//               label="Created At"
//               value={formatDateTime(announcement.created_at)}
//             />
//             <InfoItem
//               icon={<FaRegCalendarAlt />}
//               label="Updated At"
//               value={formatDateTime(announcement.updated_at)}
//             />
//             <InfoItem
//               icon={<FaBook />}
//               label="Exam Type"
//               value={announcement.exam_type || "MCQ"}
//             />
//           </div>
//         </div>
//       </div>

//       {/* announcement details */}
//       <div className="container mx-auto px-4 mt-8 mb-12">
//         <div className="bg-white rounded-2xl shadow-md p-6">
//           <h3 className="text-xl font-semibold mb-4">Quiz Information</h3>
//           <p>{announcement.announcement_details}</p>
//         </div>
//       </div>

//       {/* Gratifications + Terms */}
//       <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
//         {/* Gratifications */}
//         <div
//           ref={gratificationsRef}
//           className="bg-white rounded-2xl shadow-md p-6"
//         >
//           <h3 className="text-xl font-semibold mb-4">Gratifications</h3>
//           <ul className="space-y-3 text-gray-700">
//             {announcement.price_money && (
//               <li className="flex items-center gap-2">
//                 <FaMoneyBillWave className="text-green-500" />
//                 <span>
//                   Price Money: <b>{announcement.price_money}</b>
//                 </span>
//               </li>
//             )}
//             <li className="flex items-center gap-2">
//               <FaCertificate className="text-blue-500" />
//               <span>
//                 Certificate: <b>{announcement.is_certificate ? "Yes" : "No"}</b>
//               </span>
//             </li>
//           </ul>
//         </div>

//         {/* Terms & Conditions */}
//         <div
//           ref={termsRef}
//           className="bg-white rounded-2xl shadow-md p-6 lg:col-span-2"
//         >
//           <h3 className="text-xl font-semibold mb-4">Terms And Conditions</h3>
//           <div className="text-gray-700 leading-relaxed space-y-2">
//             {announcement.terms_condition ? (
//               <p>{announcement.terms_condition}</p>
//             ) : (
//               <ul className="list-disc pl-5 space-y-1">
//                 <li>All participants must be at least 18 years of age.</li>
//                 <li>Each participant may only enter the quiz once.</li>
//                 <li>
//                   The quiz must be completed within the specified time limit.
//                 </li>
//                 <li>Decisions of the quiz organizers are final and binding.</li>
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* quick registration modal */}
//       {quickRegistration && (
//         <div className="fixed inset-0 bg-black600 bg-opacity-50 flex items-center justify-center z-50">
//           {/* Modal Container */}
//           <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
//             {/* Close Button */}
//             <button
//               onClick={handleCloseModal}
//               className="absolute top-4 right-4 text-lg font-semibold text-gray-500 hover:text-gray-800"
//               // onClick={() => setIsOpen(false)}
//             >
//               ✕
//             </button>

//             {/* Modal Heading */}
//             <h2 className="text-2xl font-bold mb-4 text-center">
//               Important Note
//             </h2>

//             {/* Important Note Content */}
//             <p className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-6">
//               Before completing the registration, please carefully read the
//               following instructions to ensure you select the correct category
//               and provide accurate information.
//             </p>

//             {/* Registration Info */}
//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-xl font-semibold">For Students</h3>
//                 <p className="text-gray-700 mt-1">
//                   To participate in the quiz or register, please complete the
//                   registration under the{" "}
//                   <span className="font-medium">'Student'</span> tab in the
//                   registration form.
//                 </p>
//                 <button
//                   onClick={() =>
//                     navigate("/register", {
//                       state: { userType: "student" },
//                     })
//                   }
//                   className="py-1 px-3 text-sm font-semibold bg-primary rounded text-white mt-2"
//                 >
//                   Register Now
//                 </button>
//               </div>

//               <div>
//                 <h3 className="text-xl font-semibold">For Tutors</h3>
//                 <p className="text-gray-700 mt-1">
//                   To create and share quiz questions, please complete your
//                   registration via the{" "}
//                   <span className="font-medium">'Tutor'</span> tab in the
//                   registration form.
//                 </p>
//                 <button
//                   onClick={() =>
//                     navigate("/register", { state: { userType: "tutor" } })
//                   }
//                   className="py-1 px-3 text-sm font-semibold bg-primary rounded text-white mt-2"
//                 >
//                   Register Now
//                 </button>
//               </div>
//             </div>

//             {/* Registration Button */}
//             {/* <div className="mt-6 text-center">
//               <Link
//                 to="/register"
//                 className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
//               >
//                 Register Now
//               </Link>
//             </div> */}
//           </div>
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// };

// //  Reusable info item component
// const InfoItem = ({ icon, label, value }) => {
//   if (!value) return null;
//   return (
//     <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
//       <div className="text-pink-500 text-xl mt-1">{icon}</div>
//       <div>
//         <p className="text-sm text-gray-500">{label}</p>
//         <p className="text-gray-900 font-medium">{value}</p>
//       </div>
//     </div>
//   );
// };

// export default QuizDetails;

// import { useEffect, useRef, useState } from "react";
// import { Link, useLocation, useParams } from "react-router-dom";
// import API from "../../api/API";
// import BannerImage from "../../assets/images/banner-images/2.jpg";
// import Banner from "../../components/Banner";
// import Footer from "../../components/Footer";
// import Header from "../../components/Header";
// import { formatDateTime } from "../../utils/FormateDateTime";

// const QuizDetails = () => {
//   const { quizId } = useParams();
//   const [announcement, setAnnouncement] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [quickRegistration, setQuickRegistration] = useState(false);
//   const location = useLocation();

//   // refs
//   const gratificationsRef = useRef(null);
//   const termsRef = useRef(null);

//   useEffect(() => {
//     const getAnnouncement = async () => {
//       try {
//         const response = await API.get(
//           `/anc/single-announcement-details/${quizId}`
//         );
//         setAnnouncement(response?.data?.data || null);
//       } catch (err) {
//         console.error("Error fetching announcement:", err);
//         setAnnouncement(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getAnnouncement();
//   }, [quizId]);

//   // scroll handler
//   useEffect(() => {
//     if (!announcement) return;

//     if (
//       location.state?.scrollTo === "gratifications" &&
//       gratificationsRef.current
//     ) {
//       setTimeout(() => {
//         gratificationsRef.current.scrollIntoView({ behavior: "smooth" });
//       }, 200);
//     }

//     if (location.state?.scrollTo === "terms" && termsRef.current) {
//       setTimeout(() => {
//         termsRef.current.scrollIntoView({ behavior: "smooth" });
//       }, 200);
//     }
//   }, [location.state, announcement]);

//   if (loading) {
//     return (
//       <div className="text-center py-20 text-lg font-medium">
//         Loading announcement details...
//       </div>
//     );
//   }

//   if (!announcement) {
//     return (
//       <div className="text-center py-20 text-lg font-medium text-red-500">
//         Announcement not found.
//       </div>
//     );
//   }

//   // handle quick registration modal
//   const handleQuickRegistration = () => {
//     setQuickRegistration(true);
//   };

//   // handle close modal
//   const handleCloseModal = () => {
//     setQuickRegistration(false);
//   };

//   return (
//     <>
//       {/* header */}
//       <Header />

//       {/* Banner with dynamic or fallback image */}
//       <Banner image={announcement?.announcement_event_banner || BannerImage} />
//       {/* <AuthButtons />
//       <WhatsAppContact /> */}

//       {/* About Announcement */}
//       <div className="container mx-auto px-4 mt-8 mb-8">
//         <div className="mb-5 flex items-center justify-between">
//           <h2 className="text-xl lg:text-2xl xl:text-3xl font-semibold">
//             About Announcement
//           </h2>
//           <button
//             onClick={handleQuickRegistration}
//             className="bg-red-500 py-2 px-4 rounded font-semibold text-white"
//           >
//             Quick Registration
//           </button>
//         </div>
//         <div className="bg-white shadow-[0px_8px_24px_rgba(149,157,165,0.2)] p-10 rounded-xl">
//           <ul className="space-y-2">
//             {announcement.announcement_name && (
//               <li className="text-base font-medium">
//                 <span className="font-semibold text-lg">
//                   Announcement Name :
//                 </span>{" "}
//                 {announcement.announcement_name}
//               </li>
//             )}
//             {announcement.subject && (
//               <li className="text-base font-medium">
//                 <span className="font-semibold text-lg">Subject :</span>{" "}
//                 {announcement.subject}
//               </li>
//             )}
//             {announcement.department_name && (
//               <li className="text-base font-medium">
//                 <span className="font-semibold text-lg">Department Name :</span>{" "}
//                 {announcement.department_name}
//               </li>
//             )}
//             {announcement.address && (
//               <li className="text-base font-medium">
//                 <span className="font-semibold text-lg">Address :</span>{" "}
//                 {announcement.address}
//               </li>
//             )}
//             {announcement.exam_type && (
//               <li className="text-base font-medium">
//                 <span className="font-semibold text-lg">Exam Type :</span>{" "}
//                 {announcement.exam_type}
//               </li>
//             )}
//             {announcement.announcement_details && (
//               <li className="text-base font-medium">
//                 <span className="font-semibold text-lg">Details :</span>{" "}
//                 {announcement.announcement_details}
//               </li>
//             )}
//             {announcement.created_at && (
//               <li className="text-base font-medium">
//                 <span className="font-semibold text-lg">Created At :</span>{" "}
//                 {formatDateTime(announcement.created_at)}
//               </li>
//             )}
//             {announcement.question_type && (
//               <li className="text-base font-medium">
//                 <span className="font-semibold text-lg">Question Type :</span>{" "}
//                 {announcement.question_type}
//               </li>
//             )}
//             {announcement.registration_start_date && (
//               <li className="text-base font-medium">
//                 <span className="font-semibold text-lg">
//                   Registration Start Date :
//                 </span>{" "}
//                 {formatDateTime(announcement.registration_start_date)}
//               </li>
//             )}
//             {announcement.registration_end_date && (
//               <li className="text-base font-medium">
//                 <span className="font-semibold text-lg">
//                   Registration End Date :
//                 </span>{" "}
//                 {formatDateTime(announcement.registration_end_date)}
//               </li>
//             )}
//             {announcement.total_days && (
//               <li className="text-base font-medium">
//                 <span className="font-semibold text-lg">Total Days :</span>{" "}
//                 {announcement.total_days}
//               </li>
//             )}
//             {announcement.updated_at && (
//               <li className="text-base font-medium">
//                 <span className="font-semibold text-lg">Updated At :</span>{" "}
//                 {formatDateTime(announcement.updated_at)}
//               </li>
//             )}
//             {announcement.organizer_name && (
//               <li className="text-base font-medium">
//                 <span className="font-semibold text-lg">Organized By :</span>{" "}
//                 {announcement.organizer_name}
//               </li>
//             )}
//           </ul>
//         </div>
//       </div>

//       {/* Gratifications */}
//       <div ref={gratificationsRef} className="container mx-auto px-4 mt-8 mb-8">
//         <h2 className="text-xl lg:text-2xl xl:text-3xl font-semibold mb-5">
//           Gratifications
//         </h2>
//         <div className="bg-white shadow-[0px_8px_24px_rgba(149,157,165,0.2)] p-10 rounded-xl">
//           <ul className="list-disc pl-1 space-y-2">
//             {announcement.price_money && (
//               <li className="text-base font-medium">
//                 <span className="font-semibold text-lg">Price Money :</span>{" "}
//                 {announcement.price_money}
//               </li>
//             )}

//             {announcement.exciting_prizes?.length > 0 && (
//               <li className="text-base font-medium">
//                 <span className="font-semibold text-lg">Exciting Prizes :</span>
//                 <ul className="pl-5 mt-2 space-y-1">
//                   {announcement.exciting_prizes.map((item) => (
//                     <li key={item.id} className="flex items-center gap-3">
//                       <span>Item Name: {item.item_name}</span>
//                       <span>Quantity: {item.quantity}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </li>
//             )}

//             <li className="text-base font-medium">
//               <span className="font-semibold text-lg">Certificate :</span>{" "}
//               {announcement.is_certificate ? "Yes" : "No"}
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* Terms and Conditions */}
//       {announcement.terms_condition && (
//         <div ref={termsRef} className="container mx-auto px-4 mb-8">
//           <h2 className="text-xl lg:text-2xl xl:text-3xl font-semibold mb-5">
//             Terms And Conditions
//           </h2>
//           <p className="text-base font-medium">
//             {announcement.terms_condition}
//           </p>
//         </div>
//       )}

//       {/* quick registration modal */}
//       {quickRegistration && (
//         <div className="fixed inset-0 bg-black600 bg-opacity-50 flex items-center justify-center z-50">
//           {/* Modal Container */}
//           <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
//             {/* Close Button */}
//             <button
//               onClick={handleCloseModal}
//               className="absolute top-4 right-4 text-lg font-semibold text-gray-500 hover:text-gray-800"
//               // onClick={() => setIsOpen(false)}
//             >
//               ✕
//             </button>

//             {/* Modal Heading */}
//             <h2 className="text-2xl font-bold mb-4 text-center">
//               Important Note
//             </h2>

//             {/* Important Note Content */}
//             <p className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-6">
//               Before completing the registration, please carefully read the
//               following instructions to ensure you select the correct category
//               and provide accurate information.
//             </p>

//             {/* Registration Info */}
//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-xl font-semibold">For Students</h3>
//                 <p className="text-gray-700 mt-1">
//                   To participate in the quiz or register, please complete the
//                   registration under the{" "}
//                   <span className="font-medium">'Student'</span> tab in the
//                   registration form.
//                 </p>
//               </div>

//               <div>
//                 <h3 className="text-xl font-semibold">For Tutors</h3>
//                 <p className="text-gray-700 mt-1">
//                   To create and share quiz questions, please complete your
//                   registration via the{" "}
//                   <span className="font-medium">'Tutor'</span> tab in the
//                   registration form.
//                 </p>
//               </div>
//             </div>

//             {/* Registration Button */}
//             <div className="mt-6 text-center">
//               <Link
//                 to="/register"
//                 className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
//               >
//                 Register Now
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* footer */}
//       <Footer />
//     </>
//   );
// };

// export default QuizDetails;
