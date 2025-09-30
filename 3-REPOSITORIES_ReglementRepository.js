/**
 * Fichier: 3-REPOSITORIES_ReglementRepository.gs
 * Rôle: Gère toutes les opérations pour les règlements dans Firebase.
 */

function getReglementsByPatientName(name) {
  const config = getConfig();
  const firestore = getFirestore();
  
  // Attention: Le nom du champ dans votre CSV était 'name', pas 'patient_name'.
  // Si vous l'avez corrigé pendant la migration, changez 'name' par 'patient_name' ici.
  const results = firestore.getDocuments(config.FIREBASE.COLLECTIONS.REGLEMENTS)
                           .where('name', '==', name)
                           .execute();
                           
  return results ? results.map(doc => doc.fields) : [];
}