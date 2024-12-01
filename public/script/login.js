// Adiciona o evento de 'submit' ao formulário de login
document.getElementById('loginForm').addEventListener('submit', function (event) {
    // Impede o envio padrão do formulário, permitindo um envio assíncrono
    event.preventDefault();

    // Coleta os dados preenchidos no formulário (email e senha)
    const email = document.getElementById('exampleInputEmail1').value;
    const password = document.getElementById('exampleInputPassword1').value;

    // Envia os dados para o servidor via API POST para autenticação
    fetch('/login', {
        method: 'POST', // Método de envio da requisição
        headers: {
            'Content-Type': 'application/json' // Define o tipo de conteúdo como JSON
        },
        body: JSON.stringify({ email, senha: password }) // Converte os dados para JSON antes de enviar
    })
    .then(response => response.text()) // Recebe a resposta como texto
    .then(data => {
        // Se o login for bem-sucedido, redireciona o usuário para o dashboard
        if (data === 'Login bem-sucedido!') {
            Swal.fire({
                title: 'Login confirmado!',
                text: "Bem-vindo(a)!",
                icon: 'success', // Ícone de sucesso
                confirmButtonText: 'Entrar' // Texto do botão de confirmação
            }).then(() => {
                window.location.href = '/dashboard'; // Redireciona para a página de dashboard
            });
        } else {
            // Caso o login falhe, exibe uma mensagem de erro
            Swal.fire({
                title: 'Login não confirmado!',
                text: "Senha ou email incorretos",
                icon: 'error', // Ícone de erro
                confirmButtonColor: '#d33', // Cor do botão de erro
                confirmButtonText: 'Sair' // Texto do botão de confirmação
            }).then(() => {
                window.location.href = '/login'; // Redireciona de volta para a página de login
            });
        }
    })
    .catch(error => {
        // Caso haja algum erro durante a requisição
        console.error('Erro ao autenticar usuário:', error);
        Swal.fire({
            title: 'Erro de Conexão!',
            text: "Não foi possível conectar ao servidor.",
            icon: 'error', // Ícone de erro
            confirmButtonColor: '#d33', // Cor do botão de erro
            confirmButtonText: 'Tentar Novamente' // Texto do botão de tentativa
        });
    });
});
