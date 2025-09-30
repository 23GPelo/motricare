/**
 * Fichier: 4-CORE_Config.gs
 * Rôle: Fournit un accès central et garanti à la configuration de l'application.
 */

/**
 * Point d'accès unique à la configuration de l'application.
 * Utiliser cette fonction garantit que la configuration est toujours disponible.
 * @returns {object} L'objet de configuration complet.
 */
function getConfig() {
  return {
    // Remplacez par l'ID de votre Google Sheet
    SHEET_ID: '1NmegSgfjiYvpI9fN3IkDW_clNy20HQXEsok5q3Pzbuw', 
    
    FIREBASE: {
      COLLECTIONS: {
        PATIENTS: 'patients',
        SEANCES: 'seances',
        FACTURES: 'factures',
        REGLEMENTS: 'reglements',
        PRESTATIONS: 'prestations'
      }
    },
    
    CALENDAR: {
      ID: 'agathe.durieux.psychomot@gmail.com' // Votre ID de calendrier
    }
  };
}