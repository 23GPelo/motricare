const DATA_SHEET = "patients";
/*
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('WebAppBoot');
}
*/
function uuid() {
  var uuid_array = [];
  var ss= SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName(DATA_SHEET);
  var getLastRow = dataSheet.getLastRow();
  if(getLastRow > 1) {
    var uuid_values = dataSheet.getRange(2, 1, getLastRow - 1, 1).getValues(); 
    for(i = 0; i < uuid_values.length; i++)
    {
      uuid_array.push(uuid_values[i][0]);
    }
    var x_count = 0;
    do {
    var y = 'false';
    var uuid_value = Utilities.getUuid(); 

    if(uuid_array.indexOf(uuid_value) == -1.0)
    {
      y = 'true';
      Logger.log(uuid_value);
      return uuid_value;   
    } 
    x_count++;
    } while (y == 'false' && x_count < 5);
  } else {
    return Utilities.getUuid();
  }
}

function UpdateRecord(record_id, firstname, lastname, email, street, city, state, zip) {
  var ss= SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName(DATA_SHEET); 
  var getLastRow = dataSheet.getLastRow();
  var table_values = dataSheet.getRange(2, 1, getLastRow - 1, 8).getValues();
  for(i = 0; i < table_values.length; i++)
  {
    if(table_values[i][0] == record_id)
    {
      dataSheet.getRange(i+2, 2).setValue(firstname);
      dataSheet.getRange(i+2, 3).setValue(lastname);
      dataSheet.getRange(i+2, 4).setValue(email);
      dataSheet.getRange(i+2, 5).setValue(street);
      dataSheet.getRange(i+2, 6).setValue(city);
      dataSheet.getRange(i+2, 7).setValue(state);
      dataSheet.getRange(i+2, 8).setValue(zip);
    }
    
  }
  return 'SUCCESS';
}

function DeleteRecord(record_id)
{
  var ss= SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName(DATA_SHEET); 
  var getLastRow = dataSheet.getLastRow();
  var table_values = dataSheet.getRange(2, 1, getLastRow - 1, 8).getValues();
  for(i = 0; i < table_values.length; i++)
  {
    if(table_values[i][0] == record_id)
    {
      var rowNumber = i+2;
      dataSheet.getRange('A' + rowNumber +':I' + rowNumber).clearContent();
      
    }   
  }
  return 'SUCCESS';
}

function AddRecord(firstname, lastname, email, street, city, state, zip) {
  var uniqueID = uuid();
  var found_record = false;
  var ss= SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName(DATA_SHEET);
  var getLastRow = dataSheet.getLastRow();
  for(i = 2; i < getLastRow; i++)
  {
    if(dataSheet.getRange(i, 1).getValue() == '')
    {
      dataSheet.getRange('A' + i + ':I' + i).setValues([[uniqueID, firstname, lastname, email, new Date(), street, city, state, zip]]);
      found_record = true;
      break;
    }
  }
  if(found_record == false)
  { 
    dataSheet.appendRow([uniqueID, firstname, lastname, email, new Date(), street, city, state, zip]);
  }
  return 'SUCCESS';
  
}
function test(){
  SearchRecords("","","","","","","")
}

function searchRecords(firstname, lastname, email, street, city, state, zip) {      

  var returnRows = [""];
  var allRecords = getRecords();

  allRecords.forEach(function(value, index) {

    var evalRows = [];
    if(firstname == "") {
      evalRows.push('true');
    }else{
      if(value[1].toUpperCase() == firstname.toUpperCase()) {
        evalRows.push('true');
      } else {
        evalRows.push('false');
      }
    }

    if(lastname == "") {
      evalRows.push('true');
    }else {
        if(value[2].toUpperCase() == lastname.toUpperCase()) {
         evalRows.push('true');
       } else {
         evalRows.push('false');
       }
    }

    if(email == "") {
       evalRows.push('true');
    } else {
       if(value[3].toUpperCase() == email.toUpperCase()) {
         evalRows.push('true');
       } else {
         evalRows.push('false');
       }
    }
/*
    if(street && street != "") {
       if(value[4].toUpperCase() == street.toUpperCase()) {
         evalRows.push('true');
       } else {
         evalRows.push('false');
       }
    } else {
       evalRows.push('true');
    }

    if(city && city != "") {
       if(value[5].toUpperCase() == city.toUpperCase()) {
         evalRows.push('true');
       } else {
         evalRows.push('false');
       }
    } else {
       evalRows.push('true');
    }

    if(state && state != "") {
       if(value[6].toUpperCase() == state.toUpperCase()) {
         evalRows.push('true');
       } else {
         evalRows.push('false');
       }
    } else {
       evalRows.push('true');
    }

    if(zip && zip != "") {
       if(value[7].toUpperCase() == zip.toUpperCase()) {
         evalRows.push('true');
       } else {
         evalRows.push('false');
       }
    } else {
       evalRows.push('true');
    }

*/
    if(evalRows.indexOf("false") == -1) {
      returnRows.push(value);    
    }

  });

  return returnRows;
}

function getRecords() { 
  var return_Array = [];
  var ss= SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName(DATA_SHEET); 
  var getLastRow = dataSheet.getLastRow();
  for(i = 2; i <= getLastRow; i++)
  {
    if(dataSheet.getRange(i, 1).getValue() != '')
    {
      return_Array.push([dataSheet.getRange(i, 1).getValue(), 
      dataSheet.getRange(i, 2).getValue(),
      dataSheet.getRange(i, 3).getValue(),
      dataSheet.getRange(i, 4).getValue(),
      dataSheet.getRange(i, 5).getValue(),
      dataSheet.getRange(i, 6).getValue(), 
      dataSheet.getRange(i, 7).getValue(), 
      dataSheet.getRange(i, 8).getValue()]);
    }
  }  
  return return_Array;  
}