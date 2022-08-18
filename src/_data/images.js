const fs = require('fs');
const path = require('path');
const sharp = require("sharp");
const { encode } = require("blurhash");

const encodeImageToBlurhash = path =>
  new Promise((resolve, reject) => {
    sharp(path)
      .raw()
      .ensureAlpha()
      .resize(100, 100, { fit: "inside" })
      .toBuffer((err, buffer, { width, height }) => {
        if (err) return reject(err);
        resolve({
          blurhash: encode(new Uint8ClampedArray(buffer), width, height, 4, 4),
          width,
          height
        });
      });
  });

async function getImages() {
  const files = fs.readdirSync(path.resolve(__dirname, "../../images/"));

  const fileMaps = files
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map(async (file) => {
      return {
        inputPath: file,
        url: `https://raw.githubusercontent.com/distantcam/metagala.xyz/master/images/${file}`,
        ...await encodeImageToBlurhash(path.resolve(__dirname, `../../images/${file}`))
      };
    });

  return Promise.all(fileMaps);
}

module.exports = getImages;
