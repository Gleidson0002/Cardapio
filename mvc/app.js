var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

// Firebase Admin SDK
const admin = require('firebase-admin');
const serviceAccount = require('../mvc/pizzaria-746a0-firebase-adminsdk-p1fkb-77ec2313b4.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Configurações do Express
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para analisar form-data
app.use(express.static(path.join(__dirname, 'public')));

// Rota POST para adicionar produtos
app.post('/adicionar-produto', (req, res) => {
  const { nome, preco, descricao } = req.body;

  // Verifica se os dados foram enviados corretamente
  if (!nome || !preco || !descricao) {
    return res.status(400).send('Todos os campos são obrigatórios!');
  }

  // Enviar os dados para a coleção 'produtos' no Firestore
  db.collection('produtos')
    .add({
      nome,
      preco,
      descricao,
    })
    .then(() => {
      console.log(`Produto "${nome}" adicionado com sucesso!`);
      res.status(200).send('Produto adicionado ao banco de dados!');
    })
    .catch((error) => {
      console.error('Erro ao adicionar produto:', error);
      res.status(500).send('Erro ao adicionar produto');
    });
});

// Rota para obter os produtos do Firebase
app.get('/produtos', (req, res) => {
  console.log("Recebendo requisição para listar produtos...");
  db.collection('produtos')
    .get()
    .then(snapshot => {
      const produtos = [];
      snapshot.forEach(doc => {
        produtos.push(doc.data());
      });
      console.log("Produtos encontrados:", produtos);
      res.json(produtos); // Retorna os produtos em formato JSON
    })
    .catch((error) => {
      console.error('Erro ao obter produtos:', error);
      res.status(500).send('Erro ao recuperar produtos');
    });
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
const port = 500;
app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});

module.exports = app;
