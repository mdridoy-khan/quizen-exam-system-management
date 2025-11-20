// import { useState, useEffect } from 'react';
// import fluent_mdl2_embedIcon from '../../src/Assets/icon/fluent-mdl2_embed.png';
// import { useTranslation } from 'react-i18next';
// import logo from '../Assets/logo/tenderwise-logo.png'
// import useOutsideClick from './../hooks/useOutsideClick';
// import {
//   FaFacebookMessenger,
//   FaWhatsapp,
//   FaLinkedin,
//   FaFacebook,
//   FaTwitter,
// } from 'react-icons/fa';
// // Import configurations
// const SocialShare = ({ isOpen, onClose, tender_id }) => {
//   const [copied, setCopied] = useState(false);
//   // Construct sharing URLs
//   const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
//     tenderUrl
//   )}`;
//   const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//     tenderUrl
//   )}`;
//   const messengerUrl = https://m.me/?text=${encodeURIComponent(tenderUrl)};
//   const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(
//     tenderUrl
//   )}`;
//   const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
//     tenderUrl
//   )}`;

//   const handleCopyLink = () => {
//     navigator.clipboard.writeText(tenderUrl).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 10000);
//     });
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       <div
//         className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
//           isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
//         } bg-black bg-opacity-5`}
//       >
//         <div
//           //  ref={modalRef}
//           className={`bg-white rounded-lg w-11/12 max-w-xl p-3 transform transition-transform duration-300 ${
//             isOpen ? 'scale-100' : 'scale-95'
//           }`}
//         >
//           <div className="flex justify-between items-center mb-0 lg:mb-0">
//             <div></div>
//             <span
//               className="text-black text-2xl font-bold cursor-pointer hover:text-gray-600"
//               onClick={onClose}
//               aria-label="Close modal"
//             >
//               &times;
//             </span>
//           </div>
//           <div className="flex justify-center mb-2">
//             <img src={logo} alt="" className="h-10" />
//           </div>
//           <h2
//             id="modal-title"
//             className="text-sm md:text-xl font-semibold text-center"
//           >
//             {t('Click on any link to share')}
//           </h2>

//           {/* <h2 className="mb-4 md:mb-5">{t('Share')}</h2> */}
//           <div className="flex gap-4 justify-center py-2">
//             <button
//               onClick={handleCopyLink}
//               className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
//             >
//               <img src={fluent_mdl2_embedIcon} alt="Embed Icon" />
//             </button>
//             <a
//               href={whatsappUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 text-green-600 hover:text-green-500"
//             >
//               {/* <img src={whatsappIcon} alt="WhatsApp Icon" className="w-16" /> */}
//               <FaWhatsapp className="text-[44px]" />
//             </a>

//             <a
//               href={facebookUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 text-blue-700 hover:text-blue-600"
//             >
//               <FaFacebook className="text-[40px]" />
//             </a>
//             <a
//               href={messengerUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 text-blue-700 hover:text-blue-600"
//             >
//               <FaFacebookMessenger className="text-[40px]" />
//             </a>
//             <a
//               href={linkedInUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 text-blue-700 hover:text-blue-600"
//             >
//               {/* <img src={linkedinIcon} alt="LinkedIn Icon" className="w-14" /> */}
//               <FaLinkedin className="text-[40px]" />
//             </a>
//             {/* <a
//               href={twitterUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 text-gray-700 hover:text-blue-500"
//             >
//               <FaTwitter className="text-[40px]" />
//             </a> */}
//             {/* <img src={xIcon} alt="Twitter Icon" className="w-14" /> */}
//           </div>

//           <div className="flex justify-center gap-0 text-xs">
//             <input
//               type="text"
//               value={tenderUrl}
//               readOnly
//               className="p-2 w-4/5 rounded-l-lg border border-gray-600 "
//             />
//             <button
//               onClick={handleCopyLink}
//               className="bg-DefaultColor hover:bg-DefaultHoverColor text-white px-4 py-2 rounded-r-lg"
//             >
//               {copied ? t('Copied') : t('Copy')}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SocialShare;

// import {
//   FaFacebookF,
//   FaLink,
//   FaLinkedinIn,
//   FaWhatsapp,
//   FaXTwitter,
// } from "react-icons/fa6";
// import { toast } from "react-toastify";

// const SocialShare = ({ url, title }) => {
//   const encodedUrl = encodeURIComponent(url);
//   const encodedTitle = encodeURIComponent(title);

//   const handleShare = (platform) => {
//     let shareUrl = "";

//     switch (platform) {
//       case "facebook":
//         shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
//         break;
//       case "twitter":
//         shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
//         break;
//       case "linkedin":
//         shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
//         break;
//       case "whatsapp":
//         shareUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
//         break;
//       case "copy":
//         navigator.clipboard.writeText(url);
//         toast.success("Link copied to clipboard!");
//         return;
//       default:
//         return;
//     }

//     window.open(shareUrl, "_blank", "noopener,noreferrer");
//   };

//   return (
//     <div className="flex gap-3">
//       <button
//         onClick={() => handleShare("facebook")}
//         className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
//       >
//         <FaFacebookF />
//       </button>
//       <button
//         onClick={() => handleShare("twitter")}
//         className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
//       >
//         <FaXTwitter />
//       </button>
//       <button
//         onClick={() => handleShare("linkedin")}
//         className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition"
//       >
//         <FaLinkedinIn />
//       </button>
//       <button
//         onClick={() => handleShare("whatsapp")}
//         className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
//       >
//         <FaWhatsapp />
//       </button>
//       <button
//         onClick={() => handleShare("copy")}
//         className="p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition"
//       >
//         <FaLink />
//       </button>
//     </div>
//   );
// };

// export default SocialShare;

import { useEffect, useRef } from "react";
import {
  FaFacebookF,
  FaFacebookMessenger,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const SocialShare = ({ url, title, isOpen, onClose }) => {
  // Return null if modal is not open
  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const inputRef = useRef(null);

  // Handle social media sharing
  const handleShare = (platform) => {
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        // Facebook doesn't allow custom text formatting; title and URL are handled by the page's meta tags
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        // Use %0A for a line break to separate title and URL
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}%0A${encodedUrl}`;
        break;
      case "linkedin":
        // LinkedIn uses meta tags for title; we can only pass the URL
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "whatsapp":
        // Use %0A for a line break to separate title and URL
        shareUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%0A${encodedUrl}`;
        break;
      case "messenger":
        // Messenger doesn't support custom text formatting; URL is shared
        shareUrl = `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=YOUR_APP_ID&redirect_uri=${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    if (inputRef.current) {
      inputRef.current.select();
      navigator.clipboard
        .writeText(url)
        .then(() => {
          toast.success("Link copied to clipboard!", {
            position: "top-right",
            autoClose: 2000,
          });
        })
        .catch((err) => {
          toast.error("Failed to copy link!", {
            position: "top-right",
            autoClose: 2000,
          });
        });
    }
  };

  // Close modal on Esc key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-500">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg mx-4 shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Share This Quiz</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
            title="Close"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={() => handleShare("facebook")}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
            title="Share on Facebook"
          >
            <FaFacebookF className="text-lg" />
          </button>

          <button
            onClick={() => handleShare("twitter")}
            className="p-2 rounded-full bg-black assoluto text-white hover:bg-gray-900 transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
            title="Share on X"
          >
            <FaXTwitter className="text-lg" />
          </button>

          <button
            onClick={() => handleShare("linkedin")}
            className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
            title="Share on LinkedIn"
          >
            <FaLinkedinIn className="text-lg" />
          </button>

          <button
            onClick={() => handleShare("whatsapp")}
            className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
            title="Share on WhatsApp"
          >
            <FaWhatsapp className="text-lg" />
          </button>

          <button
            onClick={() => handleShare("messenger")}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
            title="Share on Messenger"
          >
            <FaFacebookMessenger className="text-lg" />
          </button>
        </div>

        {/* URL Input Field and Copy Button */}
        <div className="flex items-center gap-3 mt-4">
          <input
            ref={inputRef}
            type="text"
            value={url}
            readOnly
            className="flex-1 p-1.5 text-sm text-gray-600 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
            title="Quiz URL"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-1.5 text-sm font-semibold text-white bg-secondary rounded-lg hover:bg-primary transition-all duration-200 hover:shadow-md"
            title="Copy link"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialShare;
