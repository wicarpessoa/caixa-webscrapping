const puppeteer = require("puppeteer");

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://www8.caixa.gov.br/siopiinternet-web/simulaOperacaoInternet.do?method=inicializarCasoUso');

  await page.screenshot({path:"example.png"})

  await page.waitForSelector("#pessoaJ");
  await page.evaluate(() => {
    document.querySelector("#pessoaJ").click();
  });
  setTimeout(()=> {

  }, "10000")

 
})();