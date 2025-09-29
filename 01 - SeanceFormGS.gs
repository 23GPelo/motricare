// Boîte de dialogue
function displaySeanceForm(){
  var sp = SpreadsheetApp.getActiveSpreadsheet()
  var ss = sp.getSheetByName("Fiche patients")
  var id = ss.getRange("B1").getValue()
  var date = new Date()

  const template = HtmlService.createTemplateFromFile('01 - SeanceFormPage');
  template.patients = getData("patients");
  template.prestations = getData('prestations');
  template.date = Utilities.formatDate(date,"GMT +2","yyyy-MM-dd")
  template.time = (date.getHours() < 10 ? '0' : '')+date.getHours()+":"+(date.getMinutes() < 10 ? '0' : '')+date.getMinutes();
  template.selected = id;

  var html = template.evaluate().setHeight(500)
  SpreadsheetApp.getUi().showModalDialog(html, 'Ajouter une séance');
}


function ajouterSeance(infos){
  var [date,time,prestation,patient,facture,cash] = infos
  
  var seance = new Seance(date,time,prestation,patient).addSeance()
  if(facture === true){
    var invoice = new Invoice().setSeance(seance)
    var bdd = new BDD()
    invoice.setInvoiceNumber()
    invoice.generateLineItems()
    invoice.populateTemplate()
    invoice.createPDF()
    bdd.addInvoice(invoice)
    if(cash === true){
      /*var cash = new Cash()      
      cash.setAmountByPrestation(nature)
      cash.saveInCaisse()
      */
    }
    return seance.id+" - "+invoice.id
  }  
  return seance.id
}

function test(){
  var seance = new Seance(new Date(),new Date(),"classique","Houtekiet Thomas")
  var invoice = new Invoice()
  var bdd = new BDD()
  seance.addSeance()
  invoice.setSeance(seance)
  invoice.setInvoiceNumber()
  invoice.generateLineItems()
  invoice.populateTemplate()
  invoice.createPDF()
  bdd.addInvoice(invoice)
  /*
  var bdd = new BDD()
  var test = bdd.addSeance(seance)
  test.generateInvoice()
  var seances = bdd.getSeanceById("999")
  */
  Logger.log(invoice)
  Logger.log(seance)
}