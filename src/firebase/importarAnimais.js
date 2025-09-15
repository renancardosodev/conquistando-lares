// importarAnimais.js
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import fs from 'fs';

// Emular __dirname no ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho da chave JSON
const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'pet-ongs-firebase-adminsdk-fbsvc-a855711906.json'), 'utf-8')
);

// Inicializa Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL não é obrigatório para Firestore, mas pode deixar se quiser
  databaseURL: "https://pet-ongs-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

// Importa o JSON dos animais
const animais = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'animais.json'), 'utf-8')
);

async function substituirAnimais() {
  try {
    // 1️⃣ Deleta todos os documentos existentes
    const snapshot = await db.collection('animais').get();
    if (!snapshot.empty) {
      const batchDelete = db.batch();
      snapshot.forEach(doc => batchDelete.delete(doc.ref));
      await batchDelete.commit();
      console.log('Documentos antigos deletados');
    } else {
      console.log('Nenhum documento antigo para deletar');
    }

    // 2️⃣ Adiciona todos os novos documentos em batch
    const batchAdd = db.batch();
    animais.forEach(animal => {
      const docRef = db.collection('animais').doc(); // ID automático
      batchAdd.set(docRef, animal);
    });
    await batchAdd.commit();
    console.log('Novos documentos inseridos com sucesso');

    console.log('Importação concluída');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao substituir documentos:', error);
    process.exit(1);
  }
}

substituirAnimais();
