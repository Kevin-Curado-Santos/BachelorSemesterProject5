const stored = JSON.parse(localStorage.getItem("appConfigOverride") || "{}");

export const appConfig = {
  mode: stored.mode || "image",
  itemsPerRound: stored.itemsPerRound || 6,
  feedbackMode: stored.feedbackMode || "mic",
  imageMix: stored.imageMix || { ai: 0.5, user: 0.5 },

  supportedModes: {
    image: {
      src: "/mic-check/mic-check.jpg",
      type: "image",
      label: "image",
    },
    video: {
      src: "/mic-check/mic-check.webm",
      type: "video",
      label: "video",
    },
  },

  rounds: stored.rounds || {
    landscapes: 2,
    celeb: 2,
  },

};