document.getElementById('product-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nome = document.getElementById('product-name').value;
    const preco = parseFloat(document.getElementById('product-price').value);
    const descricao = document.getElementById('product-description').value;
    const imagem = document.getElementById('product-image').value;
    const tipo = document.getElementById('product-type').value;

    if (!tipo) {
        alert("Selecione o tipo do produto!");
        return;
    }

    const produto = { nome, preco, descricao, imagem, tipo };

    try {
        const response = await fetch('http://localhost:5000/adicionar-produto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produto),
        });

        if (response.ok) {
            alert('Produto cadastrado com sucesso!');
            document.getElementById('product-form').reset();
        } else {
            const errorData = await response.text();
            alert(`Erro ao cadastrar o produto: ${errorData}`);
        }
    } catch (error) {
        alert('Erro ao se comunicar com o servidor.');
    }
});

        document.getElementById('edit-product-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const id = document.getElementById('edit-product-id').value;
  const nome = document.getElementById('edit-product-name').value;
  const preco = parseFloat(document.getElementById('edit-product-price').value);
  const descricao = document.getElementById('edit-product-description').value;

  const produto = { nome, preco, descricao };

  try {
    const response = await fetch(`/editar-produto/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(produto),
    });

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

document.getElementById('delete-product-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const id = document.getElementById('delete-product-id').value;

  try {
    const response = await fetch(`/excluir-produto/${id}`, {
      method: 'DELETE',
    });

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

async function carregarProdutos() {
    try {
        const response = await fetch('http://localhost:5000/get-produtos');
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar produtos: ${response.statusText}`);
        }

        const produtos = await response.json();

        if (!Array.isArray(produtos)) {
            throw new Error('Formato de resposta inválido. Esperado um array de produtos.');
        }

        console.log(produtos); // Verifica o conteúdo da resposta

        const cardContainer = document.querySelector('.card-container');
        cardContainer.innerHTML = '';

        produtos.forEach(produto => {
            console.log(produto); // Verifica cada produto
            const card = document.createElement('div');
            card.style = 'border: 1px solid #ccc; padding: 15px; background-color: transparent; text-align: center; width: 250px; box-sizing: border-box;';

            card.innerHTML = `
                <img src="${produto.imagem}" alt="${produto.nome}" style="max-width: 100%; height: auto;">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <p><strong>R$ ${produto.preco ? produto.preco.toFixed(2) : '0.00'}</strong></p>
                <p><em>Tipo: ${produto.tipo}</em></p>
                <p><strong>ID: ${produto.id ? produto.id : 'ID não disponível'}</strong></p> <!-- Exibe o ID do produto -->
            `;
            cardContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
        alert('Erro ao carregar os produtos. Verifique o console para mais detalhes.');
    }
}

carregarProdutos(); 