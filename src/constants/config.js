// const config = {
//   mediaType: 'image',
//   numMediaItems: 6,
// };

// const changeMediaType = (type) => {
//   config.mediaType = type;
// };

// const configFunc = {
//   config,
//   changeMediaType,
// };

// export default configFunc;

const stored = JSON.parse(localStorage.getItem("appConfigOverride") || "{}");

export const appConfig = {
  mode: stored.mode || "image",
  itemsPerRound: stored.itemsPerRound || 6,
  feedbackMode: stored.feedbackMode || "mic",
  imageMix: stored.imageMix || {ai: 0.5, user: 0.5},
};