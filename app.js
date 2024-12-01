// Importação de módulos e pacotes
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const multer = require('multer');

// Firebase Imports
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, getDocs, query, orderBy } = require("firebase/firestore");
const { getStorage } = require('firebase/storage');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require("firebase/auth");

// Configuração de armazenamento de arquivos (multer)
const storage = multer.memoryStorage(); // Armazenar a imagem em memória
const upload = multer({ storage: storage });

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

// Inicializa o app Firebase
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);
const storageFirebase = getStorage(appFirebase);
const auth = getAuth(appFirebase);

// Configuração do Express
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

// ---------------------------------------------------------------
// Rota para login de usuários
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    console.log(`Usuário ${user.email} autenticado com sucesso!`);
    res.status(200).send('Login bem-sucedido!');
  } catch (error) {
    console.error('Erro ao fazer login:', error.code, error.message);
    res.status(401).send('Email ou senha incorretos!');
  }
});

// ---------------------------------------------------------------
// Rota para registro de novos usuários
app.post('/register', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    console.log(`Usuário ${user.email} registrado com sucesso!`);
    res.status(201).send('Registro bem-sucedido!');
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.code, error.message);
    res.status(500).send(`Erro ao registrar usuário: ${error.message}`);
  }
});

// ---------------------------------------------------------------
// Rota para adicionar um pedido
app.post('/adicionar-pedido', async (req, res) => {
  const { itens, status, criadoEm, usuario, mesa } = req.body;

  if (!itens || !status || !criadoEm || !usuario) {
    console.error('Erro: Campos obrigatórios ausentes.');
    return res.status(400).send('Todos os campos são obrigatórios!');
  }

  try {
    await addDoc(collection(db, 'pedidos'), {
      itens,
      status,
      criadoEm,
      usuario,  // Inclui nome, telefone e endereço
      mesa,     // Inclui número da mesa, se fornecido
      atualizadoEm: serverTimestamp(),
    });
    console.log('Pedido adicionado com sucesso!');
    res.status(200).send('Pedido adicionado ao banco de dados!');
  } catch (error) {
    console.error('Erro ao adicionar pedido no Firestore:', error.code, error.message);
    res.status(500).send(`Erro ao adicionar pedido: ${error.message}`);
  }
});

// ---------------------------------------------------------------
// Rota para editar um produto
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

// ---------------------------------------------------------------
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

// ---------------------------------------------------------------
// Rota para listar todos os produtos
app.get('/get-produtos', async (req, res) => {
  try {
    const produtosRef = collection(db, 'produtos');
    const querySnapshot = await getDocs(produtosRef);
    const produtos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao obter produtos no Firestore:', error.code, error.message);
    res.status(500).send(`Erro ao obter produtos: ${error.message}`);
  }
});

// ---------------------------------------------------------------
// Rota para adicionar uma reserva
app.post('/adicionar-reserva', async (req, res) => {
  const { nome, telefone, data, horario, pessoas, mesas } = req.body;

  if (!nome || !telefone || !data || !horario || !pessoas || !mesas) {
    console.error('Erro: Campos obrigatórios ausentes.');
    return res.status(400).send('Todos os campos são obrigatórios!');
  }

  try {
    await addDoc(collection(db, 'reservas'), {
      nome,
      telefone,
      data,
      horario,
      pessoas,
      mesas,
      criadoEm: serverTimestamp(),
    });
    console.log('Reserva adicionada com sucesso!');
    res.status(200).send('Reserva adicionada ao banco de dados!');
  } catch (error) {
    console.error('Erro ao adicionar reserva no Firestore:', error.code, error.message);
    res.status(500).send(`Erro ao adicionar reserva: ${error.message}`);
  }
});

// ---------------------------------------------------------------
// Rota para listar reservas ordenadas por data
app.get('/reservas', async (req, res) => {
  try {
    const q = query(collection(db, 'reservas'), orderBy('data', 'asc'));
    const querySnapshot = await getDocs(q);
    const reservas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(reservas);
  } catch (error) {
    console.error('Erro ao recuperar reservas do Firestore:', error.code, error.message);
    res.status(500).send(`Erro ao recuperar reservas: ${error.message}`);
  }
});

// ---------------------------------------------------------------
// Roteamento de erros
app.use(function (req, res, next) {
  next(createError(404)); // Erro 404 - Página não encontrada
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).render('error'); // Erro geral
});

// Iniciar o servidor na porta 5000
const port = 5000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});

module.exports = app;
