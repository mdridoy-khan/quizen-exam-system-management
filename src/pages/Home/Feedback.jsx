import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Shape from "../../assets/shape/testimonial-shape.png";

const Feedback = () => {
  const feedbackData = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      name: "Rohana",
      designation: "12th",
      description:
        "Ten the hastened steepest feelings pleasant few surprise property. An brother he do colonel against minutes uncivil.",
      rating: 5,
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      name: "Rehmat",
      designation: "BSc",
      description:
        "Can how elinor warmly mrs basket marked. Led raising expense yet demesne weather musical. Me mr what park next busy ever.",
      rating: 5,
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      name: "Shimi Haq",
      designation: "Teacher",
      description:
        "Park next busy ever. Elinor her his secure far twenty eat object. Any far saw size want man.",
      rating: 5,
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      name: "Sabina",
      designation: "Teacher",
      description:
        "Concerns greatest margaret him absolutely entrance nay. Door neat week do find past he. Be no surprise he honoured.",
      rating: 5,
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
      name: "Arif Khan",
      designation: "MBA Student",
      description:
        "Excellent platform for continuous learning. The mentors are friendly and always ready to guide.",
      rating: 4,
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
      name: "Nadia Rahman",
      designation: "Graphic Designer",
      description:
        "The experience was amazing! Learned a lot of new concepts in a fun and interactive way.",
      rating: 5,
    },
    {
      id: 7,
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      name: "Samiul Hasan",
      designation: "Developer",
      description:
        "Loved the design and structure of the program. It’s very easy to follow and implement.",
      rating: 5,
    },
    {
      id: 8,
      image:
        "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&h=400&fit=crop",
      name: "Tanzila Akter",
      designation: "Student",
      description:
        "A great place to grow skills. The team is supportive and the environment feels motivating.",
      rating: 4,
    },
  ];

  return (
    <section
      id="testimonials"
      className="pt-12 sm:pt-16 md:pt-20 xl:pt-28 md:pb-14 xl:pb-20 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 md:mb-14 text-center relative z-20">
          <h2 className="text-3xl lg:text-4xl 2xl:text-5xl font-bold text-secondary mb-2">
            Testimonials
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          speed={6000}
          freeMode={true}
          slidesPerView={1}
          spaceBetween={16}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            480: { slidesPerView: 1 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1280: { slidesPerView: 4, spaceBetween: 28 },
          }}
          className="pb-12 testimonial-slider"
        >
          {feedbackData.map((feedback) => (
            <SwiperSlide key={feedback.id}>
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:-translate-y-2">
                {/* Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <img
                    src={feedback.image}
                    alt={feedback.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-secondary text-base sm:text-lg">
                      {feedback.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {feedback.designation}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-secondary text-white rounded-xl p-4 sm:p-6 relative min-h-[160px] sm:min-h-[180px] md:min-h-[200px]">
                  {/* Rating Stars */}
                  <div className="flex justify-center absolute -top-3 left-0 right-0">
                    <div className="flex gap-1 bg-secondary rounded-md py-1 px-2">
                      {[...Array(feedback.rating)].map((_, i) => (
                        <FaStar
                          key={i}
                          className="text-yellow-400 text-xs sm:text-sm md:text-base"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm md:text-base leading-relaxed mt-4 text-white/90">
                    {feedback.description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Buttons */}
        <div className="flex items-center justify-center mt-8 sm:mt-14 2xl:mt-24">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/login"
              className="px-4 sm:px-6 py-2 text-sm sm:text-base font-medium rounded-lg bg-gradient-to-r from-gradientStart to-gradientEnd text-white transition-all duration-300 hover:opacity-90"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 sm:px-6 py-2 text-sm sm:text-base font-medium rounded-lg border border-gradientStart text-gradientStart hover:bg-gradient-to-r hover:from-gradientStart hover:to-gradientEnd hover:text-white transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Background Shape */}
      <div className="absolute top-0 left-0 right-0 w-full z-0">
        <img
          src={Shape}
          alt="section shape"
          className="w-full h-auto object-cover opacity-80"
        />
      </div>
    </section>
  );
};

export default Feedback;

// import "swiper/css";
// import { Autoplay } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";
// import FeedbackCard from "./FeedbackCard";

// const Feedback = () => {
//   // Sample feedback data (replace with your actual data source)
//   const feedbackData = [
//     {
//       id: 1,
//       title: "Selena Gomez",
//       designation: "Front End Developer",
//       review: "4.5",
//       description:
//         "UI is the saddle, the stirrups, & the reins. UX is the feeling you get being able to ride the horse.",
//     },
//     {
//       id: 2,
//       title: "John Doe",
//       designation: "UI/UX Designer",
//       review: "4.8",
//       description:
//         "The design is intuitive and user-friendly, making the experience seamless and enjoyable.",
//     },
//     {
//       id: 3,
//       title: "Jane Smith",
//       designation: "Backend Developer",
//       review: "4.3",
//       description:
//         "A fantastic platform that makes learning fun and interactive.",
//     },
//     {
//       id: 4,
//       title: "Alex Brown",
//       designation: "Full Stack Developer",
//       review: "4.7",
//       description:
//         "The quizzes are well-structured and the interface is top-notch.",
//     },
//     {
//       id: 5,
//       title: "Emily Davis",
//       designation: "Product Manager",
//       review: "4.6",
//       description: "Great platform for testing skills and gaining insights.",
//     },
//   ];

//   return (
//     <section className="w-full mx-auto py-6 md:py-10 lg:py-12 2xl:py-20 bg-gray100">
//       <h2 className="text-2xl sm:text-3xl xl:text-4xl font-bold text-black600 mb-6 xl:mb-8 text-center">
//         Testimonials
//       </h2>

//       {/* Feedback Slider Right to Left */}
//       <div className="mb-4">
//         <Swiper
//           modules={[Autoplay]}
//           loop={true}
//           freeMode={true}
//           effect="slide"
//           autoplay={{
//             delay: 0,
//             disableOnInteraction: false,
//             reverseDirection: true,
//           }}
//           speed={5000}
//           slidesPerView={1}
//           spaceBetween={16}
//           breakpoints={{
//             640: { slidesPerView: 2 },
//             1024: { slidesPerView: 3 },
//             1280: { slidesPerView: 4 },
//           }}
//           className="feedback_slider"
//         >
//           {feedbackData.map((feedback) => (
//             <SwiperSlide key={feedback.id}>
//               <FeedbackCard
//                 title={feedback.title}
//                 designation={feedback.designation}
//                 review={feedback.review}
//                 description={feedback.description}
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {/* Feedback Slider Left to Right */}
//       <div>
//         <Swiper
//           modules={[Autoplay]}
//           loop={true}
//           effect="slide"
//           freeMode={true}
//           autoplay={{
//             delay: 0,
//             disableOnInteraction: false,
//           }}
//           speed={5000}
//           slidesPerView={1}
//           spaceBetween={16}
//           breakpoints={{
//             640: { slidesPerView: 2 },
//             1024: { slidesPerView: 3 },
//             1280: { slidesPerView: 4 },
//           }}
//           className="feedback_slider"
//         >
//           {feedbackData.map((feedback) => (
//             <SwiperSlide key={feedback.id}>
//               <FeedbackCard
//                 title={feedback.title}
//                 designation={feedback.designation}
//                 review={feedback.review}
//                 description={feedback.description}
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </section>
//   );
// };

// export default Feedback;
