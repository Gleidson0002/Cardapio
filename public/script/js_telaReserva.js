// Adiciona o evento de 'submit' ao formulário de reserva
document.getElementById('forms').addEventListener('submit', async (event) => {
  // Impede o envio do formulário para realizar o processo de forma assíncrona
  event.preventDefault();

  // Coleta os dados preenchidos no formulário
  const nome = document.getElementById('name-reserv').value;
  const telefone = document.getElementById('number-reserv').value;
  const data = document.getElementById('date-reserv').value;
  const horario = document.getElementById('time-reserv').value;
  const pessoas = document.getElementById('people-reserv').value;
  const mesas = document.getElementById('table-reserv').value;

  // Cria um objeto com os dados da reserva
  const reserva = { nome, telefone, data, horario, pessoas, mesas };

  try {
      // Realiza a requisição POST para adicionar a reserva
      const response = await fetch('/adicionar-reserva', {
          method: 'POST', // Método de envio da requisição
          headers: { 'Content-Type': 'application/json' }, // Tipo de conteúdo enviado
          body: JSON.stringify(reserva), // Dados da reserva convertidos para JSON
      });

      // Verifica se a resposta foi bem-sucedida
      if (response.ok) {
          // Exibe uma mensagem de sucesso
          alert('Reserva realizada com sucesso!');
          // Reseta os campos do formulário
          document.getElementById('forms').reset();
      } else {
          // Se houver erro, exibe a mensagem de erro retornada pelo servidor
          const errorMessage = await response.text();
          alert(`Erro ao realizar reserva: ${errorMessage}`);
      }
  } catch (error) {
      // Em caso de erro durante a comunicação com o servidor
      console.error('Erro ao enviar a reserva:', error);
      alert('Erro ao realizar reserva. Tente novamente.');
  }
});
