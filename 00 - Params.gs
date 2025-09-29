/**
 * @OnlyCurrentDoc
 * 
 * The above comment specifies that this automation will only
 * attempt to read or modify the spreadsheet this script is bound to.
 * The authorization request message presented to users reflects the
 * limited scope.
 */
// To learn how to use this script, refer to the documentation:
// https://developers.google.com/apps-script/samples/automations/generate-pdfs
// TODO: To test this solution, set EMAIL_OVERRIDE to true and set EMAIL_ADDRESS_OVERRIDE to your email address.
const EMAIL_OVERRIDE = true;
const EMAIL_ADDRESS_OVERRIDE = 't.houtekiet@gmail.com';

// Application constants
const APP_TITLE = "💖 Menu de l'amour 💖";
const OUTPUT_FOLDER_NAME = "Factures";
const DUE_DATE_NUM_DAYS = 15
const SSID = "1NmegSgfjiYvpI9fN3IkDW_clNy20HQXEsok5q3Pzbuw"


// Sheet name constants. Update if you change the names of the sheets.
const CUSTOMERS_SHEET_NAME = 'patients';
const PRODUCTS_SHEET_NAME = 'prestations';
const TRANSACTIONS_SHEET_NAME = 'seances';
const INVOICES_SHEET_NAME = 'factures';
const INVOICE_TEMPLATE_SHEET_NAME = 'template facture';
const TEMPLATEID = "1953628531"

// Email constants
const EMAIL_SUBJECT = 'Notification de facture';
const EMAIL_BODY = 'Bonjour,\rVous trouverez ci-joint votre facture mensuelle.';

/**
 * Creates a custom menu in the Google Sheets UI when the document is opened.
 *
 * @param {object} e The event parameter for a simple onOpen trigger.
 */
function onOpen(e) {
  const menu = SpreadsheetApp.getUi().createMenu(APP_TITLE)
    //.addItem('Process invoices', 'processDocuments')
    //.addItem('Send emails', 'sendEmails')
    .addSeparator()
    .addItem("⚡ Ajouter une seance plus vite que l'éclair ⚡","displaySeanceForm")
    .addSeparator()
    .addItem("🎤 Générer une facture plus vite que la musique 🎤","displayFactureForm")
    .addSeparator()
    .addItem("🍃 Régler une facture plus vite que le vent 🍃","displayReglementForm")
    .addSeparator()    
    .addItem("Ajouter un réglement","displayPureReglementForm")
    .addSeparator()   
    .addItem("📧 Envoyer la quittance par email 📧","getCalendar")
    .addSeparator()    
    .addItem("📅 Mettre à jour l'agenda 📅","getCalendar")
    .addSeparator()    
    .addItem("🙏 Demander les autorisations 🙏","askForRights")
    .addSeparator()
    //.addItem('Reset template', 'clearTemplateSheet')
    .addToUi();
}