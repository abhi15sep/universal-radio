var request = require("request");
var HTMLParser = require("node-html-parser");

async function getBody(url) {
  var options = {
    method: "GET",
    url: `${url}`,
    headers: {
      authority: "onlineradiobox.com",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language":
        "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,ro;q=0.6,de;q=0.5",
    },
  };

  return new Promise((resolve, reject) => {
    request(options, function (error, response) {
      if (error) reject(error);
      else {
        resolve(response.body);
      }
    });
  });
}
async function parseBody(body) {
  return new Promise((resolve, reject) => {
    try {
      const root = HTMLParser.parse(body);

      const radioStationList = root.querySelectorAll(".stations__station");

      parsedStations = [];
      radioStationList.map((station) => {
        // let station = {}
        let stationTitle = station.querySelector(".station__title__name")
          .rawText;

        let stationImg = station.querySelectorAll("img")[0].getAttribute("src");

        let stationListeners = station.querySelector(".i-listeners").innerHTML;

        let stationIP = station.querySelector("button").getAttribute("stream");

        parsedStations.push({
          stationTitle,
          stationImg,
          stationListeners,
          stationIP,
        });
      });

      resolve(parsedStations);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = async function urlParser(url) {
  const body = await getBody(`https://onlineradiobox.com/search?q=${url}`);
  const parsedBody = await parseBody(body);
  return parsedBody;
};
