class Seance {
  constructor(date, time, prestation, patient) {
    this.id = this.getNextId();
    this.date = date;
    this.time = time;
    this.prestation = prestation
    this.patient = patient 
    this.status = "X"
    this.invoice = null
  }


  getSeanceById(id){
    var data = getData("seances","id",id)[0]
    this.id = data.id
    this.date = data.date
    this.heure = data.heure
    this.prestation = data.prestation
    this.patient = data.patient
    this.status = data.status
    return this
  } 

  generateInvoice() {
    if (this.invoice === null) {
      this.invoice = new Invoice(this)
    } else {
      console.log('Seance déjà facturé !!');
    }
  }

  getNextId(){
    const sp = SpreadsheetApp.getActiveSpreadsheet();
    const ss = sp.getSheetByName(TRANSACTIONS_SHEET_NAME);
    var lastId = ss.getRange(ss.getLastRow(), 1).getValue()
    var nextId = lastId+1
    this.id = nextId
    return nextId
  }

  addSeance(){
    var sp = SpreadsheetApp.getActiveSpreadsheet()
    var ss = sp.getSheetByName("seances")
    Logger.log(this)
    var {id, date, time, prestation, patient, status} = this
    Logger.log(patient)
    console.log(patient)
    ss.appendRow([id, date, time, prestation, patient, status])
    ss.getRange("B:B").setNumberFormat("yyyy-MM-dd")
    ss.getRange("C:C").setNumberFormat("hh:mm")
    return this
  }

  updateSeance(seance){
    var sp = SpreadsheetApp.getActiveSpreadsheet()
    var ss = sp.getSheetByName("seances")
    var data = ss.getDataRange().getValues()
    var ligne = data.findIndex(e => e[0] == seance.id)
    ss.getRange(ligne+1,6).setValue(seance.invoiceNumber)
    return seance
  }

};

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


