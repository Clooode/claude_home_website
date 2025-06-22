const fs = require("fs");
const path = require("path");

function createList(folderName) {
  const dirPath = path.join(__dirname, `../assets/bears/${folderName}`);
  const files = fs
    .readdirSync(dirPath)
    .filter(f => /\.(jpe?g|png|gif|webp)$/i.test(f));

  const jsArray = `const ${folderName}Photos = ${JSON.stringify(files.map(f => `../../assets/bears/${folderName}/${f}`), null, 2)};`;

  fs.writeFileSync(
    path.join(__dirname, `../js/${folderName}List.js`),
    jsArray
  );

  console.log(`✅ Generated ${folderName}List.js`);
}

createList("panda");
createList("sunbear");
