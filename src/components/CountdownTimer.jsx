import { useEffect, useState } from "react";

const CountdownTimer = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      if (difference <= 0) return null;
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();

      if (!newTimeLeft && !isCompleted) {
        clearInterval(timer);
        setIsCompleted(true);
        if (onComplete) onComplete();
      } else if (newTimeLeft) {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete, isCompleted]);

  if (isCompleted)
    return <div className="text-white font-semibold">Started!</div>;

  return (
    <div className="flex items-center gap-2 font-semibold text-white">
      <div>{timeLeft.days ?? 0}d</div>
      <div>{timeLeft.hours ?? 0}h</div>
      <div>{timeLeft.minutes ?? 0}m</div>
      <div>{timeLeft.seconds ?? 0}s</div>
    </div>
  );
};

export default CountdownTimer;

// import { useEffect, useState } from "react";

// const CountdownTimer = ({ targetDate, onComplete }) => {
//   const [timeLeft, setTimeLeft] = useState({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   });

//   useEffect(() => {
//     const calculateTimeLeft = () => {
//       const difference = new Date(targetDate) - new Date();
//       if (difference <= 0) {
//         return { days: 0, hours: 0, minutes: 0, seconds: 0 };
//       }
//       return {
//         days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//         hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//         minutes: Math.floor((difference / 1000 / 60) % 60),
//         seconds: Math.floor((difference / 1000) % 60),
//       };
//     };

//     setTimeLeft(calculateTimeLeft());
//     const timer = setInterval(() => {
//       const newTimeLeft = calculateTimeLeft();
//       setTimeLeft(newTimeLeft);

//       if (
//         newTimeLeft.days === 0 &&
//         newTimeLeft.hours === 0 &&
//         newTimeLeft.minutes === 0 &&
//         newTimeLeft.seconds === 0
//       ) {
//         clearInterval(timer);
//         if (onComplete) onComplete();
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [targetDate, onComplete]);

//   return (
//     <div className="flex items-center gap-2 font-semibold text-white">
//       <div>{timeLeft.days}d</div>
//       <div>{timeLeft.hours}h</div>
//       <div>{timeLeft.minutes}m</div>
//       <div>{timeLeft.seconds}s</div>
//     </div>
//   );
// };

// export default CountdownTimer;
