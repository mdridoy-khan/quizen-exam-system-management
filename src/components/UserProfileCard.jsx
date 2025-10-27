import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaEnvelope,
  FaGraduationCap,
  FaLocationDot,
  FaPhone,
} from "react-icons/fa6";
import { LiaUserEditSolid } from "react-icons/lia";
import API from "../api/API";
import ProfileImage from "../assets/images/profile.png";
import UserProfileEdit from "./UserProfileEdit";

const UserProfileCard = () => {
  const [profileData, setProfileData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/auth/personal-info/");
      setProfileData(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch profile data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleCancelModal = () => {
    setShowEditModal(false);
  };

  // handle profile update (from modal)
  const handleProfileUpdate = async (updatedData) => {
    try {
      // Instantly update UI with new data (especially profile picture)
      setProfileData((prev) => ({
        ...prev,
        ...updatedData,
        profile_picture: updatedData.profile_picture || prev?.profile_picture,
      }));

      // Re-fetch latest data from backend (optional sync)
      const response = await API.get("/auth/personal-info/");
      setProfileData(response.data);
    } catch (error) {
      console.error("Failed to refresh profile after update:", error);
      setError("Failed to refresh profile after update. Please try again.");
    } finally {
      setShowEditModal(false);
    }
  };

  // check if user is student
  const isStudent = !!localStorage.getItem("student");

  return (
    <div className="bg-white bg-opacity-30 shadow rounded-2xl p-6 transition hover:shadow">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 text-red-500">
          {error}
        </div>
      ) : profileData ? (
        <>
          {/* Edit Button */}
          <div className="flex items-center justify-end mb-3">
            <button onClick={handleEditProfile} aria-label="Edit Profile">
              <LiaUserEditSolid size={24} />
            </button>
          </div>

          {/* Profile Picture + Basic Info */}
          <div className="flex items-center justify-center flex-col">
            <div>
              <img
                src={profileData?.profile_picture || ProfileImage}
                alt="Profile"
                onError={(e) => (e.target.src = ProfileImage)}
                className="w-32 h-32 object-cover rounded-full border"
              />
            </div>
            <h5 className="text-xl font-semibold mt-3">
              {profileData?.full_name || "N/A"}
            </h5>
            <h5 className="text-base font-semibold text-gray-600">
              {profileData?.institution || "N/A"}
            </h5>
          </div>

          {/* Contact + Info */}
          <div className="flex items-center justify-center flex-col lg:justify-start lg:items-start">
            <div className="mt-10">
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm font-semibold">
                  <FaEnvelope size={18} />
                  <span>{profileData?.gmail || "N/A"}</span>
                </li>
                <li className="flex items-center gap-2 text-sm font-semibold">
                  <FaPhone size={18} />
                  <span>{profileData?.phone || "N/A"}</span>
                </li>
                <li className="flex items-center gap-2 text-sm font-semibold">
                  <FaGraduationCap size={18} />
                  <span>{profileData?.department || "N/A"}</span>
                </li>
                <li className="flex items-center gap-2 text-sm font-semibold">
                  <FaLocationDot size={18} />
                  <span>{profileData?.address || "N/A"}</span>
                </li>
                <li className="flex items-center gap-2 text-sm font-semibold">
                  <FaBriefcase size={18} />
                  <span>{profileData?.upazila || "N/A"}</span>
                </li>
              </ul>
            </div>

            {/* Categories */}
            {isStudent && profileData?.category_choice?.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap mt-6">
                {profileData.category_choice.map((cat, index) => (
                  <button
                    key={index}
                    className="py-1 px-2 text-sm font-semibold text-white bg-gradient-to-r from-gradientStart to-gradientEnd rounded"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative p-6 overflow-y-auto max-h-[80vh]">
            <UserProfileEdit
              userData={profileData}
              onCancelModal={handleCancelModal}
              onProfileUpdated={handleProfileUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileCard;

// import { useEffect, useState } from "react";
// import {
//   FaBriefcase,
//   FaEnvelope,
//   FaGraduationCap,
//   FaLocationDot,
//   FaPhone,
// } from "react-icons/fa6";
// import { LiaUserEditSolid } from "react-icons/lia";
// import API from "../api/API";
// import ProfileImage from "../assets/images/profile.png";
// import UserProfileEdit from "./UserProfileEdit";

// const UserProfileCard = () => {
//   const [profileData, setProfileData] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await API.get("/auth/personal-info/");
//       setProfileData(response.data);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch profile data. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditProfile = () => {
//     setShowEditModal(true);
//   };

//   const handleCancelModal = () => {
//     setShowEditModal(false);
//   };

//   // profile update
//   const handleProfileUpdate = async (updatedData) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await API.get("/auth/personal-info/");
//       setProfileData(response.data);
//     } catch (error) {
//       console.error("Failed to refresh profile after update:", error);
//       setError("Failed to refresh profile after update. Please try again.");
//     } finally {
//       setLoading(false);
//       setShowEditModal(false);
//     }
//   };

//   // user data
//   const isStudent = !!localStorage.getItem("student");
//   return (
//     <div className="bg-white bg-opacity-30 shadow rounded-2xl p-6 transition hover:shadow">
//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="w-12 h-12 border-4 border-blue500 border-t-transparent border-solid rounded-full animate-spin"></div>
//         </div>
//       ) : error ? (
//         <div className="flex justify-center items-center h-64 text-red500">
//           {error}
//         </div>
//       ) : profileData ? (
//         <>
//           <div className="flex items-center justify-end mb-3">
//             <button onClick={handleEditProfile} aria-label="Edit Profile">
//               <LiaUserEditSolid size={24} />
//             </button>
//           </div>
//           <div className="flex items-center justify-center flex-col">
//             <div>
//               <img
//                 src={profileData.profile_picture || ProfileImage}
//                 alt="Profile image"
//                 className="w-32 h-32 object-cover rounded-full"
//               />
//             </div>
//             <h5 className="text-xl font-semibold">{profileData.full_name}</h5>
//             <h5 className="text-base font-semibold">
//               {profileData.institution || "N/A"}
//             </h5>
//           </div>
//           <div className="flex items-center justify-center flex-col lg:justify-start lg:items-start">
//             <div className="mt-10">
//               <ul className="space-y-2">
//                 <li className="flex items-center gap-2 text-sm font-semibold">
//                   <FaEnvelope size={18} />
//                   <span>{profileData.gmail || "N/A"}</span>
//                 </li>
//                 <li className="flex items-center gap-2 text-sm font-semibold">
//                   <FaPhone size={18} />
//                   <span>{profileData.phone || "N/A"}</span>
//                 </li>
//                 <li className="flex items-center gap-2 text-sm font-semibold">
//                   <FaGraduationCap size={18} />
//                   <span>{profileData.department || "N/A"}</span>
//                 </li>
//                 <li className="flex items-center gap-2 text-sm font-semibold">
//                   <FaLocationDot size={18} />
//                   <span>{profileData.address || "N/A"}</span>
//                 </li>
//                 <li className="flex items-center gap-2 text-sm font-semibold">
//                   <FaBriefcase size={18} />
//                   <span>{profileData.upazila || "N/A"}</span>
//                 </li>
//               </ul>
//             </div>
//             {isStudent && (
//               <div className="flex items-center gap-1 flex-wrap mt-6">
//                 {profileData.category_choice.map((cat, index) => (
//                   <button
//                     key={index}
//                     className="py-1 px-2 text-sm font-semibold text-white bg-gradient-to-r from-gradientStart to-gradientEnd rounded"
//                   >
//                     {cat}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </>
//       ) : null}

//       {showEditModal && (
//         <div className="fixed inset-0 bg-black600 bg-opacity-50 flex justify-center items-center z-50 px-4">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative p-6 overflow-y-auto max-h-[80vh]">
//             <UserProfileEdit
//               userData={profileData}
//               onCancelModal={handleCancelModal}
//               onProfileUpdated={handleProfileUpdate}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserProfileCard;

// import { useEffect, useState } from "react";
// import {
//   FaBriefcase,
//   FaEnvelope,
//   FaGraduationCap,
//   FaLocationDot,
//   FaPhone,
// } from "react-icons/fa6";
// import { LiaUserEditSolid } from "react-icons/lia";
// import API from "../api/API";
// import ProfileImage from "../assets/images/profile.png";
// import UserProfileEdit from "./UserProfileEdit";

// const UserProfileCard = () => {
//   const [profileData, setProfileData] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       setLoading(true);
//       const response = await API.get("/auth/personal-info/");
//       setProfileData(response.data);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch profile data. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditProfile = () => {
//     setShowEditModal(true);
//   };

//   const handleCancelModal = () => {
//     setShowEditModal(false);
//   };

//   // profile update
//   const handleProfileUpdate = async (updatedData) => {
//     try {
//       setLoading(true);
//       const response = await API.get("/auth/personal-info/");
//       setProfileData(response.data);
//     } catch (error) {
//       console.error("Failed to refresh profile after update:", error);
//     } finally {
//       setLoading(false);
//       setShowEditModal(false);
//     }
//   };

//   return (
//     <div className="bg-[var(--gray-400)] rounded-2xl p-6 transition hover:shadow">
//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <p>Loading...</p>
//         </div>
//       ) : error ? (
//         <div className="flex justify-center items-center h-64 text-red500">
//           {error}
//         </div>
//       ) : profileData ? (
//         <>
//           <div className="flex items-center justify-end mb-3">
//             <button onClick={handleEditProfile} aria-label="Edit Profile">
//               <LiaUserEditSolid size={24} />
//             </button>
//           </div>
//           <div className="flex items-center justify-center flex-col">
//             <div>
//               <img
//                 src={profileData.profile_image || ProfileImage}
//                 alt="Profile image"
//                 className="w-32 h-32 object-cover rounded-full"
//               />
//             </div>
//             <h5 className="text-xl font-semibold">{profileData.full_name}</h5>
//             <h5 className="text-base font-semibold">
//               {profileData.institution || "N/A"}
//             </h5>
//           </div>
//           <div className="mt-10">
//             <ul className="space-y-2">
//               <li className="flex items-center gap-2 text-sm font-semibold">
//                 <FaEnvelope size={18} />
//                 <span>{profileData.gmail || "N/A"}</span>
//               </li>
//               <li className="flex items-center gap-2 text-sm font-semibold">
//                 <FaPhone size={18} />
//                 <span>{profileData.phone || "N/A"}</span>
//               </li>
//               <li className="flex items-center gap-2 text-sm font-semibold">
//                 <FaGraduationCap size={18} />
//                 <span>{profileData.department || "N/A"}</span>
//               </li>
//               <li className="flex items-center gap-2 text-sm font-semibold">
//                 <FaLocationDot size={18} />
//                 <span>{profileData.address || "N/A"}</span>
//               </li>
//               <li className="flex items-center gap-2 text-sm font-semibold">
//                 <FaBriefcase size={18} />
//                 <span>{profileData.upazila || "N/A"}</span>
//               </li>
//             </ul>
//           </div>
//         </>
//       ) : null}

//       {showEditModal && (
//         <div className="fixed inset-0 bg-black600 bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative p-6 overflow-y-auto max-h-[80vh]">
//             <UserProfileEdit
//               userData={profileData}
//               onCancelModal={handleCancelModal}
//               onProfileUpdated={handleProfileUpdate}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserProfileCard;
