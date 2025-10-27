import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api/API";
import { PATH } from "../../routes/PATH";

const CategorySelection = () => {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData || {};

  // Capitalize function for category names
  const capitalize = (str) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  // Fetch category list from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await API.get("/auth/category/");
        if (res.status === 200 && Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          throw new Error("Invalid response format from server");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        if (err.response) {
          setError(
            err.response.data?.message ||
              `Server error: ${err.response.status} ${err.response.statusText}`
          );
        } else if (err.request) {
          setError(
            "Network error: Failed to reach the server. Please try again."
          );
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle submit: Navigate back to Registration with selected categories
  const handleSubmit = () => {
    const selectedCategories = selected.map(capitalize);
    navigate(PATH.registration, { state: { categories: selectedCategories } }); // Navigate back to registration
  };

  // Loading UI
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading categories...
      </div>
    );
  }

  // Error UI for category fetching
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-10 lg:py-16">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          What services are you interested in?
        </h1>
        <p className="text-gray-600">
          Select the categories that match your skills or interests. You can
          always update these later.
        </p>
        {/* Progress bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full mt-6 mx-auto">
          <div className="h-2 bg-green-500 rounded-full w-1/3"></div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl mb-10">
        {categories.map((cat, index) => (
          <div
            key={index}
            onClick={() =>
              setSelected((prev) =>
                prev.includes(cat.category_name)
                  ? prev.filter((c) => c !== cat.category_name)
                  : [...prev, cat.category_name]
              )
            }
            className={`border-2 rounded-xl py-8 cursor-pointer text-center transition-all duration-200 ${
              selected.includes(cat.category_name)
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-green-400 hover:bg-green-50"
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {cat.category_name}
            </h3>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100"
        >
          Skip for now
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CategorySelection;

// import { useEffect, useState } from "react";
// import API from "../../api/API";

// const CategorySelection = () => {
//   const [categories, setCategories] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch category list from API
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await API.get("/auth/category/");
//         if (res.status === 200 && Array.isArray(res.data)) {
//           setCategories(res.data);
//         } else {
//           throw new Error("Invalid response format from server");
//         }
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//         if (err.response) {
//           setError(
//             err.response.data?.message ||
//               `Server error: ${err.response.status} ${err.response.statusText}`
//           );
//         } else if (err.request) {
//           setError(
//             "Network error: Failed to reach the server. Please try again."
//           );
//         } else {
//           setError("An unexpected error occurred. Please try again later.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   // Loading & Error UI
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
//         Loading categories...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center min-h-screen text-center">
//         <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-10 lg:py-16">
//       {/* Title */}
//       <div className="text-center mb-10">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//           What services are you interested in?
//         </h1>
//         <p className="text-gray-600">
//           Select the categories that match your skills or interests. You can
//           always update these later.
//         </p>
//         {/* Progress bar */}
//         <div className="w-64 h-2 bg-gray-200 rounded-full mt-6 mx-auto">
//           <div className="h-2 bg-green-500 rounded-full w-1/3"></div>
//         </div>
//       </div>

//       {/* Category Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl mb-10">
//         {categories.map((cat, index) => (
//           <div
//             key={index}
//             onClick={() =>
//               setSelected((prev) =>
//                 prev.includes(cat.category_name)
//                   ? prev.filter((c) => c !== cat.category_name)
//                   : [...prev, cat.category_name]
//               )
//             }
//             className={`border-2 rounded-xl py-8 cursor-pointer text-center transition-all duration-200 ${
//               selected.includes(cat.category_name)
//                 ? "border-green-500 bg-green-50"
//                 : "border-gray-200 hover:border-green-400 hover:bg-green-50"
//             }`}
//           >
//             <h3 className="text-lg font-semibold text-gray-800">
//               {cat.category_name}
//             </h3>
//           </div>
//         ))}
//       </div>

//       {/* Buttons */}
//       <div className="flex gap-4">
//         <button className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100">
//           Skip for now
//         </button>
//         <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
//           Continue
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CategorySelection;
