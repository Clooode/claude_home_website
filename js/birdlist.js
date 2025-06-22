const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../assets/birds');
const outputPath = path.join(__dirname, '../js/birdData.js');

// Map ISO codes to SVG class names
const isoToSvgClass = {
  AU: ['Australia'],
  NZ: ['NZ-NewZealand'],
  US: ['US-UnitedStates'],
  SG: ['Singapore']
};

const birdSightings = {};

function formatJSPath(...segments) {
  return segments.join('/').replace(/\\/g, '/');
}

function walkDirectory() {
  const countries = fs.readdirSync(baseDir);

  countries.forEach(isoCode => {
    const countryPath = path.join(baseDir, isoCode);
    if (!fs.statSync(countryPath).isDirectory()) return;

    const svgClasses = isoToSvgClass[isoCode];
    if (!svgClasses) return;

    const speciesDirs = fs.readdirSync(countryPath);
    speciesDirs.forEach(species => {
      const speciesPath = path.join(countryPath, species);
      if (!fs.statSync(speciesPath).isDirectory()) return;

      const imageFiles = fs.readdirSync(speciesPath)
        .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));

      svgClasses.forEach(svgClass => {
        if (!birdSightings[svgClass]) {
          birdSightings[svgClass] = {};
        }

        if (!birdSightings[svgClass][species]) {
          birdSightings[svgClass][species] = [];
        }

        birdSightings[svgClass][species].push(
          ...imageFiles.map(file =>
            formatJSPath('../assets/birds', isoCode, species, file)
          )
        );
      });
    });
  });
}

walkDirectory();

const output = `export const birdSightings = ${JSON.stringify(birdSightings, null, 2)};\n`;
fs.writeFileSync(outputPath, output);
console.log('✅ birdData.js successfully created with SVG class names!');
