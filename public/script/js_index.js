// Função assíncrona para carregar os produtos
async function carregarProdutos() {
    try {
        // Fazendo a requisição GET para buscar os produtos
        const response = await fetch('http://localhost:5000/get-produtos');
        
        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro ao buscar produtos: ${response.statusText}`);
        }

        // Converte a resposta para um array de objetos JSON
        const produtos = await response.json();

        // Verifica se a resposta é um array de produtos
        if (!Array.isArray(produtos)) {
            throw new Error('Formato de resposta inválido. Esperado um array de produtos.');
        }

        // Seleciona o contêiner onde os cards serão exibidos
        const cardContainer = document.querySelector('.card-container');

        // Limpa os cards anteriores antes de adicionar novos
        cardContainer.innerHTML = '';

        // Filtra os produtos que são do tipo "comida"
        const comidas = produtos.filter(produto => produto.tipo === 'comida');

        // Cria um card para cada produto filtrado
        comidas.forEach(produto => {
            const card = document.createElement('div');
            card.classList.add('card'); // Adiciona a classe 'card' para cada item

            // Define o conteúdo do card com as informações do produto
            card.innerHTML = `
                <img src="${produto.imagem}" alt="${produto.nome}" class="card-img"> <!-- Imagem do produto -->
                <h3>${produto.nome}</h3> <!-- Nome do produto -->
                <p>${produto.descricao}</p> <!-- Descrição do produto -->
                <p>A partir de <span class="price">R$ ${produto.preco ? produto.preco.toFixed(2) : '0.00'}</span></p> <!-- Preço do produto -->
                <button class="btnCompra" data-id="${produto.id}" onclick="adicionarCarrinho(event)">Eu quero!</button> <!-- Botão de compra -->
            `;

            // Adiciona o card ao contêiner de produtos
            cardContainer.appendChild(card);
        });
    } catch (error) {
        // Caso haja algum erro, exibe no console e um alerta na página
        console.error('Erro ao carregar os produtos:', error);
        alert('Erro ao carregar os produtos. Verifique o console para mais detalhes.');
    }
}

// Evento que dispara a função carregarProdutos após o conteúdo da página ser carregado
document.addEventListener('DOMContentLoaded', carregarProdutos);
