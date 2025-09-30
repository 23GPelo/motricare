/**
 * Fichier: 4-CORE_FirebaseCore.gs
 * Rôle: Gère la connexion à la base de données Firebase.
 */

// On utilise une variable globale (singleton) pour ne se connecter qu'une seule fois par exécution.
// C'est une optimisation importante pour la performance.
let firestoreInstance = null;

/**
 * Point d'accès unique à l'instance Firestore.
 * @returns {FirestoreApp} Une instance connectée et authentifiée à votre base de données.
 */
function getFirestore() {
  if (!firestoreInstance) {
    // Si on n'est pas encore connecté, on lit le fichier de clés.
    const credentialsFile = HtmlService.createHtmlOutputFromFile('firebase-credentials.json').getContent();
    const credentials = JSON.parse(credentialsFile);
    
    // Et on établit la connexion.
    firestoreInstance = FirestoreApp.getFirestore(
      credentials.client_email,
      credentials.private_key,
      credentials.project_id
    );
  }
  return firestoreInstance;
}
