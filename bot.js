const puppeteer = require("puppeteer");

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://www8.caixa.gov.br/siopiinternet-web/simulaOperacaoInternet.do?method=inicializarCasoUso');

  

  await Promise.all ([
    await page.waitForSelector("#pessoaF"),
  await page.evaluate(() => {
    document.querySelector("#pessoaF").click();
  })
]).catch(e=> console.log(e))
await page.waitForTimeout(1000);
await page.waitForSelector('#tipoImovel_input');
await page.waitForSelector('select#tipoImovel');

// Preencha o valor desejado no input
const inputSelector = '#tipoImovel_input';
const optionValue = 'Re'; // Valor da opção que você deseja selecionar
await Promise.all([
  await page.click(inputSelector),
  await page.type(inputSelector, optionValue)
])

await page.keyboard.press('Enter');
// Aguarde um curto período para garantir que a lista de opções seja atualizada (opcional)
await page.waitForTimeout(1000);

// Selecione a opção desejada no elemento <select>
// page.type("#valorImovel", "17500000")


})();