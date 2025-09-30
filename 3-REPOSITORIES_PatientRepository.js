/**
 * Fichier: 3-REPOSITORIES_PatientRepository.gs
 * Rôle: Gère toutes les opérations de lecture/écriture pour les patients dans Firebase.
 */

function getAllPatients() {
  const config = getConfig();
  const firestore = getFirestore();
  const allDocs = firestore.getDocuments(config.FIREBASE.COLLECTIONS.PATIENTS);
  
  if (!allDocs) return [];
  
  const patients = allDocs.map(doc => doc.fields);
  // Trie les patients par ID pour un affichage cohérent.
  return patients.sort((a, b) => a.id - b.id);
}

function getPatientById(id) {
  const config = getConfig();
  const firestore = getFirestore();
  
  const numericId = parseInt(id, 10);
  // Vérification plus stricte de l'ID.
  if (isNaN(numericId) || numericId <= 0) {
    console.error(`Tentative de recherche avec un ID de patient invalide: ${id}`);
    return null; // On retourne null pour les ID invalides.
  }
  
  const documentPath = `${config.FIREBASE.COLLECTIONS.PATIENTS}/${numericId}`;
  
  try {
    const doc = firestore.getDocument(documentPath);

    // Si le document ou ses champs n'existent pas, le patient n'est pas trouvé.
    if (!doc || !doc.fields) {
      console.warn(`Aucun patient trouvé pour le chemin: ${documentPath}`);
      return null; // On retourne null explicitement.
    }
    
    return doc.fields; // Succès, on retourne les données.

  } catch (e) {
    console.error(`Erreur Firestore dans getPatientById pour le chemin ${documentPath}: ${e.message}`);
    return null; // En cas d'erreur système, on retourne aussi null.
  }
}

