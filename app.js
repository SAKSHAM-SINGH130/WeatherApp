const http = require('http');
const fs = require('fs');
const requests = require('requests');

const homeFile = fs.readFileSync("index.html", "utf-8");
const replaceVal = (tempVal, orgVal)=>{
  let temprature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temprature = temprature.replace("{%tempmin%}", orgVal.main.temp_min);
  temprature = temprature.replace("{%tempmax%}", orgVal.main.temp_max);
  temprature = temprature.replace("{%location%}", orgVal.name);
  temprature = temprature.replace("{%country%}", orgVal.sys.country);
  temprature = temprature.replace("{%tempstatus%}", orgVal.weather[0].main);
  return temprature;
}




const server = http.createServer((req, res) => {
    //   console.log(req.url);
    if (req.url == "/") {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Kanpur&appid=8d33336b2d8bc460b26e0ef81fefac10')
            .on('data', (chunk) => {
                // console.log(chunk)
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                // console.log(arrData)
                console.log(arrData[0].main.temp);
                const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
                res.write(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);

                // console.log('end');
                res.end();
            });
    }
});

server.listen(5000, "127.0.0.1", () => {
    console.log("listing to the port no 5000");
});