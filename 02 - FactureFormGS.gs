// Boîte de dialogue
function displayFactureForm(){
  var sp = SpreadsheetApp.getActiveSpreadsheet()
  var ss = sp.getSheetByName("Fiche patients")
  var id = ss.getRange("C3").getValue()

  var [patients, prestations, seances, date] = chercherInfosFactures();

  const template = HtmlService.createTemplateFromFile('02 - FactureFormPage');
  template.patients = patients;
  template.prestations = prestations;
  template.date = date;
  template.seances = seances;
  template.id = id
  var html = template.evaluate().setHeight(500)
  SpreadsheetApp.getUi().showModalDialog(html, 'Générer une facture');
}

// Infos Patients et Nature
function chercherInfosFactures(){
  // var patients = getData('patients');
  var prestations = getData('prestations');
  var seances = getData('seances','facture',"X");
  seances = seances.filter(e => new Date(e.date) > new Date(2023,1,1))
  var patients = seances.map(e => e.patient).filter((value, index, array) => array.indexOf(value) === index)

  const date = Utilities.formatDate(new Date(),"GMT", 'yyyy-MM-dd');
  Logger.log(seances)
  return [patients, prestations, seances, date];
}

function processFactureCustomer(tab,cust){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ssId = ss.getId();
  const customersSheet = ss.getSheetByName(CUSTOMERS_SHEET_NAME);
  const productsSheet = ss.getSheetByName(PRODUCTS_SHEET_NAME);
  const transactionsSheet = ss.getSheetByName(TRANSACTIONS_SHEET_NAME);
  const invoicesSheet = ss.getSheetByName(INVOICES_SHEET_NAME);
  const invoiceTemplateSheet = ss.getSheetByName(INVOICE_TEMPLATE_SHEET_NAME);

  // Gets data from the storage sheets as objects.
  const products = dataRangeToObject(productsSheet);

  var customers = dataRangeToObject(customersSheet);
  customers = customers.filter(customer => customer.name == cust);
  
  Logger.log("tab : "+tab)
  Logger.log("customers : "+customers)

  var transactions = dataRangeToObject(transactionsSheet);
  transactions = transactions.filter(function (transaction){
    var found = false
    tab.forEach(function(id){
      if(transaction.id == id){ found = true }
    })
    return found
  })
 
  Logger.log("transactions : "+transactions)

  const invoices = [];

  // Iterates for each customer calling createInvoiceForCustomer routine.
  customers.forEach(function (customer){
    ss.toast(`Creating Invoice for ${customer.nom}`, APP_TITLE, -1);
    let invoice = createInvoiceForCustomer(customer, products, transactions, invoiceTemplateSheet, ssId);
    if(invoice != false){ invoices.push(invoice); }
  });
  if(invoices[0] != null){
    invoicesSheet.getRange(invoicesSheet.getLastRow()+1, 1, invoices.length, invoices[0].length).setValues(invoices);
    return invoices[0][0]
  }else{
    return Error
  }  
}

function tes(seances){
  var invoice = new Invoice()
  Logger.log("seances : "+seances)
  for(var i = 0; i < seances.length; i++){
    var seance = new Seance().getSeanceById(seances[i])
    Logger.log(seance)
    invoice.setSeance(seance)
  }
  var bdd = new BDD()
  invoice.setInvoiceNumber()
  invoice.generateLineItems()
  invoice.populateTemplate()
  invoice.createPDF()
  bdd.addInvoice(invoice)
  Logger.log(invoice)
  return invoice.id
}