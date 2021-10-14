#!/usr/bin/env node

const schedule = require('node-schedule');
const { getMapping } = require("./lib/mapper");
const { serveHTTP, publishToCentral } = require("stremio-addon-sdk")
const addonInterface = require("./addon")
const { PORT, connect } = require("./lib/connect")

serveHTTP(addonInterface, { port: PORT })
.then(res => {
    connect().then((uri) => {
        console.log(`MONGO URI: ${uri}`)
        schedule.scheduleJob('* * 3 * * ', function(){
            console.log('Scraper started');
            getMapping()
          });
    }).catch(console.error)
})
// when you've deployed your addon, un-comment this line
// publishToCentral("https://my-addon.awesome/manifest.json")
// for more information on deploying, see: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/deploying/README.md
