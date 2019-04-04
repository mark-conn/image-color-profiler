const path = require("path");
const getColors = require("get-image-colors");
const fs = require("fs");
const { api } = require("../server/search");
const { getColorBucket, rgbToHex } = require("../utils");
const imageIds = require("../images/ids.json");

const cdnUrl = "https://image.shutterstock.com/z/";

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

// Read images from folder 1 at a time and index to elastic via api.
asyncForEach(imageIds, async imageId => {
  const imageSource = cdnUrl + imageId;

  // get dominant colors from image
  const dominantColors = await getColors(imageSource).then(profile => profile.map(c => c._rgb.slice(0, 3)))

  console.log('\n\n\n\n\n dominantColors \n', dominantColors, '\n\n\n\n\n');

  // get color buckets for each dominant color
  const colorBuckets = dominantColors.map(c => getColorBucket(c));

  const originalColors = dominantColors.map(c => rgbToHex(c));
  // Index the picture
  api.indexDocument({ source: imageSource, colorBuckets, originalColors });

  console.log("\n", imageSource, "   ", colorBuckets, '   ', originalColors, "\n");
});
