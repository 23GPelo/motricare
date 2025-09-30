/**
 * Fichier: 1-API_WebApp.gs
 * Rôle: Point d'entrée de l'application web. Sert la page principale.
 */

function doGet(e) {
  // Crée la page principale à partir du template HTML.
  const htmlOutput = HtmlService.createTemplateFromFile('5-UI_Index.html').evaluate();
  
  // Configure la page pour qu'elle s'affiche correctement et soit responsive.
  htmlOutput
    .setTitle('Motricare - Gestion de Patientèle')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    
  return htmlOutput;
}
