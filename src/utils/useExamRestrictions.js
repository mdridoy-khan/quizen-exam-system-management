// import { useEffect } from "react";

// const useExamRestrictions = (onViolation, quizId) => {
//   useEffect(() => {
//     if (!onViolation || !quizId) {
//       console.log(
//         "useExamRestrictions: onViolation or quizId missing, skipping restrictions"
//       );
//       return;
//     }

//     // Check if exam started
//     const examStarted = sessionStorage.getItem(`quiz_${quizId}_started`);
//     if (!examStarted) {
//       console.log(
//         "useExamRestrictions: Exam not started, skipping restrictions"
//       );
//       return; // Do nothing on first visit
//     }

//     console.log("useExamRestrictions: Exam started, enabling restrictions");

//     // 1. Tab switching / minimize
//     const handleVisibility = () => {
//       if (document.hidden) {
//         console.log("Violation detected: Tab switched or minimized");
//         onViolation("Tab switched or minimized");
//       }
//     };
//     document.addEventListener("visibilitychange", handleVisibility);

//     // 2. Back button
//     const handlePopState = () => {
//       console.log("Violation detected: Tried using back button");
//       onViolation("Tried using back button");
//     };
//     window.addEventListener("popstate", handlePopState);

//     // 3. Reload
//     const handleBeforeUnload = (e) => {
//       e.preventDefault();
//       console.log("Violation detected: Tried to reload page");
//       onViolation("Tried to reload page");
//     };
//     window.addEventListener("beforeunload", handleBeforeUnload);

//     // 4. Screenshot attempt (PrintScreen, Ctrl+S)
//     const handleKeydown = (e) => {
//       if (
//         e.key === "PrintScreen" ||
//         (e.ctrlKey && e.key.toLowerCase() === "s")
//       ) {
//         console.log(`Violation detected: Screenshot attempt (${e.key})`);
//         onViolation("Screenshot attempt");
//       }
//     };
//     window.addEventListener("keydown", handleKeydown);

//     // 5. DevTools detection
//     let lastDevToolsStatus = false;
//     const detectDevTools = setInterval(() => {
//       const devToolsOpen =
//         window.outerWidth - window.innerWidth > 200 ||
//         window.outerHeight - window.innerHeight > 200;
//       if (devToolsOpen && !lastDevToolsStatus) {
//         console.log("Violation detected: DevTools opened");
//         onViolation("DevTools opened");
//       }
//       lastDevToolsStatus = devToolsOpen;
//     }, 2000); // Increased interval to reduce performance impact

//     // Cleanup function
//     return () => {
//       console.log("useExamRestrictions: Cleaning up event listeners");
//       document.removeEventListener("visibilitychange", handleVisibility);
//       window.removeEventListener("popstate", handlePopState);
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//       window.removeEventListener("keydown", handleKeydown);
//       clearInterval(detectDevTools);
//     };
//   }, [onViolation, quizId]);
// };

// export default useExamRestrictions;
