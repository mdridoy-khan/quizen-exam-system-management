import YourParticipationTable from "./roundAnnouncement/YourParticipationTable";

const AllParticipationList = () => {
  return (
    <div className="px-4">
      <h2 className="text-xl md:text-2xl 2xl:text-3xl text-black font-semibold text-center lg:text-left mb-4">
        Your Participation List
      </h2>
      <YourParticipationTable />
    </div>
  );
};

export default AllParticipationList;
