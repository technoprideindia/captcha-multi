const express = require('express');
const app = express();
const { Cluster } = require('puppeteer-cluster');
const cors = require('cors')
app.use(cors({
    origin: '*',
}));
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 10,
        puppeteerOptions: {
            headless: false
        }
    });
    await cluster.task(async ({ page, data: url }) => {
        console.log(url);
        const address = url
        
            await page.goto('https://www.google.com.my/imghp');
            console.log('Google Image Search page loaded');
            const button = await page.waitForSelector('div.dRYYxd > div.nDcEnd');
            console.log(button);
            await button.click();
            console.log('Button clicked1');
            await button.click();
            await button.click();
            await button.click();
            console.log('Button clicked2');
            console.log(url);
            await page.$eval('.cB9M7',( el , address )=> el.value = address , address);
            setTimeout(async () => {
              const submit = await page.waitForSelector('div.Qwbd3');
              console.log('----------->', submit);
              await submit.click();
            }, 3000)
            await page.waitForNavigation();
            const textButton = await page.waitForSelector('#ucj-3');
            console.log('<---------,', textButton);
            await textButton.click()
            await page.waitForSelector('.QeOavc')
            let element = await page.waitForSelector('[dir="ltr"]')
           
            const text = await page.evaluate(el => {
              const spanElement = el.querySelector('div.QeOavc > [dir="ltr"]');
              b2 = true
              return spanElement.textContent;
            }, element);
            
            console.log(text);
        return text
          
        

    });

    // setup server
    app.get('/', async function (req, res) {
        if (!req.query.url) {
            return res.end('Please specify url like this: ?url=example.com');
        }
        try {
            const captcha = await cluster.execute(req.query.url);
            console.log("------>",captcha);
            
            res.send({ captcha });
        } catch (err) {
            // catch error
            res.end('Error: ' + err.message);
        }
    });

    app.listen(3000, function () {
        console.log('Screenshot server listening on port 3000.');
    });
})();