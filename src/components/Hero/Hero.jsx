import BannerSlider from "./BannerSlider";
// import whatsApp from "../../assets/icons/whatsapp.png"
const Hero = ({ onParticipateClick }) => {
  return (
    <div>
      <BannerSlider onScroll={onParticipateClick} />
      {/* hero bottom content */}
      {/* <div className="bg-[var(gray200)] py-12">
        <div className="w-full max-w-[1350px] mx-auto flex items-center justify-center flex-col flex-wrap gap-7">
          <div className="text-center">
            <h2 className="text-black text-4xl font-bold">
              <CountUp end={293} duration={5} /> +{" "}
              <span className="font-normal"></span>
            </h2>
            <p className="text-xl">PARTICIPATION IN QUIZ</p>
          </div>
          <div className="flex items-center flex-wrap justify-center gap-6">
            <Card
              text="If you want to participate quiz then click the button"
              type="student"
              buttonText="Participate Quiz"
            />
            <Card
              text="If you want to contribute/share question for quiz then click the button"
              type="tutor"
              buttonText="Contribute Question"
            /> */}
      {/* <a href="#participateQuiz" className="relative">
              <img
                src={RectangleRight}
                alt="RectangleRight image"
                className="max-w-[260px]"
              />
              <span className="flex items-center gap-2 text-lg font-medium absolute top-3 left-3">
                <FaLightbulb size={20} /> Participate In Quiz
              </span>
            </a>
            <a href="#participateQuiz" className="relative md:-left-12">
              <img
                src={Rectangleleft}
                alt="Rectangleleft image"
                className="max-w-[260px]"
              />
              <span className="flex items-center gap-2 text-lg font-medium absolute top-3 right-3">
                <FaShareSquare size={20} /> Contribute Question
              </span>
            </a> */}
      {/* </div> */}
      {/* <div className="lg:pl-7 lg:border-l-[1px] lg:border-[var(--black600)]">
                        <h2 className="text-[var(--black600)] text-xl font-bold uppercase mb-2 text-center md:text-left">Participate in MyGov Quiz and Earn Loyalty Points</h2>
                        <div className="flex flex-wrap items-center md:items-start justify-center md:justify-start gap-4">
                            <div className="bg-[var(red700)] p-4 flex flex-col justify-center gap-0">
                                <h4 className="text-white font-bold text-sm">HOW DO THE POINTS</h4>
                                <h2 className="text-white font-bold text-xl">GET CALCULATED</h2>
                            </div>
                            <div className="bg-white shadow p-4">
                                <ul className="flex items-center justify-between text-sm mb-1">
                                    <li>POINTS</li>
                                    <li className="text-[var(red700)] font-bold">2000</li>
                                    <li className="text-[var(red700)] font-bold">3000</li>
                                    <li className="text-[var(red700)] font-bold">4000</li>
                                    <li className="text-[var(red700)] font-bold">5000</li>
                                    <li className="text-[var(red700)] font-bold">600</li>
                                </ul>
                                <ul className="flex items-center justify-between gap-4 text-sm">
                                    <li className="mr-4">SCORE</li>
                                    <li>0-84%</li>
                                    <li>84-89%</li>
                                    <li>90-94%</li>
                                    <li>95-99%</li>
                                    <li>100%</li>
                                </ul>
                            </div>
                        </div>
                    </div> */}
      {/* <div className="p-4 bg-orange-100 rounded-xl relative max-w-96 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                        <div className="bg-gradient-to-b from-white to-orange-100 p-8 text-center rounded-lg">
                            <p>
                                Follow the <strong>MyGov WhatsApp</strong> channel to receive information about the winner's announcement.
                            </p>
                            <div className="absolute -top-5 -right-5 w-12 drop-shadow-lg">
                                <img src={whatsApp} alt="What's app messaging icon" />
                            </div>
                            <div className="absolute -bottom-4 left-0 right-0 m-auto drop-shadow-lg">
                                <a href="#" className="bg-[var(red700)] py-1 px-4 text-white font-semibold rounded inline-flex">
                                    SUBSCRIBE NOW
                                </a>
                            </div>
                        </div>
                    </div> */}
      {/* </div> */}
      {/* // </div> */}
    </div>
  );
};
export default Hero;
