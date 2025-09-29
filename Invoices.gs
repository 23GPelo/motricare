/**
 * Iterates through the worksheet data populating the template sheet with 
 * customer data, then saves each instance as a PDF document.
 * 
 * Called by user via custom menu item.
 */
function processDocuments(cust) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const id = ss.getId();
  const customersSheet = ss.getSheetByName(CUSTOMERS_SHEET_NAME);
  const productsSheet = ss.getSheetByName(PRODUCTS_SHEET_NAME);
  const transactionsSheet = ss.getSheetByName(TRANSACTIONS_SHEET_NAME);
  const invoicesSheet = ss.getSheetByName(INVOICES_SHEET_NAME);
  const invoiceTemplateSheet = ss.getSheetByName(INVOICE_TEMPLATE_SHEET_NAME);

  // Gets data from the storage sheets as objects.
  const customers = dataRangeToObject(customersSheet);
  const products = dataRangeToObject(productsSheet);
  const transactions = dataRangeToObject(transactionsSheet);

  const invoices = [];

  // Iterates for each customer calling createInvoiceForCustomer routine.
  customers.forEach(function (customer) {
    if(!!cust && cust != customer.nom){
      return
    }
    var lastInvoiceNumber = invoicesSheet.getRange(invoicesSheet.getLastRow(), 1).getValue().split("-")[1]
    var newInvoiceNumber = "000"+(Number(lastInvoiceNumber)+1)
    var invoiceNumber = "FA23-"+newInvoiceNumber.substring(newInvoiceNumber.length-4)

    ss.toast(`Creating Invoice for ${customer.nom}`, APP_TITLE, -1);    
    let invoice = createInvoiceForCustomer(customer, products, transactions, invoiceTemplateSheet, id, invoiceNumber);
    if(invoice != false){ invoices.push(invoice); }
  });
  // Writes invoices data to the sheet.
  invoicesSheet.getRange(2, 1, invoices.length, invoices[0].length).setValues(invoices);
}

/**
 * Processes each customer instance with passed in data parameters.
 * 
 * @param {object} customer - Object for the customer
 * @param {object} products - Object for all the products
 * @param {object} transactions - Object for all the transactions 
 * @param {object} invoiceTemplateSheet - Object for the invoice template sheet
 * @param {string} ssId - Google Sheet ID     
 * Return {array} of instance customer invoice data
 */
function createInvoiceForCustomer(customer, products, transactions, templateSheet, ssId) {
  let customerTransactions = transactions.filter(function (transaction) {
    return transaction.patient == customer.nom;
  }); 
  Logger.log("customer transactions : "+customerTransactions)
  // Clears existing data from the template.
  clearTemplateSheet();

  let lineItems = [];
  let totalAmount = 0;
  customerTransactions.forEach(function (lineItem) {
    let lineItemProduct = products.filter(function (product) {
      return product.sku_name == lineItem.prestation;
    })[0];
    const price = parseFloat(lineItemProduct.price).toFixed(2);
    lineItems.push([lineItem.date, '',lineItemProduct.sku_description, '', '', price]);
    totalAmount += parseFloat(price);
  });
  Logger.log(lineItems)
  if(lineItems.length == 0){ return false; } 
  
  // Generates a random invoice number. You can replace with your own document ID method.

  // Calculates dates.
  const todaysDate = new Date().toDateString()
  const dueDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * DUE_DATE_NUM_DAYS).toDateString()
  // Generate invoice number
  const invoiceNumber = generateInvoiceNumber()
  
  // Sets values in the template.
  templateSheet.getRange('F2').setValue(invoiceNumber)
  templateSheet.getRange('F3').setValue(dueDate)
  templateSheet.getRange('F14').setValue(customer.address)
  templateSheet.getRange('F15').setValue(todaysDate)
  templateSheet.getRange('F16').setValue(customer.nom)  
  templateSheet.getRange(23, 1, lineItems.length, 6).setValues(lineItems);
  templateSheet.getRange('F35').setValue(totalAmount)
  
  // Cleans up and creates PDF.
  SpreadsheetApp.flush();
  Utilities.sleep(500); // Using to offset any potential latency in creating .pdf

  const pdf = createPDF(ssId, templateSheet, `Invoice#${invoiceNumber}-${customer.nom}`);
  return [invoiceNumber, todaysDate, customer.nom, customer.email, '', totalAmount, dueDate, pdf.getUrl(), 'No', customerTransaction];
}



/**
 * Creates a PDF for the customer given sheet.
 * @param {string} ssId - Id of the Google Spreadsheet
 * @param {object} sheet - Sheet to be converted as PDF
 * @param {string} pdfName - File name of the PDF being created
 * @return {file object} PDF file as a blob
 */
function createPDF(ssId, sheet, pdfName) {
  const fr = 0, fc = 0, lc = 7, lr = 53;
  const url = "https://docs.google.com/spreadsheets/d/" + ssId + "/export" +
    "?format=pdf&" +
    "size=7&" +
    "fzr=true&" +
    "portrait=true&" +
    "fitw=true&" +
    "gridlines=false&" +
    "printtitle=false&" +
    "top_margin=0.5&" +
    "bottom_margin=0.25&" +
    "left_margin=0.5&" +
    "right_margin=0.5&" +
    "sheetnames=false&" +
    "pagenum=UNDEFINED&" +
    "attachment=true&" +
    "gid=" + sheet.getSheetId() + '&' +
    "r1=" + fr + "&c1=" + fc + "&r2=" + lr + "&c2=" + lc;

  const params = { method: "GET", headers: { "authorization": "Bearer " + ScriptApp.getOAuthToken() } };
  const blob = UrlFetchApp.fetch(url, params).getBlob().setName(pdfName + '.pdf');

  // Gets the folder in Drive where the PDFs are stored.
  const folder = getFolderByName_(OUTPUT_FOLDER_NAME);

  const pdfFile = folder.createFile(blob);
  return pdfFile;
}


/**
 * Sends emails with PDF as an attachment.
 * Checks/Sets 'Email Sent' column to 'Yes' to avoid resending.
 * 
 * Called by user via custom menu item.
 */
function sendEmails() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const invoicesSheet = ss.getSheetByName(INVOICES_SHEET_NAME);
  const invoicesData = invoicesSheet.getRange(1, 1, invoicesSheet.getLastRow(), invoicesSheet.getLastColumn()).getValues();
  const keysI = invoicesData.splice(0, 1)[0];
  const invoices = getObjects(invoicesData, createObjectKeys(keysI));
  ss.toast('Emailing Invoices', APP_TITLE, 1);
  invoices.forEach(function (invoice, index) {

    if (invoice.email_sent != 'Yes') {
      ss.toast(`Emailing Invoice for ${invoice.customer}`, APP_TITLE, 1);

      const fileId = invoice.invoice_link.match(/[-\w]{25,}(?!.*[-\w]{25,})/)
      const attachment = DriveApp.getFileById(fileId);

      let recipient = invoice.email;
      if (EMAIL_OVERRIDE) {
        recipient = EMAIL_ADDRESS_OVERRIDE
      }

      GmailApp.sendEmail(recipient, EMAIL_SUBJECT, EMAIL_BODY, {
        attachments: [attachment.getAs(MimeType.PDF)],
        name: APP_TITLE
      });
      invoicesSheet.getRange(index + 2, 9).setValue('Yes');
    }
  });
}