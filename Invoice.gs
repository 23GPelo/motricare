class Invoice {
  constructor() {
    this.id = this.getNextId();
    this.todaysDate = new Date()
    this.dueDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * DUE_DATE_NUM_DAYS)
    this.patient = null
    this.status = "non réglé"
    this.seances = new Array()
    this.invoiceNumber = 0;
    this.pdf = ""
    this.totalAmount = 0
    this.lineItems = []
  }

  setSeance(seance){
    if(this.patient === null){ this.patient = seance.patient }
    if(seance.patient == this.patient){
        this.seances.push(seance)
    }else{
        return Error("Cette seance correspond à un autre patient que celui sur la facture")
    }
    return this
  }

  getNextId(){
    const sp = SpreadsheetApp.getActiveSpreadsheet();
    const ss = sp.getSheetByName(INVOICES_SHEET_NAME);
    var lastId = ss.getRange(ss.getLastRow(), 1).getValue()
    var nextId = lastId+1
    this.id = nextId
    return nextId
  }

  setInvoiceNumber(){
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const invoicesSheet = ss.getSheetByName(INVOICES_SHEET_NAME);
    var lastInvoiceNumberYear = invoicesSheet.getRange(invoicesSheet.getLastRow(), 2).getValue().split("-")[0].substring(2,4)
    var lastInvoiceNumber = invoicesSheet.getRange(invoicesSheet.getLastRow(), 2).getValue().split("-")[1]
    // Récupérer l'année en cours
    const dateActuelle = new Date();
    const annee = dateActuelle.getFullYear();
    // Extraire les deux derniers chiffres de l'année
    const suffixeAnnee = annee.toString().slice(-2);
    if(suffixeAnnee != lastInvoiceNumberYear){
      var newInvoiceNumber = "0001"
    }else{
      var newInvoiceNumber = "000"+(Number(lastInvoiceNumber)+1)
    }    
    var invoiceNumber = "FA"+suffixeAnnee+"-"+newInvoiceNumber.substring(newInvoiceNumber.length-4)
    this.invoiceNumber = invoiceNumber
    return this
  }

  generateLineItems() {
    let lineItems = [];
    let totalAmount = 0;
    this.seances.forEach(function (lineItem) {
      let lineItemProduct = getData("prestations","name",lineItem.prestation)[0];
      Logger.log(lineItemProduct)
      const price = parseFloat(lineItemProduct.price).toFixed(3);
      lineItems.push([lineItem.date, '',lineItemProduct.description, '', '', price]);
    totalAmount += parseFloat(price);
    });
    Logger.log(lineItems+" test" )
    if(lineItems.length == 0){ return false; } 
    this.lineItems = lineItems
    this.totalAmount = totalAmount
    return this
  }

 
  populateTemplate(){
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const templateSheet = ss.getSheetByName(INVOICE_TEMPLATE_SHEET_NAME);
    templateSheet.getRange('F2').setValue(this.invoiceNumber)
    //templateSheet.getRange('F3').setValue(this.dueDate).setNumberFormat("dd/MM/yyyy")
    templateSheet.getRange('F15').setValue(this.todaysDate).setNumberFormat("dd/MM/yyyy")
    templateSheet.getRange('F16').setValue(this.patient)   
    templateSheet.getRange(23, 1, 11, 6).clearContent()
    templateSheet.getRange(23, 1, this.lineItems.length, 6).setValues(this.lineItems);
    templateSheet.getRange('F35').setValue(this.totalAmount)
    SpreadsheetApp.flush();
    Utilities.sleep(500);
    return this;
  }

  createPDF() {
    const fr = 0, fc = 0, lc = 7, lr = 53;
    const url = "https://docs.google.com/spreadsheets/d/" + SSID + "/export" +
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
      "gid=" + TEMPLATEID + '&' +
      "r1=" + fr + "&c1=" + fc + "&r2=" + lr + "&c2=" + lc;
    const params = { method: "GET", headers: { "authorization": "Bearer " + ScriptApp.getOAuthToken() } };
    const blob = UrlFetchApp.fetch(url, params).getBlob().setName(this.invoiceNumber+"-"+this.patient+'.pdf');
    const folder = getFolderByName_(OUTPUT_FOLDER_NAME); // Gets the folder in Drive where the PDFs are stored.
    const pdfFile = folder.createFile(blob);
    this.pdfFile = pdfFile
    this.link = "https://drive.google.com/file/d/"+pdfFile.getId()+"/view?usp=drivesdk"
    return this;
  }
};