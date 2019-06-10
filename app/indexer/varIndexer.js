const getColors = require("get-image-colors");
const { api } = require("../server/elastic-api");
const { getColorBucket, rgbToHex } = require("../utils");
const rp = require('request-promise');

// const cdnUrl = "https://image.shutterstock.com/z/";

const getImageUrl = id => `https://cdn.shutterstock.com/shutterstock/photos/${id}/mosaic_250/${id}.jpg`;

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const imageIds = require(`./${process.argv[2]}.json`);

console.log("\n\n process.argv \n", process.argv[2], "\n\n");

// Read images from folder 1 at a time and index to elastic via api.
asyncForEach(imageIds, async imageIdDotJpg => {
  const imageId = /[^.]*/.exec(imageIdDotJpg)[0];
  const imageSource = getImageUrl(imageId);

  await rp(imageSource)
    .then(async () => {
      // get dominant colors from image
      const dominantColors = await getColors(imageSource).then(profile =>
        profile.map(c => c._rgb.slice(0, 3))
      );

      // get color buckets for each dominant color
      const hiResBuckets = dominantColors.map(c => getColorBucket(c));
      const lowResBuckets = dominantColors.map(c => getColorBucket(c, 32));
      const ultraLoBuckets = dominantColors.map(c => getColorBucket(c, 64));

      const originalColors = dominantColors.map(c => rgbToHex(c));
      
      // Index the picture
      api.indexDocument({
        source: imageSource,
        hiResBuckets,
        lowResBuckets,
        ultraLoBuckets,
        originalColors
      });

      console.log("\n", imageSource, "   ", hiResBuckets, "   ", lowResBuckets, "   ", originalColors, "\n");
    })
    .catch(function (err) {
      console.log('invalid image', err)
    });
});
