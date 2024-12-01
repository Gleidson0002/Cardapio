// Função para ordenar as reservas por data (ordem crescente)
function ordenarReservas(reservas) {
    return reservas.sort((a, b) => new Date(a.data) - new Date(b.data)); // Ordenação por data crescente
}

// Função assíncrona para carregar e exibir as reservas
async function carregarReservas() {
    try {
        // Realiza uma requisição GET para buscar as reservas no servidor
        const response = await fetch('/reservas');
        
        // Verifica se a resposta da requisição foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao carregar as reservas');
        }

        // Converte a resposta para JSON
        const reservas = await response.json();

        // Ordena as reservas pela data
        const reservasOrdenadas = ordenarReservas(reservas);

        // Seleciona o elemento da página onde as reservas serão exibidas
        const reservasList = document.getElementById('reservas-list');

        // Limpa o conteúdo anterior para exibir as novas reservas
        reservasList.innerHTML = '';

        // Itera sobre as reservas ordenadas e cria um card para cada uma
        reservasOrdenadas.forEach(reserva => {
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-4'); // Adiciona classes para formatação do card

            // Define o conteúdo do card com as informações da reserva
            card.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${reserva.nome}</h5>
                        <p class="card-text"><strong>Telefone:</strong> ${reserva.telefone}</p>
                        <p class="card-text"><strong>Data:</strong> ${reserva.data}</p>
                        <p class="card-text"><strong>Horário:</strong> ${reserva.horario}</p>
                        <p class="card-text"><strong>Pessoas:</strong> ${reserva.pessoas}</p>
                        <p class="card-text"><strong>Mesas:</strong> ${reserva.mesas}</p>
                    </div>
                </div>
            `;

            // Adiciona o card à lista de reservas na página
            reservasList.appendChild(card);
        });

    } catch (error) {
        // Exibe um erro caso a requisição falhe ou ocorra algum problema
        console.error('Erro ao carregar as reservas:', error);
        alert('Erro ao carregar as reservas.');
    }
}

// Evento que é disparado quando o conteúdo da página é carregado
document.addEventListener('DOMContentLoaded', carregarReservas);
