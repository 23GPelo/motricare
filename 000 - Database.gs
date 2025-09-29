function addDatabase(json){
  Logger.log(json)
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  let table = spreadsheet.getSheetByName(json.table)
  let id = table.getRange(table.getLastRow(), 1).getValue()+1
  var date = new Date()
  
  table.appendRow([id, date, json.patient, json.mode, json.reference, json.amount, json.commentaire])
  table.getRange("B:B").setNumberFormat("yyyy-MM-dd")
  return json
}
