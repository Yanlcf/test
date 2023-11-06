import express from 'express';
import admin from 'firebase-admin';

const app = express();
admin.initializeApp({
  credential: admin.credential.cert("serviceAccountKey.json")
});

app.get('/produtos', async (req, res) => {
  const jwt = req.headers.authorization;
  if (!jwt) return res.status(401).json({ message: "JWT ausente!!" });

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(jwt);
    const uid = decodedIdToken.uid;

    const adminDoc = await admin.firestore().doc(`admins/${uid}`).get();
    const isAdmin = adminDoc.exists && adminDoc.data().isAdmin;

    const produtosRef = admin.firestore().collection('produtos');

    const snapshot = await (isAdmin
      ? produtosRef.get()
      : produtosRef.where('user.uid', '==', uid).get());

    const produtos = snapshot.docs.map(doc => ({
      ...doc.data(),
      uid: doc.id,
    }));

    const message = isAdmin ? "Seja bem-vindo administrador!" : undefined;
    res.json({ message, produtos});
  } catch (e) {
    res.status(401).json({ message: "Acesso não autorizado." });
  }
});

app.listen(3000, () => {
  console.log('API sendo executada na porta 3000');
});
