const path = require("path");
const getColors = require("get-image-colors");
const fs = require("fs");
const { api } = require("../server/search");
const { getColorBucket } = require("../utils");
const imageIds = require('../images/ids.json')

const cdnUrl = 'https://image.shutterstock.com/z/'

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

// Read images from folder 1 at a time and index to elastic via api.
asyncForEach(imageIds, async (imageId) => {
  const imageSource = cdnUrl+imageId

  // get dominant colors from image
  const domninantColors = await getColors(imageSource);

  // get color buckets for each dominant color
  const colorBuckets = domninantColors.map(c => getColorBucket(c._rgb.slice(0, 3)));

  // Index the picture
  api.indexDocument({ colorProfile: colorBuckets, source: imageSource });
  console.log('\n', imageSource, '   ', colorBuckets, '\n')
})
