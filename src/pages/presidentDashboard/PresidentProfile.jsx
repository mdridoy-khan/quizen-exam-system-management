import { FaSpinner } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { TbExclamationCircle } from "react-icons/tb";

import { useEffect, useState } from "react";
import API from "../../api/API";
import UserProfileCard from "../../components/UserProfileCard";

const PresidentProfile = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messageClose, setMessageClose] = useState({
    welcomeMessage: true,
    noticeMessage: true,
  });

  useEffect(() => {
    const presidentData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get("/anc/president-dashboard-info/");
        setData(response?.data?.data);
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    presidentData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <FaSpinner className="animate-spin text-4xl text-cyan500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-red500 font-semibold">
        {error}
      </div>
    );
  }

  // handle message modal close
  const handleMessageClose = (modalName) => {
    setMessageClose((prev) => ({ ...prev, [modalName]: false }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
      {/* profile card */}
      <div>
        <UserProfileCard />
      </div>

      {/* profile details content */}
      <div className="w-full lg:max-w-[400px] xl:max-w-2xl 2xl:max-w-4xl">
        {/* welcome message */}
        {messageClose.welcomeMessage && (
          <div className="bg-blue300 bg-opacity-30 p-4 rounded-xl mb-4 shadow">
            <div className="text-end">
              <button onClick={() => handleMessageClose("welcomeMessage")}>
                <RxCross2 size={20} />
              </button>
            </div>
            <span className="text-base font-medium block mb-1">Welcome</span>
            <p className="text-sm font-medium">
              We're truly dead, know that you’re valued and supported every step
              of the way.Make yourself at home,explore freely, and don’t
              hesitate to reach out if you need anything. Once again, a
              heartfeltwelcome — we’re excited for what lies ahead!
            </p>
          </div>
        )}

        {/* notice message */}
        {messageClose.noticeMessage && (
          <div className="bg-orange200 p-4 rounded-xl mb-8 shadow">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium mb-1 flex items-center gap-2">
                <TbExclamationCircle
                  size={24}
                  style={{ color: "var(primary)" }}
                />{" "}
                Notice for “Math Quiz 2025”
              </span>
              <button onClick={() => handleMessageClose("noticeMessage")}>
                <RxCross2 size={20} />
              </button>
            </div>
            <p className="text-sm font-medium">
              We're truly dead, know that you’re valued and supported every step
              of the way.Make yourself at home,explore freely, and don’t
              hesitate to reach out if you need anything. Once again, a
              heartfeltwelcome — we’re excited for what lies ahead!
            </p>
          </div>
        )}

        <div className="flex gap-4 flex-wrap">
          {/* question box */}
          <div className="bg-blue300 bg-opacity-30 py-8 px-6 w-full xl:max-w-52 rounded-xl text-center transition hover:bg-cyan350 shadow">
            <span className="text-[15px] font-semibold mb-3 block">
              Total Announcement Create
            </span>
            <h3 className="text-2xl font-semibold">
              {data?.announcement_create}
            </h3>
          </div>
          {/* question box */}
          <div className="bg-blue300 bg-opacity-30 py-8 px-6 w-full xl:max-w-52 rounded-xl text-center transition hover:bg-cyan350 shadow">
            <span className="text-[15px] font-semibold mb-3 block">
              Total Round Create
            </span>
            <h3 className="text-2xl font-semibold">{data?.round_create}</h3>
          </div>
          {/* question box */}
          <div className="bg-blue300 bg-opacity-30 py-8 px-6 w-full xl:max-w-52 rounded-xl text-center transition hover:bg-cyan350 shadow">
            <span className="text-[15px] font-semibold mb-3 block">
              Total Price Money
            </span>
            <h3 className="text-2xl font-semibold">
              {data?.total_price_money}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresidentProfile;

// import { RxCross2 } from "react-icons/rx";
// import { TbExclamationCircle } from "react-icons/tb";

// import { useEffect, useState } from "react";
// import API from "../../api/API";
// import UserProfileCard from "../../components/UserProfileCard";

// const PresidentProfile = () => {
//   const [data, setData] = useState();

//   useEffect(() => {
//     const presidentData = async () => {
//       try {
//         const response = await API.get("/anc/president-dashboard-info/");
//         console.log("presidentData:", response?.data?.data);
//         setData(response?.data?.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     presidentData();
//   }, []);

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
//       {/* profile card */}
//       <div>
//         <UserProfileCard />
//       </div>

//       {/* profile details content */}
//       <div className="w-full lg:max-w-[400px] xl:max-w-2xl 2xl:max-w-4xl">
//         <div className="space-y-2">
//           {/* welcome message */}
//           <div className="bg-cyan300 p-4 rounded-xl">
//             <div className="text-end">
//               <button>
//                 <RxCross2 size={20} />
//               </button>
//             </div>
//             <span className="text-base font-medium block mb-1">
//               Welcome, Md Imran Hossain!
//             </span>
//             <p className="text-sm font-medium">
//               We're truly dead, know that you’re valued and supported every step
//               of the way.Make yourself at home,explore freely, and don’t
//               hesitate to reach out if you need anything. Once again, a
//               heartfeltwelcome — we’re excited for what lies ahead!
//             </p>
//           </div>

//           {/* notice message */}
//           <div className="bg-orange200 p-4 rounded-xl">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-base font-medium mb-1 flex items-center gap-2">
//                 <TbExclamationCircle
//                   size={24}
//                   style={{ color: "var(primary)" }}
//                 />{" "}
//                 Notice for “Math Quiz 2025”
//               </span>
//               <button>
//                 <RxCross2 size={20} />
//               </button>
//             </div>
//             <p className="text-sm font-medium">
//               We're truly dead, know that you’re valued and supported every step
//               of the way.Make yourself at home,explore freely, and don’t
//               hesitate to reach out if you need anything. Once again, a
//               heartfeltwelcome — we’re excited for what lies ahead!
//             </p>
//           </div>
//         </div>

//         <div className="mt-8 flex gap-4 flex-wrap">
//           {/* question box */}
//           <div className="bg-cyan300 py-8 px-6 w-full xl:max-w-52 rounded-xl text-center transition hover:bg-cyan350">
//             <span className="text-[15px] font-semibold mb-3 block">
//               Total Announcement Create
//             </span>
//             <h3 className="text-2xl font-semibold">
//               {data?.announcement_create}
//             </h3>
//           </div>
//           {/* question box */}
//           <div className="bg-cyan300 py-8 px-6 w-full xl:max-w-52 rounded-xl text-center transition hover:bg-cyan350">
//             <span className="text-[15px] font-semibold mb-3 block">
//               Total Round Create
//             </span>
//             <h3 className="text-2xl font-semibold">{data?.round_create}</h3>
//           </div>
//           {/* question box */}
//           <div className="bg-cyan300 py-8 px-6 w-full xl:max-w-52 rounded-xl text-center transition hover:bg-cyan350">
//             <span className="text-[15px] font-semibold mb-3 block">
//               Total Price Money
//             </span>
//             <h3 className="text-2xl font-semibold">
//               {data?.total_price_money}
//             </h3>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PresidentProfile;
