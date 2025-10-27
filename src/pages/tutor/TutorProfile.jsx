import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { TbExclamationCircle } from "react-icons/tb";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import API from "../../api/API";
import ImageSlider from "../../components/ImageSlider";
import UserProfileCard from "../../components/UserProfileCard";

const TutorProfile = () => {
  const [tutorData, setTutordata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sliderImages, setSliderImages] = useState([]);
  const [messageClose, setMessageClose] = useState({
    welcomeMessage: true,
    noticeMessage: true,
  });
  // hero slider images fetch
  useEffect(() => {
    const getSlider = async () => {
      try {
        setLoading(true);
        const response = await API.get("/setting/slider-image/");
        console.log("Fetch slider:", response.data);
        setSliderImages(response.data);
      } catch (err) {
        console.error("API fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    getSlider();
  }, []);

  useEffect(() => {
    const fetchTutorData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await API.get("/anc/tutor-dashboard-information/");
        setTutordata(response?.data?.data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchTutorData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <FaSpinner className="animate-spin text-4xl text-cyan-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-red-500 text-lg">
        {error}
      </div>
    );
  }
  // handle message modal close
  const handleMessageClose = (modalName) => {
    setMessageClose((prev) => ({ ...prev, [modalName]: false }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* profile card */}
      <div className="md:col-span-1">
        <UserProfileCard />
      </div>

      {/* profile details content */}
      <div className="md:col-span-2">
        {/* banner slider */}
        {/* <div className="banner_slider">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            className="rounded-xl overflow-hidden mb-6"
          >
            <SwiperSlide>
              <img
                src={SliderImage}
                alt="slide 1"
                className="h-60 object-cover bg-no-repeat bg-cover"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src={SliderImage}
                alt="slide 2"
                className="h-60 object-cover bg-no-repeat bg-cover"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src={SliderImage}
                alt="slide 3"
                className="h-60 object-cover bg-no-repeat bg-cover"
              />
            </SwiperSlide>
          </Swiper>
        </div> */}
        <div className="banner_slider event_slider">
          <ImageSlider images={sliderImages} singleView />
        </div>

        <div className="space-y-2">
          {/* welcome message */}
          {messageClose.welcomeMessage && (
            <div className="bg-[#74b9ff] bg-opacity-30 p-4 rounded-xl mb-4 shadow">
              <div className="text-end flex items-center justify-between border-b border-indigo-50">
                <span className="text-base font-medium block mb-1">
                  Welcome,
                </span>
                <button onClick={() => handleMessageClose("welcomeMessage")}>
                  <RxCross2 size={20} />
                </button>
              </div>
              <p className="text-sm font-medium mt-1">
                We're truly dead, know that you’re valued and supported every
                step of the way.Make yourself at home,explore freely, and don’t
                hesitate to reach out if you need anything. Once again, a
                heartfeltwelcome — we’re excited for what lies ahead!
              </p>
            </div>
          )}

          {/* notice message */}
          {messageClose.noticeMessage && (
            <div className="bg-orange-100 p-4 rounded-xl mb-8 shadow">
              <div className="flex items-center justify-between border-b border-orange-50">
                <span className="text-base font-medium mb-1 flex items-center gap-2">
                  <TbExclamationCircle size={24} style={{ color: "primary" }} />{" "}
                  Notice
                </span>
                <button onClick={() => handleMessageClose("noticeMessage")}>
                  <RxCross2 size={20} />
                </button>
              </div>
              <p className="text-sm font-medium mt-1">
                We're truly dead, know that you’re valued and supported every
                step of the way.Make yourself at home,explore freely, and don’t
                hesitate to reach out if you need anything. Once again, a
                heartfeltwelcome — we’re excited for what lies ahead!
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-4 flex-wrap">
          {/* question box */}
          <div className="bg-[#74b9ff] bg-opacity-30 py-8 px-6 w-full xl:max-w-52 rounded-xl text-center transition hover:bg-cyan350 shadow">
            <span className="text-[15px] font-semibold mb-3 block">
              Total Pending Question
            </span>
            <h3 className="text-2xl font-semibold">
              {tutorData?.pending_question}
            </h3>
          </div>

          {/* question box */}
          <div className="bg-[#74b9ff] bg-opacity-30 py-8 px-6 w-full xl:max-w-52 rounded-xl text-center transition hover:bg-cyan350 shadow">
            <span className="text-[15px] font-semibold mb-3 block">
              Total Selected Question
            </span>
            <h3 className="text-2xl font-semibold">
              {tutorData?.selected_question}
            </h3>
          </div>

          {/* question box */}
          <div className="bg-[#74b9ff] bg-opacity-30 py-8 px-6 w-full xl:max-w-52 rounded-xl text-center transition hover:bg-cyan350 shadow">
            <span className="text-[15px] font-semibold mb-3 block">
              Total Shared Question
            </span>
            <h3 className="text-2xl font-semibold">
              {tutorData?.shared_question}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;

// import { useEffect, useState } from "react";
// import { RxCross2 } from "react-icons/rx";
// import { TbExclamationCircle } from "react-icons/tb";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { Navigation, Pagination } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";
// import API from "../../api/API";
// import SliderImage from "../../assets/images/banner-images/slide1.jpg";
// import UserProfileCard from "../../components/UserProfileCard";

// const TutorProfile = () => {
//   const [tutorData, setTutordata] = useState();

//   useEffect(() => {
//     const fetchTutorData = async () => {
//       try {
//         const response = await API.get("/anc/tutor-dashboard-information/");
//         setTutordata(response?.data?.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     fetchTutorData();
//   }, []);

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
//       {/* profile card */}
//       <div>
//         <UserProfileCard />
//       </div>

//       {/* profile details content */}
//       <div className="w-full lg:max-w-[400px] xl:max-w-2xl 2xl:max-w-4xl">
//         {/* banner slider */}
//         <div className="banner_slider">
//           <Swiper
//             modules={[Navigation, Pagination]}
//             navigation
//             pagination={{ clickable: true }}
//             spaceBetween={20}
//             slidesPerView={1}
//             className="rounded-xl overflow-hidden mb-6"
//           >
//             <SwiperSlide>
//               <img
//                 src={SliderImage}
//                 alt="slide 1"
//                 className="h-60 object-cover bg-no-repeat bg-cover"
//               />
//             </SwiperSlide>
//             <SwiperSlide>
//               <img
//                 src={SliderImage}
//                 alt="slide 2"
//                 className="h-60 object-cover bg-no-repeat bg-cover"
//               />
//             </SwiperSlide>
//             <SwiperSlide>
//               <img
//                 src={SliderImage}
//                 alt="slide 3"
//                 className="h-60 object-cover bg-no-repeat bg-cover"
//               />
//             </SwiperSlide>
//           </Swiper>
//         </div>

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
//           <div className="bg-orange-200 p-4 rounded-xl">
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
//               Total Pending Question
//             </span>
//             <h3 className="text-2xl font-semibold">
//               {tutorData?.pending_question}
//             </h3>
//           </div>
//           {/* question box */}
//           <div className="bg-cyan300 py-8 px-6 w-full xl:max-w-52 rounded-xl text-center transition hover:bg-cyan350">
//             <span className="text-[15px] font-semibold mb-3 block">
//               Total Selected Question
//             </span>
//             <h3 className="text-2xl font-semibold">
//               {tutorData?.selected_question}
//             </h3>
//           </div>
//           {/* question box */}
//           <div className="bg-cyan300 py-8 px-6 w-full xl:max-w-52 rounded-xl text-center transition hover:bg-cyan350">
//             <span className="text-[15px] font-semibold mb-3 block">
//               Total Shared Question
//             </span>
//             <h3 className="text-2xl font-semibold">
//               {tutorData?.shared_question}
//             </h3>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TutorProfile;
