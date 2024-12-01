// Evento para cadastro de novo produto
document.getElementById('product-form').addEventListener('submit', async function (event) {
  // Previne o comportamento padrão do formulário (recarga da página)
  event.preventDefault();

  // Captura os valores dos campos do formulário
  const nome = document.getElementById('product-name').value;
  const preco = parseFloat(document.getElementById('product-price').value);
  const descricao = document.getElementById('product-description').value;
  const imagem = document.getElementById('product-image').value;
  const tipo = document.getElementById('product-type').value;

  // Verifica se o tipo do produto foi selecionado
  if (!tipo) {
      alert("Selecione o tipo do produto!");
      return;
  }

  // Cria um objeto com os dados do produto
  const produto = { nome, preco, descricao, imagem, tipo };

  try {
      // Envia a requisição POST para cadastrar o produto
      const response = await fetch('http://localhost:5000/adicionar-produto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(produto),
      });

      // Verifica se a resposta foi bem-sucedida
      if (response.ok) {
          alert('Produto cadastrado com sucesso!');
          document.getElementById('product-form').reset(); // Reseta o formulário
      } else {
          // Exibe erro se a resposta não for OK
          const errorData = await response.text();
          alert(`Erro ao cadastrar o produto: ${errorData}`);
      }
  } catch (error) {
      // Exibe erro em caso de falha na comunicação com o servidor
      alert('Erro ao se comunicar com o servidor.');
  }
});

// Evento para edição de um produto existente
document.getElementById('edit-product-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  // Captura os valores dos campos de edição
  const id = document.getElementById('edit-product-id').value;
  const nome = document.getElementById('edit-product-name').value;
  const preco = parseFloat(document.getElementById('edit-product-price').value);
  const descricao = document.getElementById('edit-product-description').value;

  // Cria o objeto com os dados atualizados
  const produto = { nome, preco, descricao };

  try {
      // Envia a requisição PUT para atualizar o produto
      const response = await fetch(`/editar-produto/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(produto),
      });

      // Verifica se a resposta foi bem-sucedida
      if (response.ok) {
          alert('Produto atualizado com sucesso!');
      } else {
          alert('Erro ao atualizar o produto.');
      }
  } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao se comunicar com o servidor.');
  }
});

// Evento para excluir um produto
document.getElementById('delete-product-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  // Captura o ID do produto a ser excluído
  const id = document.getElementById('delete-product-id').value;

  try {
      // Envia a requisição DELETE para excluir o produto
      const response = await fetch(`/excluir-produto/${id}`, {
          method: 'DELETE',
      });

      // Verifica se a resposta foi bem-sucedida
      if (response.ok) {
          alert('Produto excluído com sucesso!');
      } else {
          alert('Erro ao excluir o produto.');
      }
  } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao se comunicar com o servidor.');
  }
});

// Função para carregar e exibir os produtos cadastrados
async function carregarProdutos() {
  try {
      // Envia requisição GET para buscar os produtos cadastrados
      const response = await fetch('http://localhost:5000/get-produtos');

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
          throw new Error(`Erro ao buscar produtos: ${response.statusText}`);
      }

      // Converte a resposta para JSON
      const produtos = await response.json();

      // Verifica se a resposta contém um array de produtos
      if (!Array.isArray(produtos)) {
          throw new Error('Formato de resposta inválido. Esperado um array de produtos.');
      }

      console.log(produtos); // Verifica o conteúdo dos produtos

      // Seleciona o container de cards onde os produtos serão exibidos
      const cardContainer = document.querySelector('.card-container');
      cardContainer.innerHTML = ''; // Limpa o conteúdo anterior

      // Itera sobre os produtos e cria um card para cada um
      produtos.forEach(produto => {
          console.log(produto); // Verifica o produto individualmente

          // Cria um card de produto
          const card = document.createElement('div');
          card.style = 'border: 1px solid #ccc; padding: 15px; background-color: transparent; text-align: center; width: 250px; box-sizing: border-box;';
          
          // Define o conteúdo HTML do card
          card.innerHTML = `
              <img src="${produto.imagem}" alt="${produto.nome}" style="max-width: 100%; height: auto;">
              <h3>${produto.nome}</h3>
              <p>${produto.descricao}</p>
              <p><strong>R$ ${produto.preco ? produto.preco.toFixed(2) : '0.00'}</strong></p>
              <p><em>Tipo: ${produto.tipo}</em></p>
              <p><strong>ID: ${produto.id ? produto.id : 'ID não disponível'}</strong></p> <!-- Exibe o ID do produto -->
          `;
          
          // Adiciona o card ao container
          cardContainer.appendChild(card);
      });
  } catch (error) {
      console.error('Erro ao carregar os produtos:', error);
      alert('Erro ao carregar os produtos. Verifique o console para mais detalhes.');
  }
}

// Chama a função para carregar os produtos assim que a página for carregada
carregarProdutos();
