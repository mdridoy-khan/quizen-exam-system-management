import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import API from "../../api/API";
import shape from "../../assets/shape/testimonial.png";

const Faq = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        const response = await API.get("/setting/faq/");
        console.log("faq response:", response.data);
        setFaqData(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFaqData();
  }, []);

  const handleFaqToggle = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative py-12 sm:py-16 lg:py-20 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 2xl:mt-8">
        {/* Section Header */}
        <h2 className="text-3xl lg:text-4xl 2xl:text-5xl font-bold text-secondary text-center mb-3 sm:mb-4">
          Frequently Asked Questions Works
        </h2>
        <div className="w-20 sm:w-24 h-1 bg-primary mx-auto mb-8 sm:mb-10 rounded-full"></div>

        {/* FAQ Container */}
        <div className="bg-[rgba(210,210,210,0.2)] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10">
          {faqData.length > 0 ? (
            faqData.map((faq, index) => (
              <div
                key={faq.id}
                className={`rounded-xl sm:rounded-2xl mb-3 sm:mb-4 overflow-hidden bg-[#D9D9D9] transition-all duration-300 ${
                  activeFaq === index ? "shadow-lg" : ""
                }`}
              >
                {/* Question */}
                <div
                  className="p-4 sm:p-6 cursor-pointer flex items-center sm:items-start gap-3 sm:gap-4 hover:bg-[rgba(230,230,230,0.5)] transition-all duration-300"
                  onClick={() => handleFaqToggle(index)}
                >
                  {/* Number */}
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary min-w-[40px] sm:min-w-[60px] text-center">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Question Text */}
                  <span className="text-base sm:text-lg md:text-xl font-semibold text-secondary flex-1 mt-1">
                    {faq.faq_question}
                  </span>

                  {/* Icon */}
                  <span
                    className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full text-white bg-primary text-sm sm:text-base md:text-xl transition-transform duration-300`}
                  >
                    {activeFaq === index ? <FaMinus /> : <FaPlus />}
                  </span>
                </div>

                {/* Answer */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    activeFaq === index
                      ? "max-h-[500px] px-4 sm:px-6 py-4 sm:py-6"
                      : "max-h-0 px-6 py-0"
                  }`}
                >
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                    {faq.faq_answer}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm sm:text-base">
              No FAQ Found
            </p>
          )}
        </div>
      </div>

      {/* Background Shape */}
      <div className="absolute top-0 left-0 right-0 z-0">
        <img
          src={shape}
          alt="section shape image"
          className="w-full h-auto object-cover opacity-80"
        />
      </div>
    </section>
  );
};

export default Faq;

// import { useEffect, useState } from "react";
// import { FaChevronDown, FaEnvelope } from "react-icons/fa";
// import API from "../../api/API";

// const Faq = () => {
//   const [activeFaq, setActiveFaq] = useState(null);
//   const [faqData, setFaqData] = useState([]);

//   // fetch faq question and answer data
//   useEffect(() => {
//     const fetchFaqData = async () => {
//       try {
//         const response = await API.get("/setting/faq/");
//         console.log("faq response:", response.data);
//         setFaqData(response.data);
//       } catch (err) {
//         console.err(err);
//       }
//     };
//     fetchFaqData();
//   }, []);

//   // Filter FAQs based on search term and active tab
//   // useEffect(() => {
//   //   const filtered = faqs.filter((faq) => {
//   //     const matchesCategory = activeTab === "all" || faq.category === activeTab;
//   //     const matchesSearch =
//   //       searchTerm === "" ||
//   //       faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //       faq.answer.join(" ").toLowerCase().includes(searchTerm.toLowerCase());
//   //     return matchesCategory && matchesSearch;
//   //   });
//   //   setFilteredFaqs(filtered);
//   // }, [activeTab, searchTerm]);

//   // Handle FAQ accordion toggle
//   const handleFaqToggle = (index) => {
//     setActiveFaq(activeFaq === index ? null : index);
//   };

//   // Handle contact button click
//   const handleContactClick = (type) => {
//     // In a real implementation, this would open a chat or email client
//     alert(
//       `This would open the ${type} contact method in a real implementation`
//     );
//   };

//   return (
//     <div className="bg-gray200 py-8 sm:py-10 lg:py-16 xl:py-20">
//       <div className="container mx-auto px-4">
//         {/* FAQ Header */}
//         <div className="text-center mb-6 lg:mb-8 xl:mb-10">
//           <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray800 relative inline-block">
//             Frequently Asked Questions
//             <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-indigo400 to-purple500 rounded"></span>
//           </h2>
//           <p className="text-base xl:text-lg text-gray500 mt-5 max-w-xl mx-auto">
//             Find answers to common questions about our quiz platform
//           </p>
//         </div>

//         {/* FAQ Controls */}
//         {/* <div className="flex flex-col lg:flex-row gap-5 mb-10">
//           <div className="relative flex-1 min-w-[300px]">
//             <input
//               type="text"
//               className="w-full max-h-[50px] p-4 pl-5 pr-12 border border-gray200 rounded-full bg-white focus:outline-none shadow-[0_8px_20px_rgba(255,255,255,0.12)] focus:border-indigo400"
//               placeholder="Search for questions..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <FaSearch className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray500 cursor-pointer" />
//           </div>
//           <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
//             {["All", "Account", "Quizzes", "Billing", "Technical"].map(
//               (category) => (
//                 <button
//                   key={category}
//                   className={`px-3 py-2 leading-none max-h-[50px] flex items-center justify-center border-2 border-gray200 rounded-full cursor-pointer transition-all duration-300 whitespace-nowrap ${
//                     activeTab === category.toLowerCase()
//                       ? "bg-gradient-to-r from-indigo400 to-purple500 text-white border-transparent bg-no-repeat"
//                       : "bg-white text-gray500 hover:border-indigo400 hover:text-indigo400"
//                   }`}
//                   onClick={() => setActiveTab(category.toLowerCase())}
//                 >
//                   {category}
//                 </button>
//               )
//             )}
//           </div>
//         </div> */}

//         {/* FAQ Container */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//           {faqData.length > 0 ? (
//             faqData.map((faq) => (
//               <div
//                 key={faq.id}
//                 className="border-b border-gray100 last:border-b-0 transition-all duration-300"
//               >
//                 <div
//                   className={`flex justify-between items-center p-6 cursor-pointer hover:bg-gray50 ${
//                     activeFaq === faq.id ? "bg-gray50" : ""
//                   }`}
//                   onClick={() => handleFaqToggle(faq.id)}
//                 >
//                   <h3 className="text-base xl:text-lg font-semibold text-gray800 pr-5">
//                     {faq.faq_question}
//                   </h3>
//                   <div
//                     className={`min-w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
//                       activeFaq === faq.id
//                         ? "bg-gradient-to-r from-indigo400 to-purple500 text-white rotate-180"
//                         : "bg-gray100 text-gray500"
//                     }`}
//                   >
//                     <FaChevronDown />
//                   </div>
//                 </div>
//                 <div
//                   className={`transition-all duration-300 bg-gray50 ${
//                     activeFaq === faq.id
//                       ? "max-h-[500px]"
//                       : "max-h-0 overflow-hidden"
//                   }`}
//                 >
//                   <div className="p-0 px-6 pb-6 text-gray500 leading-relaxed">
//                     {faq.faq_answer}
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>No Faq Found</p>
//           )}
//         </div>

//         {/* Contact Support */}
//         <div className="mt-8 2xl:mt-12 text-center p-10 bg-white rounded-2xl shadow-lg">
//           <h3 className="text-xl font-semibold text-gray800 mb-4">
//             Still have questions?
//           </h3>
//           <p className="text-gray500 mb-6 text-base 2xl:text-lg">
//             Our support team is here to help you with any additional questions
//           </p>
//           <div className="flex flex-wrap gap-5 justify-center">
//             {/* <button
//               className="px-6 py-3 bg-gradient-to-r from-indigo400 to-purple500 text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
//               onClick={() => handleContactClick("live chat")}
//             >
//               <FaComments />
//               Live Chat
//             </button> */}
//             <a href="mailto:mdridoy9902@gmail.com">
//               <button className="px-6 py-3 bg-white text-indigo400 border-2 border-indigo400 rounded-full hover:bg-indigo400 hover:text-white transition-all duration-300 flex items-center gap-2">
//                 <FaEnvelope />
//                 Email Support
//               </button>
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Faq;
