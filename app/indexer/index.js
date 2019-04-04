const path = require("path");
const getColors = require("get-image-colors");
const fs = require("fs");
const { api } = require("../server/search");
const { getColorBucket } = require("../utils");

// Read images from folder 1 at a time and index to elastic via api.
fs.readdirSync(path.join(__dirname, "../images/")).forEach(async image => {
  // get dominant colors from image
  const domninantColors = await getColors(path.join(__dirname, "../images/", image));

  // get color buckets for each dominant color
  const colorBuckets = domninantColors.map(c => getColorBucket(c._rgb.slice(0, 3)));

  // Index the picture
  const result = await api.indexDocument({ colorProfile: colorBuckets, source: source });

  console.log("\n\n\n\n\n result \n", result, "\n\n\n\n\n");

  // extract elastic ID for image and store image using this value.
});
