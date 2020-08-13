const axios = require("axios");
const cheerio = require("cheerio");
var fs = require("fs");

console.log("########################################");
console.log("Please wait for ICC Server Response...");

data = [];

let getPlayerDetails = (html, url) => {
  const $ = cheerio.load(html);

  console.log(html);

  let playerID = url.substring(url.split("/", 6).join("/").length + 1);
  // console.log(playerID);

  var name;

  $("h2.rankings-player-bio__name").each((i, elem) => {
    str = $(elem).text();
    name = str;
    console.log(name);
  });

  var nationality;
  $("span.rankings-player-bio__nationality-text").each((i, elem) => {
    str = $(elem).text();
    nationality = str;
  });

  var info = [];

  $("span.rankings-player-bio__entry").each((i, elem) => {
    info[i] = $(elem).text();
  });

  var DOB = info[0];
  var role = info[1];
  var bat = info[2];
  var bowl = info[3];

  var image = `https://resources.pulse.icc-cricket.com/players/210/${playerID}.png`;

  var username = name.replace(/\s+/g, "-").toLowerCase();

  data[playerID] = {
    playerID: playerID,
    name: name,
    username: username,
    nationality: nationality,
    dateOfBirth: DOB,
    role: role,
    battingStyle: bat,
    bowlingStyle: bowl,
    image: image,
  };
  if (data[playerID]) {
    fs.writeFile(`players.json`, JSON.stringify(data), function (err) {
      if (err) {
        console.log(err);
      }
      console.log(`${data[playerID].name}[${playerID}] saved`);
    });
  }
};

for (var i = 1; i <= 2500; i++) {
  axios
    .get(`https://www.icc-cricket.com/rankings/mens/player-rankings/164`)
    .then((response) => {
      getPlayerDetails(response.data, response.config.url);
    })
    .catch((err) => console.log(err));
}
