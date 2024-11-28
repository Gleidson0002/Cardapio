var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const multer = require('multer');
const storage = multer.memoryStorage(); // Armazenar a imagem em memória
const upload = multer({ storage: storage });

// Importar funções do Firebase
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, serverTimestamp } = require("firebase/firestore");
const { doc, updateDoc, deleteDoc, getDocs } = require("firebase/firestore");
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDDPtSv_pX4lRQoZpV3JSF4PzQxBcsJx0o",
  authDomain: "pizzaria-746a0.firebaseapp.com",
  projectId: "pizzaria-746a0",
  storageBucket: "pizzaria-746a0.firebasestorage.app",
  messagingSenderId: "815253628984",
  appId: "1:815253628984:web:f6d7a12fa34a4e14e11ecd",
  measurementId: "G-TEZYLLCSZL"
};

// Inicializando o Firebase
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);
const storageFirebase = getStorage(appFirebase);  // Agora, o Firebase é inicializado antes

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Configurações do Express
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));

// Rota POST para adicionar produtos
app.post('/adicionar-produto', upload.single('image'), async (req, res) => {
  console.log('Requisição recebida na rota /adicionar-produto');
  console.log('Dados recebidos:', req.body);

  const { nome, preco, descricao } = req.body;
  const image = req.file; // Arquivo da imagem

  if (!nome || !preco || !descricao || !image) {
      console.error('Erro: Campos obrigatórios ausentes.');
      return res.status(400).send('Todos os campos são obrigatórios!');
  }

  try {
      // Armazenar a imagem no Firebase Storage
      const imageRef = ref(storageFirebase, 'produtos/' + Date.now() + '-' + image.originalname);
      await uploadBytes(imageRef, image.buffer);

      // Obter a URL de download da imagem
      const imageUrl = await getDownloadURL(imageRef);

      // Adicionar produto no Firestore
      await addDoc(collection(db, 'produtos'), {
          nome,
          preco,
          descricao,
          imagemUrl: imageUrl,  // Salvar URL da imagem
          criadoEm: serverTimestamp(),
      });

      console.log(`Produto "${nome}" adicionado com sucesso!`);
      res.status(200).send('Produto adicionado ao banco de dados!');
  } catch (error) {
      console.error('Erro ao adicionar produto no Firestore:', error.code, error.message);
      res.status(500).send(`Erro ao adicionar produto: ${error.message}`);
  }
});

// Rota para atualizar o produto
app.put('/editar-produto/:id', async (req, res) => {
  const { id } = req.params;  
  const { nome, preco, descricao } = req.body;

  if (!nome || !preco || !descricao) {
    console.error('Erro: Campos obrigatórios ausentes.');
    return res.status(400).send('Todos os campos são obrigatórios!');
  }

  try {
    const produtoRef = doc(db, 'produtos', id);

    await updateDoc(produtoRef, {
      nome,
      preco,
      descricao,
      atualizadoEm: serverTimestamp(),
    });

    console.log(`Produto "${nome}" atualizado com sucesso!`);
    res.status(200).send('Produto atualizado no banco de dados!');
  } catch (error) {
    console.error('Erro ao editar produto no Firestore:', error.code, error.message);
    res.status(500).send(`Erro ao editar produto: ${error.message}`);
  }
});

// Rota para excluir um produto
app.delete('/excluir-produto/:id', async (req, res) => {
  const { id } = req.params; 

  try {
    const produtoRef = doc(db, 'produtos', id);
    await deleteDoc(produtoRef);

    console.log(`Produto com ID "${id}" excluído com sucesso!`);
    res.status(200).send('Produto excluído do banco de dados!');
  } catch (error) {
    console.error('Erro ao excluir produto no Firestore:', error.code, error.message);
    res.status(500).send(`Erro ao excluir produto: ${error.message}`);
  }
});

app.get('/get-produtos', async (req, res) => {
  console.log("Recebendo requisição para listar produtos...");
  try {
    const querySnapshot = await getDocs(collection(db, 'produtos'));
    const produtos = [];
    querySnapshot.forEach((doc) => {
      produtos.push(doc.data());
    });
    console.log("Produtos encontrados:", produtos);
    res.json(produtos); 
  } catch (error) {
    console.error('Erro ao obter produtos no Firestore:', error.code, error.message);
    res.status(500).send(`Erro ao obter produtos: ${error.message}`);
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Tratamento de erros 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Tratamento de erros gerais
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Iniciar o servidor
const port = 5000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});

module.exports = app;
