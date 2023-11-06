function getError(error) {
    if(error.code == 'auth/invalid-login-credentials') {
        return 'Usuário não autorizado... Verifique o Email ou Senha.'
    }
}