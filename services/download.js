const fs = require("fs");
const request = require("request-promise-native");
config = require("./config");

async function downloadPDF(pdfURL, outputFilename) {
    let pdfBuffer = await request.get({uri: pdfURL, encoding: null});
    console.log("Writing downloaded PDF file to " + outputFilename + "...");
    fs.writeFileSync(outputFilename, pdfBuffer);
}

downloadPDF("https://drewsfoodmenubot.herokuapp.com/download/todays_feed.pdf", __dirname + "/../public/Todays_Feed.pdf");