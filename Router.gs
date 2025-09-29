var Route = {};
Route.path = function(route,callback){
  Route[route] = callback
}

function doGet(e) {
  Route.path("patients",loadPatients)
  Route.path("prestations",loadPrestations)
  Route.path("board",loadBoard)
  if(Route[e.parameters.v]){
      return Route[e.parameters.v](e)
  }else{
    return render("Index")
  }  
}

function loadPatients(e){
  return render("IndexPatients");
}
function loadPrestations(e){
  return render("IndexSeances");
}
function loadBoard(e){
  var id = e.parameters.i   
  var patient = foundPatientById("patients",id)
  var seances = foundSeancesById("seances",patient.name)
  var object = {patient:patient, seances:seances}
  return render("IndexBoard",object);
}

function foundPatientById(base,id){
  var sp = SpreadsheetApp.getActiveSpreadsheet()
  var ss = sp.getSheetByName(base)
  var data = ss.getDataRange().getDisplayValues()
  var found = false
  for(var i = 0; i < data.length; i++){
    if(data[i][0] == id[0]){
      found = data[i]
      break;
    }
  }
  var object = {}
  if(found != false){
    var [id, name, genre, date, email, telephone, adresse] = found
    object = {id:id, name:name, genre:genre, date:date, email:email, telephone:telephone, adresse:adresse}
  }
  return object
}

function foundSeancesById(base,patientName){
  var sp = SpreadsheetApp.getActiveSpreadsheet()
  var ss = sp.getSheetByName(base)
  var data = ss.getDataRange().getDisplayValues()
  var object = []

  for(var i = 0; i < data.length; i++){
    if(data[i][3] == patientName){
      Logger.log("in : "+patientName)
      var [id, date, nature, patient_name, status, montant] = data[i]
      var ligne = {id:id, date:date, nature:nature, patient_name:patient_name, status:status, montant:montant}
      object.push(ligne)
    }
  }
  return object
}


function render(file, argsObject){
  var tmp = HtmlService.createTemplateFromFile(file);
  if(argsObject){
    var keys = Object.keys(argsObject);
    keys.forEach(function(key){
      tmp[key] = argsObject[key];
    })
  }
  return tmp.evaluate()
}

