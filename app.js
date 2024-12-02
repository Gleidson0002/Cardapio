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
const { doc, updateDoc, deleteDoc, getDocs , query, orderBy } = require("firebase/firestore");
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } = require("firebase/auth");

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

const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);
const storageFirebase = getStorage(appFirebase);  

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const auth = getAuth(appFirebase);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));

////////////////////////////////////////////////////////////////////

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Tentar autenticar o usuário com Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    console.log(`Usuário ${user.email} autenticado com sucesso!`);

    // Retorne uma resposta de sucesso
    res.status(200).send('Login bem-sucedido!');
  } catch (error) {
    console.error('Erro ao fazer login:', error.code, error.message);
    res.status(401).send('Email ou senha incorretos!');
  }
});


app.post('/register', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Tentar registrar um novo usuário com Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    console.log(`Usuário ${user.email} registrado com sucesso!`);

    // Retorne uma resposta de sucesso
    res.status(201).send('Registro bem-sucedido!');
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.code, error.message);
    res.status(500).send(`Erro ao registrar usuário: ${error.message}`);
  }
});

// Rota para marcar um pedido como concluído
app.put('/marcar-concluido/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const pedidoRef = doc(db, 'pedidos', id);
      await updateDoc(pedidoRef, {
          status: 'Concluído',
      });
      res.status(200).send('Pedido concluído com sucesso!');
  } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      res.status(500).send('Erro ao concluir pedido.');
  }
});
// Rota POST para adicionar pedidos no Firestore
// Rota para adicionar pedidos com informações do usuário e mesa
app.post('/adicionar-pedido', async (req, res) => {
  console.log('Pedido recebido:', req.body);

  const { itens, status, criadoEm, usuario, mesa } = req.body;

  // Validação dos dados
  if (!itens || !status || !criadoEm || !usuario) {
    console.error('Erro: Campos obrigatórios ausentes.');
    return res.status(400).send('Todos os campos são obrigatórios!');
  }

  try {
    // Adicionando o pedido no Firestore
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



// Rota POST para adicionar produtos
app.post('/adicionar-produto', async (req, res) => {
  console.log('Requisição recebida na rota /adicionar-produto');
  console.log('Dados recebidos:', req.body);

  const { nome, preco, descricao, imagem, tipo } = req.body;

  // Validação dos campos
  if (!nome || !preco || !descricao || !imagem || !tipo) {
      console.error('Erro: Campos obrigatórios ausentes.');
      return res.status(400).send('Todos os campos são obrigatórios!');
  }

  try {
      // Adicionando o produto no Firestore
      await addDoc(collection(db, 'produtos'), {
          nome,
          preco,
          descricao,
          imagem,
          tipo,
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
    const produtosRef = collection(db, 'produtos'); // Refere-se à coleção de produtos
    const querySnapshot = await getDocs(produtosRef); // Obtém os documentos da coleção
    const produtos = querySnapshot.docs.map(doc => ({
      id: doc.id, // Inclui o id do documento
      ...doc.data() // Inclui os dados do produto
    }));
    console.log("Produtos encontrados:", produtos);
    res.json(produtos); // Retorna os produtos como resposta
  } catch (error) {
    console.error('Erro ao obter produtos no Firestore:', error.code, error.message);
    res.status(500).send(`Erro ao obter produtos: ${error.message}`); // Resposta em caso de erro
  }
});


app.get('/get-pedidos', async (req, res) => {
  try {
      const pedidosRef = collection(db, 'pedidos');
      const querySnapshot = await getDocs(pedidosRef);
      const pedidos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(pedidos);
  } catch (error) {
      console.error('Erro ao obter pedidos:', error);
      res.status(500).send('Erro ao buscar pedidos.');
  }
});
app.post('/adicionar-reserva', async (req, res) => {
  const { nome, telefone, data, horario, pessoas, mesas } = req.body;

  // Validação dos campos
  if (!nome || !telefone || !data || !horario || !pessoas || !mesas) {
    console.error('Erro: Campos obrigatórios ausentes.');
    return res.status(400).send('Todos os campos são obrigatórios!');
  }

  try {
    // Adicionando a reserva no Firestore
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


app.get('/reservas', async (req, res) => {
  try {
    // Consulta com ordenação pelo campo 'data' (mais recente primeiro)
    const q = query(collection(db, 'reservas'), orderBy('data', 'asc')); // Use 'asc' ou 'desc' conforme necessário
    const querySnapshot = await getDocs(q);
    const reservas = [];

    // Iterando sobre os documentos e formatando os dados
    querySnapshot.forEach(doc => {
      reservas.push({ id: doc.id, ...doc.data() });
    });

    console.log('Reservas recuperadas com sucesso!');
    res.status(200).json(reservas);
  } catch (error) {
    console.error('Erro ao recuperar reservas do Firestore:', error.code, error.message);
    res.status(500).send(`Erro ao recuperar reservas: ${error.message}`);
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