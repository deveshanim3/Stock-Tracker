import axios from "axios";

export const refreshAccessToken = async () => {
  try {
    const res = await axios.post(
      "http://localhost:3000/auth/refresh",
      {},
      { withCredentials: true } 
    );

    const { accessToken, email } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("email", JSON.stringify(email));

    return { accessToken, email };
  } catch (err) {
    console.error("Refresh token failed:", err);
    return null;
  }
};
