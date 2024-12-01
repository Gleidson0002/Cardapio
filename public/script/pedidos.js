// Função para carregar os pedidos do Firebase ou backend
async function carregarPedidos() {
    try {
        // Envia uma requisição para buscar os pedidos do servidor
        const response = await fetch('http://localhost:5000/get-pedidos');
        
        // Verifica se a resposta da requisição foi bem-sucedida
        if (!response.ok) {
            console.error(`Erro ao buscar pedidos: ${response.statusText}`);
            throw new Error(`Erro ao buscar pedidos: ${response.statusText}`);
        }

        // Converte a resposta em JSON
        const pedidos = await response.json();
        console.log('Pedidos carregados:', pedidos); // Log para verificar os dados recebidos

        // Verifica se a resposta é um array
        if (!Array.isArray(pedidos)) {
            throw new Error('Formato de resposta inválido. Esperado um array de pedidos.');
        }

        // Seleciona a tabela onde os pedidos serão exibidos
        const tabelaPedidos = document.getElementById('tabela-pedidos');
        tabelaPedidos.innerHTML = ''; // Limpa os pedidos anteriores

        // Para cada pedido, cria uma linha na tabela
        pedidos.forEach(pedido => {
            // Verifica se o pedido contém os campos necessários
            const nomeUsuario = pedido.usuario ? pedido.usuario.nome : 'Nome não disponível';
            const mesa = pedido.mesa || 'Indisponível';  // Verifica se a mesa está presente
            const status = pedido.status || 'Status não disponível';
            
            // Formata a data e hora de criação do pedido, se disponível
            const dataHora = pedido.criadoEm ? new Date(pedido.criadoEm).toLocaleString('pt-BR') : 'Data/Hora não disponível';

            // Cria uma nova linha na tabela para exibir o pedido
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${pedido.id}</td>
                <td>${nomeUsuario}</td>
                <td>${mesa}</td>
                <td>${status}</td>
                <td>${dataHora}</td> <!-- Exibe Data/Hora -->
                <td>
                    <button class="btn btn-success" onclick="marcarComoConcluido('${pedido.id}')">Concluir</button>
                </td>
            `;
            tabelaPedidos.appendChild(linha);
        });
    } catch (error) {
        // Exibe um erro caso a requisição falhe
        console.error('Erro ao carregar pedidos:', error);
        alert('Erro ao carregar os pedidos. Verifique o console para mais detalhes.');
    }
}

// Função para marcar um pedido como concluído
async function marcarComoConcluido(pedidoId) {
    try {
        // Envia uma requisição PUT para marcar o pedido como concluído
        const response = await fetch(`http://localhost:5000/marcar-concluido/${pedidoId}`, {
            method: 'PUT', // Usando PUT para atualizar o pedido
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Verifica se a resposta da requisição foi bem-sucedida
        if (response.ok) {
            alert('Pedido concluído com sucesso!');
            carregarPedidos(); // Recarrega a lista de pedidos
        } else {
            alert('Erro ao concluir o pedido.');
        }
    } catch (error) {
        // Exibe erro caso a requisição para marcar como concluído falhe
        console.error('Erro ao marcar como concluído:', error);
        alert('Erro ao marcar o pedido como concluído.');
    }
}

// Carrega os pedidos assim que a página for carregada
carregarPedidos();
