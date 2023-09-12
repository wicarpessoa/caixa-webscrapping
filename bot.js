const puppeteer = require("puppeteer");
const usersAndDepedents = require("./userAndDependents2.json");
const axios = require("axios");

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}${month}${year}`;
}
function parseNumberWithoutCommas(currencyString) {
  const cleanString = currencyString.replace(/[R$\s.]/g, '').replace(',', '.');
  const numericValue = Math.round(parseFloat(cleanString) * 100);
  return numericValue;
}
function parsePercentageString(percentageString) {
  const numberWithoutPercentage = parseInt(percentageString.replace('%', ''))*100;
  return numberWithoutPercentage;
}
function extractAndMultiply(inputString) {
  // Find the position of "Demais prestações"
  const startIndex = inputString.indexOf("Demais prestações");
  if (startIndex === -1) {
    return null; // "Demais prestações" not found
  }

  // Extract the substring containing the numeric value
  const substring = inputString.substring(startIndex + 17); // Skip "Demais prestações"
  
  // Remove commas, dots, and spaces, then convert to a number
  const numericValue = parseFloat(substring.replace(/,|\./g, '').trim());

  // Multiply the number by 100
  const multipliedValue = numericValue * 100;

  return multipliedValue;
}

(async () => {
      for (let i = 59; i < usersAndDepedents.length ; i++) {
        if ( usersAndDepedents[i].id ===5||  usersAndDepedents[i].id ===7||   usersAndDepedents[i].id === 41 || usersAndDepedents[i].id === 45 || usersAndDepedents[i].id === 62 || usersAndDepedents[i].id === 99 || usersAndDepedents[i].id === 120 ||  usersAndDepedents[i].id === 149 ||usersAndDepedents[i].id === 165 ||   usersAndDepedents[i].id === 186  || usersAndDepedents[i].id === 191 || usersAndDepedents[i].id === 193 ||   usersAndDepedents[i].id ===255 || usersAndDepedents[i].id ===258 || usersAndDepedents[i].id ===267||  usersAndDepedents[i].id ===276|| usersAndDepedents[i].id ===298 || usersAndDepedents[i].id ===302 ||  usersAndDepedents[i].id ===305  ||  usersAndDepedents[i].id ===309 ||  usersAndDepedents[i].id ===322 ||  usersAndDepedents[i].id ===325 ||  usersAndDepedents[i].id ===331 ||  usersAndDepedents[i].id ===332 ||  usersAndDepedents[i].id ===334 ||  usersAndDepedents[i].id ===346 ) {
          continue
        }
          const valorDoImovel = "15000000"
          const userDateFormated = new Date(usersAndDepedents[i].dateOfBirth)
          const userDateInput = formatDate(userDateFormated);
          const cpfSemFormatacao = usersAndDepedents[i].cpf.replace(/\D/g, '');
          let dependentCpfSemFormatacao 
          let dependentDateFormated
          let dependentDateInput
          let cpfInput
          let dateOfBirthInput
          if (usersAndDepedents[i].hasOwnProperty("depedent") && usersAndDepedents[i].depedent.cpf !="sem" && usersAndDepedents[i].depedent.date_of_birth &&  usersAndDepedents[i].depedent.user_monthly_income > 0) {
            dependentCpfSemFormatacao = usersAndDepedents[i].depedent.cpf.replace(/\D/g, '');
            dependentDateFormated = new Date(usersAndDepedents[i].depedent.date_of_birth);
            dependentDateInput = formatDate(dependentDateFormated)
          }
          const browser = await puppeteer.launch({headless: false});
          const page = await browser.newPage();
          
          console.log(usersAndDepedents[i]);
          // Navigate the page to a URL
          await page.goto('https://www8.caixa.gov.br/siopiinternet-web/simulaOperacaoInternet.do?method=inicializarCasoUso');
          
          
      await page.waitForTimeout(200);
          
          await Promise.all ([
            await page.waitForSelector("#pessoaF"),
            await page.evaluate(() => {
              document.querySelector("#pessoaF").click();
            })
      ]).catch(e=> console.log(e))
      await page.waitForTimeout(200);
      
      const inputImovel = '#tipoImovel_input';
      const imovelValue = 'res'; 
      await Promise.all([
        await page.click(inputImovel),
        await page.type(inputImovel, imovelValue),
        
      ]);
      await page.keyboard.press('Enter')
      await page.waitForTimeout(1000);
      
      const categoriaImovelSelector = '#grupoTipoFinanciamento_input';
      const categoriaImovelValue = 'Cons'; 
      await Promise.all([
        await page.click(categoriaImovelSelector),
        await page.type(categoriaImovelSelector, categoriaImovelValue)
      ]);

      await page.keyboard.press('Enter');
      
      await page.waitForTimeout(500);
      
      const estadoImovelSelector = '#uf_input';
      const estadoImovelValue = 'CE'; 
      await Promise.all([
        await page.click(estadoImovelSelector),
        await page.type(estadoImovelSelector, estadoImovelValue)
      ]);
      await page.keyboard.press('Enter');
      
      await page.waitForTimeout(500);
      
      const cidadeImovelSelector = '#cidade_input';
      const cidadeImovelValue = 'sao gon'; 
      await Promise.all([
        await page.click(cidadeImovelSelector),
        await page.type(cidadeImovelSelector, cidadeImovelValue)
      ]);
      await page.keyboard.press('Enter');
      
      await page.waitForTimeout(200);
      page.type("#valorImovel", valorDoImovel)
     
      const firstButtonNext = "#btn_next1";
      await page.waitForTimeout(1000);
      await page.click(firstButtonNext);
      await page.waitForTimeout(1000);
      try {

      } catch {
        console.log("error na digitação")
        i--
        continue
      }
      if (usersAndDepedents[i].hasOwnProperty("depedent") && usersAndDepedents[i].depedent.cpf !="sem" && usersAndDepedents[i].depedent.date_of_birth && dependentDateFormated < userDateFormated) {
         cpfInput = dependentCpfSemFormatacao
         dateOfBirthInput = dependentDateInput  
      } else {
         cpfInput = cpfSemFormatacao
         dateOfBirthInput = userDateInput
      }

      if(usersAndDepedents[i].hasOwnProperty("depedent")) {
        await Promise.all ([
          await page.waitForSelector("#icFatorSocial"),
          await page.evaluate(() => {
            document.querySelector("#icFatorSocial").click();
          })
    ]).catch(e=> console.log(e))
      }

      await page.waitForTimeout(1000);
      page.type("#nuCpfCnpjInteressado", String(cpfInput))
      await page.waitForTimeout(100);
      page.type("#nuTelefoneCelular", String(usersAndDepedents[i].cellPhoneNumber))
      await page.waitForTimeout(50);
      
      page.type("#rendaFamiliarBruta", String(usersAndDepedents[i].familyMonthlyIncome))
      await page.waitForTimeout(25);
      
      page.type("#dataNascimento", String(dateOfBirthInput))
      const secondButtonNext = "#btn_next2";
      await page.waitForTimeout(1000);
      try {
        await page.click(secondButtonNext);

      } catch {
        console.log("error na digitação")
       await browser.close(); 
        i--
        continue
      }
      await page.waitForTimeout(1000);
    
      await page.waitForSelector('.group-block-item a.js-form-next[onclick^="simuladorInternet.simular"]');
      await page.click('.group-block-item a.js-form-next[onclick^="simuladorInternet.simular"]');
    
      await page.waitForTimeout(4000);
      
      try {
        await page.waitForSelector('#botaoAlterar', {timeout: 1000});
        
      } catch {
        if (usersAndDepedents[i].familyMonthlyIncome > 600000) {
          console.log("renda muito alta para este financiamento")

        } else {
          console.log("renda baixa para financiar um imovel nesse valor")
        }
     await browser.close();
        continue
      }
      const alterButton = "#botaoAlterar";
      await page.click(alterButton);
      
      
      
      await page.waitForTimeout(2000); 
      
      
      await page.waitForSelector('input#valorEntradaModificado');
      await page.$eval('input#valorEntradaModificado', input => input.value = '');
      
      await page.type('input#valorEntradaModificado', '0');
      
      await page.waitForSelector('input#prazoModificado');
      await page.$eval('input#prazoModificado', input => input.value = '');
      
      await page.type('input#prazoModificado', '420');

      const codSistemaAmortizacaoAlteradoInput = '#codSistemaAmortizacaoAlterado_input';
      const codSistemaAmortizacaoAlteradoValue = 'PRICE'; 
      await Promise.all([
        await page.click(codSistemaAmortizacaoAlteradoInput),
        await page.type(codSistemaAmortizacaoAlteradoInput, codSistemaAmortizacaoAlteradoValue)
      ]);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000)
      
      await page.waitForSelector('div.control-item button.submit-d.submit-blue:nth-child(2)');
      
      await page.click('div.control-item button.submit-d.submit-blue:nth-child(2)');
      await page.waitForTimeout(2000)
      await page.waitForSelector('tbody tr td.lighter.milli');
      await page.waitForTimeout(2000)
      
      // Extract the inner HTML of the specified <td> elements
      const tds = await page.$$('tbody tr td.lighter.milli + td');
      const extractedData = [];
      
      for (const td of tds) {
        const innerHTML = await td.evaluate(element => element.innerHTML.trim());
        extractedData.push(innerHTML);
      }
      await page.waitForTimeout(2000)
      
      await page.waitForSelector('table.simple-table:nth-child(2) tbody tr:nth-child(4) td:nth-child(2) center');
      await page.waitForTimeout(2000)
      
      // Extract and print the content of the targeted <td> 
      const firstIncomeText = await page.$eval('table.simple-table:nth-child(2) tbody tr:nth-child(4) td:nth-child(2) center', element => element.innerText.trim());
      await page.waitForSelector('table.simple-table:nth-child(2) tbody tr:nth-child(5) td:nth-child(2) center');
      console.log(extractAndMultiply(firstIncomeText))
      const lastIncomeText = await page.$eval('table.simple-table:nth-child(2) tbody tr:nth-child(5) td:nth-child(2) center', element => element.innerText.trim());
      let listFirstIncomeText = firstIncomeText.split(" ")
      let listFirstIncomeText2 = listFirstIncomeText[1].split("\n")
      let first_financing_installment = parseNumberWithoutCommas(listFirstIncomeText2[0])

      let listLastIncomeText = lastIncomeText.split(" ")
      let last_financing_installment = parseNumberWithoutCommas(listLastIncomeText[1])


      const immobile_value = parseNumberWithoutCommas(extractedData[0])
      const max_term_months = parseInt(extractedData[1],10)
      const choosen_term_months = parseInt(extractedData[2],10)
      const maximum_financing_quota = parsePercentageString(extractedData[3])
      const financing_entry = parseNumberWithoutCommas(extractedData[4])
      let subsidy
      let financing_amount
      let amortization_system
      if (extractedData[7].includes("input")){
        subsidy = 0
         financing_amount = parseNumberWithoutCommas(extractedData[5])
         amortization_system = extractedData[6]

      } else {
        subsidy = parseNumberWithoutCommas(extractedData[5])
         financing_amount = parseNumberWithoutCommas(extractedData[6])
         amortization_system = extractedData[7]
      }
      console.log(extractedData)
      const requestData = {
                          user_id: usersAndDepedents[i].id,
                          immobile_value, 
                          max_term_months, 
                          choosen_term_months, 
                          maximum_financing_quota, 
                          financing_entry, 
                          subsidy, 
                          financing_amount, 
                          amortization_system, 
                          first_financing_installment, 
                          last_financing_installment}
      axios.post('http://localhost:3000/financing', requestData)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
     await browser.close();
    
      
    }
  })();
  
  
  