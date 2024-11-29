 // Função para carregar os pedidos do Firebase ou backend
 async function carregarPedidos() {
    try {
        const response = await fetch('http://localhost:5000/get-pedidos');
        
        if (!response.ok) {
            console.error(`Erro ao buscar pedidos: ${response.statusText}`);
            throw new Error(`Erro ao buscar pedidos: ${response.statusText}`);
        }

        const pedidos = await response.json();
        console.log('Pedidos carregados:', pedidos); // Verifique o que está sendo retornado

        if (!Array.isArray(pedidos)) {
            throw new Error('Formato de resposta inválido. Esperado um array de pedidos.');
        }

        const tabelaPedidos = document.getElementById('tabela-pedidos');
        tabelaPedidos.innerHTML = '';

        pedidos.forEach(pedido => {
            // Verifique se o pedido e os campos necessários estão definidos
            const nomeUsuario = pedido.usuario ? pedido.usuario.nome : 'Nome não disponível';
            const mesa = pedido.mesa || 'Indisponível';  // Verificando se a mesa está presente
            const status = pedido.status || 'Status não disponível';
            
            // Verificando o campo "criadoEm" para a data e hora
            const dataHora = pedido.criadoEm ? new Date(pedido.criadoEm).toLocaleString('pt-BR') : 'Data/Hora não disponível';  // Formatação da data e hora

            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${pedido.id}</td>
                <td>${nomeUsuario}</td>
                <td>${mesa}</td>
                <td>${status}</td>
                <td>${dataHora}</td> <!-- Exibindo Data/Hora -->
                <td>
                    <button class="btn btn-success" onclick="marcarComoConcluido('${pedido.id}')">Concluir</button>
                </td>
            `;
            tabelaPedidos.appendChild(linha);
        });
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        alert('Erro ao carregar os pedidos. Verifique o console para mais detalhes.');
    }
}

// Função para marcar um pedido como concluído
async function marcarComoConcluido(pedidoId) {
    try {
        const response = await fetch(`http://localhost:5000/marcar-concluido/${pedidoId}`, {
            method: 'PUT', // Usamos PUT para atualizar o pedido
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            alert('Pedido concluído com sucesso!');
            carregarPedidos(); // Recarrega a lista de pedidos
        } else {
            alert('Erro ao concluir o pedido.');
        }
    } catch (error) {
        console.error('Erro ao marcar como concluído:', error);
        alert('Erro ao marcar o pedido como concluído.');
    }
}

// Carregar pedidos quando a página for carregada
carregarPedidos();