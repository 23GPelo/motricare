function myFunction() {
  let sp = SpreadsheetApp.getActiveSpreadsheet()
  let ss = sp.getActiveSheet()
  let data = ss.getDataRange().getValues()
  for(var i = 1; i < data.length; i++){
    var donneesFacture = data[i]
    var doc = DocumentApp.create("facture"+donneesFacture[6].toString());
    var body = doc.getBody()
    body.appendParagraph("Facture n°"+donnesFacture[6]+" - Date: "+donneesFactures[5]);
    body.appendHorizontalRule();
    body.appendParagraph("Nom client: ").setSpacingBefore(24);
    
  }
  var pdf = doc.getAs('application/pdf');
  var file = DriveApp.createFile(pdf)
  DriveApp.removeFile(DriveApp.getFileById(doc.getId()));

  var email = donneesFacture[7];
  var sujet = "Notre facture n°"+donneesFacture[6]+" du "+donneesFacture[5];
  var texte = "Veuillez trouver ci-attachée notre facture n°"+donneesFacture[6]+" du "+donneesFacture[5]+".\nCordialement,\n\nAgathe Durieux";
  var option = {attachments:file};
  GmailApp.sendEmail(email,sujet,texte,option);


}

function checkMultipleAccountIssue(initiator) {
  var userEmailAddress = Session.getEffectiveUser().getEmail();
  if (initiator) {
    // check if effective user matches the initiator (the account who triggered the display of the UI)
    // Due to a Google bug, if user is connected with multiple accounts inside the same browser session
    // google.script.run can be executed by another account than the initiator
    if (initiator != userEmailAddress) {
      console.error({
        message: "Client side calls initiated from wrong account",
        initiator:initiator,
        effectiveUser: userEmailAddress
      });
      var errorMessage = "Multiple accounts issue.<br>";
      errorMessage+= "Please log out of your account " + userEmailAddress;
      errorMessage+= " to use YAMM with the account " +initiator;
      throw new Error(errorMessage);
    }
  }
}