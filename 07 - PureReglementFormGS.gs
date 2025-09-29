// Boîte de dialogue
function displayPureReglementForm(){
  var sp = SpreadsheetApp.getActiveSpreadsheet()
  var ss = sp.getSheetByName("Fiche patients")
  var id = ss.getRange("B1").getValue()

  var factures = getData('factures');
  Logger.log(factures)

  var patients = []
  for(var i = 0; i < factures.length; i++){
    if(!patients.includes(factures[i].patient)){
      patients.push(factures[i].patient)
    }
  }
  Logger.log(patients)
  
  const template = HtmlService.createTemplateFromFile('07 - PureReglementFormPage');
  template.factures = factures
  template.patients = patients
  template.reglements = getData('modalites');
  template.id = id;

  var html = template.evaluate().setHeight(500)
  SpreadsheetApp.getUi().showModalDialog(html, 'Régler une facture');
}

function ajouterPureReglement(mode,montant, reference, commentaire, patient){
  var sp = SpreadsheetApp.getActiveSpreadsheet()
  var ss = sp.getSheetByName("reglements")
  var id = ss.getRange(ss.getLastRow(), 1).getValue()+1
  var date = new Date()

  ss.appendRow([id, date, patient, mode, reference, montant, commentaire])
  ss.getRange("B:B").setNumberFormat("yyyy-MM-dd")
  return "ça marche"
}

