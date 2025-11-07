import { appConfig } from "./config";

const loadMedia = async (desiredType) => {
  const type = desiredType || appConfig.mode;

  if (type === "image") {
    try {
      const res = await fetch("/api/images");
      const data = await res.json();

      const aiImages =
        (data.ai || []).map((src) => ({
          src,
          key: src,
          type: "image",
          label: "ai",
        })) || [];

      const humanImages =
        (data.human || []).map((src) => ({
          src,
          key: src,
          type: "image",
          label: "human",
        })) || [];

      return [...humanImages, ...aiImages];
    } catch (err) {
      console.error("Error fetching images from API:", err);
      return [];
    }
  }

  if (type === "video") {
    try {
      const res = await fetch("/api/videos");
      const data = await res.json(); // { videos: [...] }

      const videos =
        (data.videos || []).map((src) => ({
          src,
          key: src,
          type: "video",
        })) || [];

      return videos;
    } catch (err) {
      console.error("Error fetching videos from API:", err);
      return [];
    }
  }

  return [];
};

export default loadMedia;
