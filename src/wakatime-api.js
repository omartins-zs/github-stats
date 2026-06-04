import axios from "axios";

/**
 * Fetch WakaTime data for a given username.
 */
export const fetchWakatimeStats = async (username) => {
  if (!username) {
    throw new Error("Missing username parameter");
  }

  try {
    const { data } = await axios.get(
      `https://wakatime.com/api/v1/users/${username}/stats?is_including_today=true`
    );

    return data.data;
  } catch (err) {
    if (err?.response?.status < 200 || err?.response?.status > 299) {
      throw new Error(`Could not resolve to a User with the login of '${username}'`);
    }
    throw new Error("Failed to fetch WakaTime stats");
  }
};
