const http = require("http");

const hostname = "127.0.0.1";
const port = 3000;

const options = {
  method: "POST",
};

fetch(
  "https://news.naver.com/main/mainNews.naver?sid1=105&firstLoad=Y",
  options
)
  .then((res) => res.arrayBuffer())
  .then((buffer) => {
    const decoder = new TextDecoder("euc-kr");
    const decodedRes = decoder.decode(buffer);
    const json = JSON.parse(decodedRes);
    const result = JSON.parse(json.airsResult).result["105"].map(
      (value) => value.title
    );
    return result;
  })
  .then((titles) => {
    const server = http.createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=UTF-8");
      res.end(
        `<html><body><ul>${titles.reduce(
          (a, c) => a + `<li>${c}</li>`,
          ""
        )}</ul></body></html>`
      );
    });

    server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  });
