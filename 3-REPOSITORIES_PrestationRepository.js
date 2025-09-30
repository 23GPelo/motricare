/**
 * Fichier: 3-REPOSITORIES_PrestationRepository.gs
 * Rôle: Gère toutes les opérations pour les prestations dans Firebase.
 */

function getAllPrestations() {
  const config = getConfig();
  const firestore = getFirestore();
  const allDocs = firestore.getDocuments(config.FIREBASE.COLLECTIONS.PRESTATIONS);

  if (!allDocs) return [];

  const prestations = allDocs.map(doc => doc.fields);
  // Trie les prestations par nom pour l'affichage.
  return prestations.sort((a, b) => a.name.localeCompare(b.name));
}
