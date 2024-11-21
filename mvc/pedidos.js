function selecionarprod(produtoId) {
    // Obtém o nome e o preço do produto baseado no ID fornecido
    const nomeProduto = document.querySelector(`#prod-detalhe-${produtoId}`).innerText;
    const precoProduto = document.querySelector(`.price-${produtoId}`).innerText;

    // Configuração dos dados para enviar ao backend
    const dadosProduto = {
      nome: nomeProduto,
      preco: precoProduto,
      descricao: `Produto ${nomeProduto} selecionado pelo usuário.`
    };

    // Enviar os dados ao backend via fetch
    fetch('/adicionar-produto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosProduto),
    })
      .then((response) => {
        if (response.ok) {
          alert('Produto adicionado ao banco de dados com sucesso!');
        } else {
          throw new Error('Erro ao adicionar produto');
        }
      })
      .catch((error) => {
        console.error('Erro:', error);
        alert('Não foi possível adicionar o produto ao banco de dados.');
      });
  }let produtosSelecionados = {}; // Para armazenar os produtos selecionados e suas quantidades

function selecionarprod(produtoId) {
    // Obtém o nome e o preço do produto baseado no ID fornecido
    const nomeProduto = document.querySelector(`#prod-detalhe-${produtoId}`).innerText;
    const precoProduto = parseFloat(document.querySelector(`.price-${produtoId}`).innerText.replace('R$', '').trim());

    // Verifica se o produto já foi selecionado
    if (produtosSelecionados[nomeProduto]) {
        // Se já estiver selecionado, aumenta a quantidade
        produtosSelecionados[nomeProduto].quantidade += 1;
    } else {
        // Caso contrário, adiciona o produto ao carrinho com quantidade 1
        produtosSelecionados[nomeProduto] = {
            preco: precoProduto,
            quantidade: 1
        };
    }

    // Atualiza a tabela de produtos no modal
    atualizarTabela();
}

function atualizarTabela() {
    const orderItemsTable = document.querySelector('.order-items tbody');
    orderItemsTable.innerHTML = ''; // Limpa a tabela antes de adicionar os novos produtos

    let total = 0; // Para calcular o total da compra

    // Itera sobre os produtos selecionados e atualiza a tabela
    for (const [nome, produto] of Object.entries(produtosSelecionados)) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${nome}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
        `;
        orderItemsTable.appendChild(row);

        total += produto.preco * produto.quantidade; // Atualiza o total
    }

    // Exibe o total
    const totalElement = document.querySelector('.total');
    if (!totalElement) {
        const totalRow = document.createElement('tr');
        totalRow.classList.add('total');
        totalRow.innerHTML = `
            <td colspan="2">Total a Pagar</td>
            <td>R$ ${total.toFixed(2)}</td>
        `;
        orderItemsTable.appendChild(totalRow);
    } else {
        totalElement.innerHTML = `R$ ${total.toFixed(2)}`;
    }
}

function openModal() {
    document.getElementById("modal").style.display = "flex";
    atualizarTabela(); // Atualiza a tabela ao abrir o modal
}

// Função para fechar o modal
function closeModal() {
    document.getElementById("modal").style.display = "none";
}