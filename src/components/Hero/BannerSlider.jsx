import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import API from "../../api/API";
import E from "../../assets/hero/E.svg";
import I from "../../assets/hero/I.svg";
import N from "../../assets/hero/N.svg";
import Q from "../../assets/hero/Q.svg";
import U from "../../assets/hero/U.svg";
import Z from "../../assets/hero/Z.svg";
import Dollar from "../../assets/icons/dollar.svg";
import Trophy from "../../assets/icons/trophy.svg";
import UserPlus from "../../assets/icons/user-plus.svg";

const BannerSlider = ({ onScroll }) => {
  const [totalA, setTotalA] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sliderImages, setSliderImages] = useState([]);

  // hero data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await API.get("/qzz/hero-section");
        console.log("Fetch data:", response.data);
        setTotalA(response.data);
      } catch (err) {
        console.error("API fetch error:", err);
        setError("Data Not Found");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  // hero data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await API.get("/qzz/hero-section");
        console.log("Fetch data:", response.data);
        setTotalA(response.data);
      } catch (err) {
        console.error("API fetch error:", err);
        setError("Data Not Found");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // array of letter images
  const letters = [Q, U, I, Z, E, N];

  return (
    <div className="w-full text-white py-10 md:pt-20 lg:pt-16 2xl:pt-40 pb-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
        {/* Left Side */}
        <div className="space-y-8 text-center">
          {/* <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black drop-shadow-lg text-center">
            Convert your Talent into Money with
          </h1> */}

          {/* QUIZEN Animation with SVG images */}
          <motion.h1
            className="flex justify-center items-center"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {letters.map((img, index) => (
              <motion.img
                key={index}
                src={img}
                alt={`letter-${index}`}
                className="w-12 h-12 sm:w-10 sm:h-10 md:w-14 md:h-14 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 object-contain"
                style={{ transformStyle: "preserve-3d" }}
                variants={{
                  hidden: {
                    opacity: 0,
                    rotateX: -90,
                    scale: 0.5,
                  },
                  visible: {
                    opacity: 1,
                    rotateX: 0,
                    scale: 1,
                    transition: {
                      duration: 0.7,
                      ease: "easeOut",
                    },
                  },
                }}
              />
            ))}
          </motion.h1>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black drop-shadow-lg text-center">
            দেশের সবচেয়ে বড় কুইজ প্ল্যাটফর্ম
          </h2>

          {/* Stats Boxes */}
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {loading ? (
                <p className="col-span-3 text-center text-gray-400">
                  Loading...
                </p>
              ) : error ? (
                <p className="col-span-3 text-center text-red-400">{error}</p>
              ) : (
                <>
                  {/* Participants */}
                  <div className="bg-secondary shadow-sm rounded-2xl p-6 flex items-center space-x-4">
                    <div className="flex items-center justify-center w-14 h-14 bg-[#ECF1FC] rounded-xl">
                      <img src={UserPlus} alt="User Icon" className="max-w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        <CountUp
                          end={totalA?.total_participants || 0}
                          duration={5}
                        />
                        +
                      </h3>
                      <p className="text-gray-100 text-sm">স্কলারশিপ</p>
                    </div>
                  </div>

                  {/* Winners */}
                  <div className="bg-secondary shadow-sm rounded-2xl p-6 flex items-center space-x-4">
                    <div className="flex items-center justify-center w-14 h-14 bg-[#ECF1FC] rounded-xl">
                      <img
                        src={Trophy}
                        alt="Trophy image"
                        className="max-w-6"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        <CountUp end={totalA?.total_winner || 0} duration={5} />
                        +
                      </h3>
                      <p className="text-gray-100 text-sm">মোট বিজয়ী</p>
                    </div>
                  </div>

                  {/* Lacs Prize Money */}
                  <div className="bg-secondary shadow-sm rounded-2xl p-6 flex items-center space-x-4">
                    <div className="flex items-center justify-center w-14 h-14 bg-[#ECF1FC] rounded-xl">
                      <img
                        src={Dollar}
                        alt="dollar image"
                        className="max-w-6"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        <CountUp
                          end={totalA?.total_quizzes || 0}
                          duration={5}
                        />
                        + Lakh
                      </h3>
                      <p className="text-gray-100 text-sm">ক্যাশ প্রাইজ</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stats Boxes */}
          {/* Uncomment and use if needed */}
          {/*
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
            {loading ? (
              <p className="col-span-3 text-center text-gray-400">লোড হচ্ছে...</p>
            ) : error ? (
              <p className="col-span-3 text-center text-red-400">{error}</p>
            ) : (
              <>
                <div className="bg-white/10 p-4 rounded-xl text-center flex items-center justify-center flex-col">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#6366f1]">
                    <CountUp end={totalA?.total_participants || 0} duration={5} /> +
                  </h3>
                  <p className="text-gray-300 text-sm">অংশগ্রহণকারী</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl text-center flex items-center justify-center flex-col">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#22c55e]">
                    <CountUp end={totalA?.total_winner || 0} duration={5} /> +
                  </h3>
                  <p className="text-gray-300 text-sm">বিজয়ী</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl text-center flex items-center justify-center flex-col">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#facc15]">
                    ৳<CountUp end={totalA?.total_quizzes || 0} duration={5} /> লক্ষ +
                  </h3>
                  <p className="text-gray-300 text-sm">পুরস্কার</p>
                </div>
              </>
            )}
          </div>
          */}
        </div>
        {/* Button */}

        <div className="flex items-center justify-center mt-14">
          <Link
            to="/register"
            className="bg-gradient-to-r from-gradientStart to-gradientEnd text-white text-sm font-medium px-5 sm:px-6 py-2 sm:py-2 rounded-md transition duration-300 shadow-lg"
          >
            রেজিস্ট্রেশন করুন
          </Link>
        </div>

        {/* Right Side Slider */}
      </div>
      {/* <div className="relative w-full rounded-xl overflow-hidden banner_slider event_slider mt-8 md:mt-10 lg:mt-12 xl:mt-14 2xl:mt-16">
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <ImageSlider images={sliderImages} />
        )}
      </div> */}
    </div>
  );
};

export default BannerSlider;

// import BannerImage1 from "../../assets/images/banner-images/1.jpg";
// import BannerImage2 from "../../assets/images/banner-images/2.jpg";
// import BannerImage3 from "../../assets/images/banner-images/3.jpg";

// import "swiper/css";
// import "swiper/css/effect-fade";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { Swiper, SwiperSlide } from "swiper/react";

// import { Link } from "react-router-dom";
// import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";

// const BannerSlider = ({ onScroll }) => {
//   return (
//     <div className="banner_slider">
//       <Swiper
//         modules={[Navigation, EffectFade, Pagination, Autoplay]}
//         spaceBetween={30}
//         effect={"fade"}
//         slidesPerView={1}
//         navigation
//         pagination={{ clickable: true }}
//         autoplay={{ delay: 5000 }}
//         loop={true}
//       >
//         {/* Slides */}
//         <SwiperSlide>
//           <div className="hero-slider">
//             <Link to="/" className="block">
//               <img
//                 src={BannerImage1}
//                 alt="Banner Image"
//                 className="w-full h-screen object-fill"
//               />
//             </Link>

//             {/* Overlay */}
//             <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>

//             {/* Content */}
//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center px-4 lg:px-0">
//               <h1 className="text-3xl lg:text-5xl font-extrabold text-[#6366f1] mb-4 drop-shadow-lg">
//                 Your Knowledge, Your Power – Turn It Into Cash!
//               </h1>
//               <h2 className="text-xl lg:text-3xl font-semibold text-white mb-4">
//                 Play Quizzes, Win Big with Quizzy!
//               </h2>
//               <p className="text-gray-200 lg:text-lg mb-8 max-w-xl mx-auto">
//                 Test your knowledge, compete with players worldwide, and claim
//                 exciting cash prizes. Every quiz is a new chance to prove your
//                 skills!
//               </p>

//               {/* Buttons */}
//               <div className="flex flex-col sm:flex-row justify-center gap-4">
//                 <button
//                   onClick={onScroll}
//                   className="bg-[#6366f1] text-white font-bold px-6 py-3 rounded-full hover:bg-[#4f46e5] transition duration-300 shadow-lg"
//                 >
//                   Participate In Quiz
//                 </button>
//                 <Link
//                   to="/register"
//                   state={{ userType: "tutor" }}
//                   className="bg-transparent border-2 border-[#6366f1] text-[#6366f1] font-bold px-6 py-3 rounded-full hover:bg-[#6366f1] hover:text-white transition duration-300 shadow-lg"
//                 >
//                   Share Question
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </SwiperSlide>
//         <SwiperSlide>
//           <div className="hero-slider">
//             <Link to="/" className="block">
//               <img
//                 src={BannerImage2}
//                 alt="Banner Image"
//                 className="w-full h-screen object-fill"
//               />
//             </Link>

//             {/* Overlay */}
//             <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>

//             {/* Content */}
//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center px-4 lg:px-0">
//               <h1 className="text-3xl lg:text-5xl font-extrabold text-[#6366f1] mb-4 drop-shadow-lg">
//                 Your Knowledge, Your Power – Turn It Into Cash!
//               </h1>
//               <h2 className="text-xl lg:text-3xl font-semibold text-white mb-4">
//                 Play Quizzes, Win Big with Quizzy!
//               </h2>
//               <p className="text-gray-200 lg:text-lg mb-8 max-w-xl mx-auto">
//                 Test your knowledge, compete with players worldwide, and claim
//                 exciting cash prizes. Every quiz is a new chance to prove your
//                 skills!
//               </p>

//               {/* Buttons */}
//               <div className="flex flex-col sm:flex-row justify-center gap-4">
//                 <button
//                   onClick={onScroll}
//                   className="bg-[#6366f1] text-white font-bold px-6 py-3 rounded-full hover:bg-[#4f46e5] transition duration-300 shadow-lg"
//                 >
//                   Participate In Quiz
//                 </button>
//                 <Link
//                   to="/register"
//                   state={{ userType: "tutor" }}
//                   className="bg-transparent border-2 border-[#6366f1] text-[#6366f1] font-bold px-6 py-3 rounded-full hover:bg-[#6366f1] hover:text-white transition duration-300 shadow-lg"
//                 >
//                   Share Question
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </SwiperSlide>
//         <SwiperSlide>
//           <div className="hero-slider">
//             <Link to="/" className="block">
//               <img
//                 src={BannerImage3}
//                 alt="Banner Image"
//                 className="w-full h-screen object-fill"
//               />
//             </Link>

//             {/* Overlay */}
//             <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>

//             {/* Content */}
//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center px-4 lg:px-0">
//               <h1 className="text-3xl lg:text-5xl font-extrabold text-[#6366f1] mb-4 drop-shadow-lg">
//                 Your Knowledge, Your Power – Turn It Into Cash!
//               </h1>
//               <h2 className="text-xl lg:text-3xl font-semibold text-white mb-4">
//                 Play Quizzes, Win Big with Quizzy!
//               </h2>
//               <p className="text-gray-200 lg:text-lg mb-8 max-w-xl mx-auto">
//                 Test your knowledge, compete with players worldwide, and claim
//                 exciting cash prizes. Every quiz is a new chance to prove your
//                 skills!
//               </p>

//               {/* Buttons */}
//               <div className="flex flex-col sm:flex-row justify-center gap-4">
//                 <button
//                   onClick={onScroll}
//                   className="bg-[#6366f1] text-white font-bold px-6 py-3 rounded-full hover:bg-[#4f46e5] transition duration-300 shadow-lg"
//                 >
//                   Participate In Quiz
//                 </button>
//                 <Link
//                   to="/register"
//                   state={{ userType: "tutor" }}
//                   className="bg-transparent border-2 border-[#6366f1] text-[#6366f1] font-bold px-6 py-3 rounded-full hover:bg-[#6366f1] hover:text-white transition duration-300 shadow-lg"
//                 >
//                   Share Question
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </SwiperSlide>
//       </Swiper>
//     </div>
//   );
// };
// export default BannerSlider;
