/**
 * Fichier: 3-REPOSITORIES_SeanceRepository.gs
 * Rôle: Gère toutes les opérations pour les séances dans Firebase.
 */

// ... getSeancesByPatientName et createSeance restent les mêmes ...

/**
 * NOUVEAU: Récupère les séances à venir.
 * @returns {Array<Object>} Un tableau des séances prévues pour aujourd'hui et demain.
 */
function getUpcomingSeances() {
  const config = getConfig();
  const firestore = getFirestore();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Début de la journée
  
  // Firestore stocke les dates au format YYYY-MM-DD, la comparaison textuelle fonctionne.
  const todayStr = today.toISOString().split('T')[0];

  const results = firestore.getDocuments(config.FIREBASE.COLLECTIONS.SEANCES)
                           .where('date', '>=', todayStr)
                           .orderBy('date')
                           .execute();
                           
  return results ? results.map(doc => doc.fields) : [];
}