/**
 * Fichier: 1-API_Api.gs
 * Rôle: Routeur central pour toutes les actions de l'interface utilisateur.
 */

function handleApiRequest(action, payload) {
  try {
    const [controller, method] = action.split('.');
    
    switch (controller) {
      // NOUVEAU CONTRÔLEUR POUR LE TABLEAU DE BORD
      case 'dashboard':
        switch(method) {
          case 'getUpcomingSeances': return getUpcomingSeances();
          case 'getOverdueInvoices': return getOverdueInvoices();
        }
        break;

      case 'patients':
        switch (method) {
          case 'getAll': return getAllPatients();
          case 'getById': return getPatientById(payload.id);
          // case 'create': return createPatient(payload);
          // case 'update': return updatePatient(payload.id, payload.data);
          // case 'delete': return deletePatient(payload.id);
        }
        break;

      case 'seances':
        switch (method) {
          case 'getByPatientName': return getSeancesByPatientName(payload.name);
          case 'create': return createSeance(payload); // NOUVELLE ROUTE
        }
        break;

      case 'factures':
         switch (method) {
          case 'getByPatientName': return getFacturesByPatientName(payload.name);
        }
        break;
        
      case 'reglements':
         switch (method) {
          case 'getByPatientName': return getReglementsByPatientName(payload.name);
        }
        break;
      
      // ... Les autres contrôleurs restent les mêmes ...

      default:
        throw new Error(`Contrôleur inconnu: ${controller}`);
    }
  } catch (error) {
    console.error(`Erreur API [${action}]: ${error.stack}`);
    return { error: true, message: error.message };
  }
}