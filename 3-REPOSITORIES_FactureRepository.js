/**
 * Fichier: 3-REPOSITORIES_FactureRepository.gs
 * Rôle: Gère toutes les opérations pour les factures dans Firebase.
 */

// ... getFacturesByPatientName reste le même ...

/**
 * NOUVEAU: Récupère les factures dont la date d'échéance est dépassée
 * et qui n'ont pas le statut "réglé".
 * @returns {Array<Object>} Un tableau des factures en retard.
 */
function getOverdueInvoices() {
    const config = getConfig();
    const firestore = getFirestore();

    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    // Firestore stocke les dates au format JJ/MM/AAAA HH:mm:ss, la comparaison directe n'est pas fiable.
    // Nous devons donc filtrer en JavaScript après avoir récupéré les factures non réglées.
    const allUnpaidInvoices = firestore.getDocuments(config.FIREBASE.COLLECTIONS.FACTURES)
                                     .where('status', '!=', 'réglé')
                                     .execute();

    if (!allUnpaidInvoices) return [];

    const overdue = allUnpaidInvoices.map(doc => doc.fields).filter(invoice => {
        if (!invoice.dueDate) return false;
        // Conversion de la date JJ/MM/AAAA en objet Date pour comparaison
        const parts = invoice.dueDate.split(' ')[0].split('/');
        const dueDate = new Date(parts[2], parts[1] - 1, parts[0]);
        return dueDate < today;
    });

    return overdue;
}