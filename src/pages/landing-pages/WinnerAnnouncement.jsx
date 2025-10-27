import { useEffect, useState } from "react";
import API from "../../api/API";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import WinnersCard from "../../components/WinnersCard";

const WinnerAnnouncement = () => {
  const [winners, setWinners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // fetch winner data
  const fetchWinners = async (keyword = "") => {
    try {
      setLoading(true);
      const response = await API.get(
        `/anc/winner-anc-list-lp/${keyword ? `?keyword=${keyword}` : ""}`
      );
      console.log("fetchWinners", response.data);
      setWinners(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    fetchWinners();
  }, []);

  // real-time search with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchWinners(searchTerm.trim());
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <div className="bg-body-gradient min-h-screen">
      {/* Common header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 sm:my-16 lg:my-20">
        <div className="flex items-center justify-center flex-col md:flex-row md:justify-between mb-4 xl:mb-8">
          <h2 className="text-2xl xl:text-4xl font-bold mb-4 lg:mb-0">
            All Announcement Winners
          </h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search here..."
              className="border border-primary rounded-lg py-1 px-2 shadow-none outline-none appearance-none bg-transparent focus:border-primary"
            />
          </div>
        </div>

        {/* loader show korte chaile */}
        {loading ? (
          <p className="text-center text-lg font-medium">Loading...</p>
        ) : (
          <WinnersCard winnerInfo={winners} />
        )}
      </div>

      {/* Common footer */}
      <Footer />
    </div>
  );
};

export default WinnerAnnouncement;
