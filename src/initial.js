const fs = require("fs");
const download = require("image-downloader");
const basePath = process.cwd();
const layersDir = `${basePath}/layers`;
const fileExtension = "jpg";
const { niftyConfig } = require("./nifty_config");

function downloadImage(filepath, url) {
  return download.image({
    url,
    dest: filepath,
  });
}

const buildLayers = () => {
  // empty layers directory and create new
  if (fs.existsSync(layersDir)) {
    fs.rmdirSync(layersDir, { recursive: true });
  }
  fs.mkdirSync(layersDir);
  const { traitOrder, traits } = niftyConfig;
  traitOrder.forEach((traitKey) => {
    const trait = traits[traitKey];
    const traitDirName = `${layersDir}/${traitKey}`;
    fs.mkdirSync(traitDirName);
    trait.forEach((traitValue) => {
      if (traitValue.label === "None" || !traitValue.img) {
        return;
      }
      // Trait value + Chance of occuring
      const fileName =
        traitValue.label + "#" + `${traitValue.chance * 100}.${fileExtension}`;
      // todo Use Correct file
      if (
        traitValue.img ===
        "https://www.adweek.com/wp-content/uploads/sites/2/2015/09/Temporary.jpg"
      ) {
        downloadImage(`${traitDirName}/${fileName}`, traitValue.img);
      } else {
        fs.writeFileSync(`${traitDirName}/${fileName}`, traitValue.img);
      }
    });
  });
};

buildLayers();
