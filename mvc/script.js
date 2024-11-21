function selecionarprod(produtoId) {
    // Obtém o nome e o preço do produto baseado no ID fornecido
    const nomeProduto = document.querySelector(`#prod-detalhe-${produtoId}`).innerText;
    const precoProduto = document.querySelector(`.price-${produtoId}`).innerText;

    // Configuração dos dados para enviar ao backend
    const dadosProduto = {
      nome: nomeProduto,
      preco: precoProduto,
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
  }
  function openModal() {
    document.getElementById("modal").style.display = "flex";

    // Chama o backend para obter os produtos
    fetch('/produtos')
  .then(response => {
    if (!response.ok) {
      console.error('Erro ao fazer a requisição:', response.statusText);
      throw new Error('Erro ao carregar produtos');
    }
    return response.json();
  })
  .then(produtos => {
    console.log('Produtos recebidos:', produtos); // Log para ver os produtos recebidos
    const orderItemsTable = document.querySelector('.order-items tbody');
    orderItemsTable.innerHTML = ''; // Limpar a tabela antes de adicionar novos produtos
    
    produtos.forEach(produto => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${produto.nome}</td>
        <td>1</td> <!-- Quantidade fixa por enquanto -->
        <td>${produto.preco}</td>
      `;
      orderItemsTable.appendChild(row);
    });

    // Preencher o total (soma do preço de todos os produtos)
    const total = produtos.reduce((sum, produto) => sum + parseFloat(produto.preco), 0);
    document.querySelector('.total').innerHTML = `<span>Total a Pagar: R$ ${total.toFixed(2)}</span>`;
  })
  .catch(error => {
    console.error('Erro ao obter produtos:', error);
    alert('Erro ao carregar os produtos!');
  });
  }

  // Função para fechar o modal
  function closeModal() {
    document.getElementById("modal").style.display = "none";
  }

  