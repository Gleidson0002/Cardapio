
// Função para adicionar produto ao carrinho
function adicionarCarrinho(event) {
  const produtoId = event.target.dataset.id;
  const nomeProduto = event.target.parentElement.querySelector('h3').innerText;
  const precoProduto = parseFloat(event.target.parentElement.querySelector('.price').innerText.replace('R$', '').trim());

  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || {};

  if (carrinho[nomeProduto]) {
      carrinho[nomeProduto].quantidade++;
  } else {
      carrinho[nomeProduto] = { preco: precoProduto, quantidade: 1 };
  }

  // Atualiza no localStorage
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  exibirPopup('Item adicionado ao carrinho!');
  atualizarCarrinho();
}

// Função para atualizar o carrinho
function atualizarCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || {};
  const orderItemsTable = document.querySelector('.order-items tbody');
  orderItemsTable.innerHTML = ''; // Limpa os itens da tabela

  let total = 0;

  Object.entries(carrinho).forEach(([nome, produto]) => {
      const row = document.createElement('tr');
      row.innerHTML = `
  <td>${nome}</td>
  <td>${produto.quantidade}</td>
  <td>R$ ${(produto.preco * produto.quantidade).toFixed(2)}</td>
  <td>
      <button class="remove-btn" data-nome="${nome}" title="Remover">
          <i class="fa fa-trash fa-lg text-danger"></i>
      </button>
  </td>
`;

      orderItemsTable.appendChild(row);

      total += produto.preco * produto.quantidade;
  });

  const totalElement = document.querySelector('.total');
  if (!totalElement) {
      const totalRow = document.createElement('tr');
      totalRow.classList.add('total');
      totalRow.innerHTML = `
      <hr>
      <td colspan="3">Total a Pagar</td>
      <td>R$ ${total.toFixed(2)}</td>
      `;
      orderItemsTable.appendChild(totalRow);
  } else {
      totalElement.querySelector('td:last-child').innerText = `R$ ${total.toFixed(2)}`;
  }

  // Adiciona evento de clique aos botões de remover
  document.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', removerDoCarrinho);
  });
}

function removerDoCarrinho(event) {
  const nomeProduto = event.target.closest('button').dataset.nome;
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || {};

  if (carrinho[nomeProduto]) {
      delete carrinho[nomeProduto]; // Remove o item do carrinho
  }

  // Atualiza o localStorage e o carrinho
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinho();
}

// Função para abrir o modal
function openModal() {
  document.getElementById('modal').style.display = 'flex';
  atualizarCarrinho(); // Atualiza a tabela do carrinho ao abrir o modal
}

// Função para fechar o modal
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function exibirPopup(mensagem) {
  const popup = document.getElementById('popup');
  popup.textContent = mensagem;
  popup.classList.remove('hidden');
  popup.classList.add('show');

  // Remove o popup após 3 segundos
  setTimeout(() => {
      popup.classList.remove('show');
      popup.classList.add('hidden');
  }, 3000);
}
// Função para enviar pedidos ao Firebase
async function enviarPedidos(pedidoData) {
try {
  const response = await fetch('/adicionar-pedido', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pedidoData),
  });

  if (!response.ok) {
    throw new Error(`Erro ao enviar pedido: ${response.statusText}`);
  }
  alert("Pedido enviado com sucesso!");
} catch (error) {
  console.error("Erro ao enviar pedido:", error);
  alert("Erro ao enviar pedido.");
}
}

// Mostrar o modal de login para "Finalizar Pedidos"
// Função para abrir o modal
function openModal() {
  document.getElementById('modal').style.display = 'flex';
  atualizarCarrinho(); // Atualiza a tabela do carrinho ao abrir o modal
}

// Função para fechar o modal
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// Mostrar o modal de login para "Finalizar Pedidos"
function mostrarModalLogin() {
document.getElementById('modal-login').style.display = 'flex'; // Mudei para 'flex' para centralizar
}

// Fechar o modal de login
function closeModalLogin() {
document.getElementById('modal-login').style.display = 'none';
}

// Mostrar o modal de "Solicitar Cozinha"
function mostrarModalCozinha() {
document.getElementById('modal-cozinha').style.display = 'flex'; // Mudei para 'flex' para centralizar
}

// Fechar o modal de "Solicitar Cozinha"
function closeModalCozinha() {
document.getElementById('modal-cozinha').style.display = 'none';
}


// Função para enviar dados do pedido ao backend
async function enviarPedidoComInfo(pedidoData, usuarioData, mesaData = null) {
try {
  const response = await fetch('/adicionar-pedido', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...pedidoData,
      usuario: usuarioData,
      mesa: mesaData
    }),
  });

  if (!response.ok) {
    throw new Error(`Erro ao enviar pedido: ${response.statusText}`);
  }

  alert("Pedido enviado com sucesso!");
  limparCarrinho(); // Limpar o carrinho e o modal
  closeModal();
  closeModalLogin();
  closeModalCozinha();
} catch (error) {
  console.error("Erro ao enviar pedido:", error);
  alert("Erro ao enviar pedido.");
}
}

// Função para "Finalizar Pedidos"
document.getElementById('form-finalizar-pedido').addEventListener('submit', function (event) {
event.preventDefault(); // Evitar o envio do formulário

const nome = document.getElementById('nome').value;
const telefone = document.getElementById('telefone').value;
const endereco = document.getElementById('endereco').value;

const carrinho = JSON.parse(localStorage.getItem('carrinho')) || {};
const pedidoData = {
  itens: Object.entries(carrinho).map(([nomeProduto, produto]) => ({
    nome: nomeProduto,
    quantidade: produto.quantidade,
    preco: produto.preco,
  })),
  status: 'Pedido finalizado',
  criadoEm: new Date().toISOString(),
};

const usuarioData = {
  nome,
  telefone,
  endereco
};

enviarPedidoComInfo(pedidoData, usuarioData);
});

// Função para "Solicitar à Cozinha"
document.getElementById('form-solicitar-cozinha').addEventListener('submit', function (event) {
event.preventDefault(); // Evitar o envio do formulário

const numeroMesa = document.getElementById('numero-mesa').value;

const carrinho = JSON.parse(localStorage.getItem('carrinho')) || {};
const pedidoData = {
  itens: Object.entries(carrinho).map(([nomeProduto, produto]) => ({
    nome: nomeProduto,
    quantidade: produto.quantidade,
    preco: produto.preco,
  })),
  status: 'Cozinha solicitada',
  criadoEm: new Date().toISOString(),
};

enviarPedidoComInfo(pedidoData, {}, numeroMesa);
});

// Função para limpar o carrinho e as informações do modal
function limparCarrinho() {
localStorage.removeItem('carrinho');
}


// Carrega os produtos ao carregar a página
document.addEventListener('DOMContentLoaded', carregarProdutos);