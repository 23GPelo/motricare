class BDD {
  getSeanceById(id){
    var sp = SpreadsheetApp.getActiveSpreadsheet()
    var ss = sp.getSheetByName("seances")
    var data = ss.getDataRange().getValues()
    var filteredData = data.filter(e => e[0] == id)
    var seance = filteredData[0] ? new Seance(...filteredData[0]) : null
    return seance
  } 

  getPrestationById(id){
    var sp = SpreadsheetApp.getActiveSpreadsheet()
    var ss = sp.getSheetByName("prestations")
    var data = ss.getDataRange().getValues()
    var filteredData = data.filter(e => e[0] == id)
    var prestation = filteredData[0] ? new Prestation(...filteredData[0]) : null
    return prestation
  } 

  addInvoice(invoice){
    var sp = SpreadsheetApp.getActiveSpreadsheet()
    var ss = sp.getSheetByName("factures")
    var lastId = ss.getRange(ss.getLastRow(),1).getValue()
    var {invoiceNumber, todaysDate, patient, email, totalAmount, dueDate, link, emailsend} = invoice
    ss.appendRow([lastId+1,invoiceNumber, todaysDate, patient, email,"", totalAmount, dueDate, link, emailsend])
    invoice.seances.forEach(function(seance){
      seance.invoiceNumber = invoiceNumber
      seance.updateSeance(seance)
    });
    return invoice
  }


  
}

function getData(sheetName,header,value){  
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    var values = dataRangeToObject(sheet)  
    if(arguments.length == 3){ values = values.filter(e => e[header] == value) }
    return values;  
  } 
