function rgbToHex(rgb) {
  const hexRGBValues = rgb.map(v => {
    const hexValue = Number(v).toString(16)
    return hexValue.length < 2 ? '0'+hexValue : hexValue
  })
  return hexRGBValues.join('')
};

function getColorBucket(color = [0, 0, 0], regionSize = 16) {
  /** (terms "Region" and "Bucket" are used interchangeablly)
   * Theory:
   * Divide the rgb cube along all 3 dimensions resulting in a 3D map of 16x16x16 regions.
   * The ID of a region is equivalent to the coordinate of its lower-bounds.
   * ie: [0,0,0] represents the region bounded by R=0-15, G=0-15, B=0-15
   * and [80,144,224]  represents the region bounded by R=80-95, G=144-159, B=224-239
   *
   * @param {Array} color - An array of rgb color values ([r,g,b] in order of red, green, blue)
   * @param {number} regionSize - The granularity of the rgb space dissection. 16 divides cleanly the integers cleanly into 4,096 regions (buckets)
   * @returns {Array} representing the HEX value of lower bound coords of the input color, this servers as a region ID.
   */

  if (color.length !== 3 || isNaN(color[0]) || isNaN(color[1]) || isNaN(color[2])) {
    throw('color arg passed is not properly formatted for getRGBRegion()')
  }
  // Divide each coordinate by regionSize (16), round down and then multiply by regionSize to get lower bound coordinate for coordinate dimension.
  const rgbRegionId = color.map(value => Math.floor(value / regionSize) * regionSize);
  const hexRegionId = rgbToHex(rgbRegionId)
  return hexRegionId
}

module.exports ={
  getColorBucket
}