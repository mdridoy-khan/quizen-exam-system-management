import API from "../api/API";

export const UserLogout = async (navigate) => {
  try {
    await API.post("/auth/logout/");

    // Clear user data
    localStorage.removeItem("UserData");
    localStorage.removeItem("accessToken");

    // Redirect to login page
    navigate("/login", { replace: true });
  } catch (error) {
    console.error("Logout failed:", error);

    // Still clear data even if API fails
    localStorage.removeItem("UserData");
    localStorage.removeItem("accessToken");
    navigate("/login", { replace: true });
  }
};
