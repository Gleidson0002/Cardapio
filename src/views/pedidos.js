function selecionarprod(produto) {
    const ElementPrice = document.getElementsByClassName(`price-${produto}`);
    const ElementName = document.getElementById(`prod-detalhe-${produto}`);

    
    let productPrice = parseFloat(ElementPrice[0].innerText.replace("R$", "").replace(",",".").trim())
    let productDetalhes = ElementName.innerText.trim();

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    let novoProduto = {
        id: produto,
        nome: productDetalhes,
        preco: productPrice,
        quantidade: 1
    };

    let produtoExistente = carrinho.find(item => item.id === produto);
    if (produtoExistente) {
        produtoExistente.quantidade += 1; 
    } else {
        carrinho.push(novoProduto); 
    }


    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    alert("O produto foi adcionado")
    //window.location.href = 'cesta.html';
}


function carregarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || []; 
    const CSSboxRule = document.querySelector('.box');
    const CSSCardRule = document.querySelector('.card');
    const CSSconteinerRule = document.querySelector('.container');

   const prodimagens = {
        'prod-1': '',
        'prod-2': '',
        'prod-3': '',
        'prod-4': '',
        'prod-5': '',
        'prod-6': '',
        'prod-7': '',
        'prod-8': '',
        'prod-9': '',
        'prod-10': '',
        'prod-11': '',
        'prod-12': '',
        'prod-13': '',
        'prod-14': '',
        'prod-15': '',
    }

    let demoElement = document.getElementById("demo");
    
    if(carrinho.length === 0){
        CSSCardRule.remove();
        CSSboxRule.remove();

        CSSconteinerRule.innerHTML = `
        
        <h2> Seu carrinho está vazio </h2>


        `;
        
        CSSconteinerRule.style.color = 'red';
       
    }
    carrinho.forEach(produto => {
        let cardProd = `
        <div class="card-item">
            <img id="imagprod-${produto.id}" src="${prodimagens[produto.id]}" alt="Imagem do produto">
            <div class="info">
                <p id="prod-detalhe-${produto.id}">${produto.nome}</p>
                <div class="quantidade">
                    <button onclick="alterarQuantidade('${produto.id}', -1)">-</button>
                    <input type="text" id="quantidade-${produto.id}" value="${produto.quantidade}" readonly>
                    <button onclick="alterarQuantidade('${produto.id}', 1)">+</button>
                </div>
                <p id="price-${produto.id}"> R$: ${produto.preco.toLocaleString('pt-BR',{minimumFractionDigits: 2})}</p>
            </div>
            <button class="remove" onclick="removerProduto('${produto.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>`;
        demoElement.innerHTML += cardProd;
    });
}


function alterarQuantidade(produtoId, delta) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let produto = carrinho.find(item => item.id === produtoId);

    if (produto) {
        produto.quantidade += delta;
        if (produto.quantidade <= 0) {
            removerProduto(produtoId); 
        } else {
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            document.getElementById(`quantidade-${produtoId}`).value = produto.quantidade;
        }
    }
    
    resumoCompras();
}

function resumoCompras(){
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let frete = 30;
    let subtotal = 0
    
    carrinho.forEach( novoProduto =>{subtotal += novoProduto.preco * novoProduto.quantidade} ) ;
    let total = subtotal + frete;

    document.getElementById('Subtotal').innerText = `Subtotal: R$${subtotal.toLocaleString('pt-BR',{minimumFractionDigits: 2})}`;
    document.getElementById('Frete').innerText = `Frete: R$${frete.toLocaleString('pt-BR',{minimumFractionDigits: 2})}`;
    document.getElementById('Total').innerText = `Total: R$${total.toLocaleString('pt-BR',{minimumFractionDigits: 2})}`;
    console.log(subtotal);
}

function removerProduto(produtoId) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    const produtoIndex = carrinho.findIndex(produto => produto.id === produtoId);

    if (produtoIndex !== -1) {
        carrinho.splice(produtoIndex, 1);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        window.location.reload();
        // carregarCarrinho();
    }
}

document.addEventListener('DOMContentLoaded', () =>{
carregarCarrinho();
resumoCompras();
});