const express = require('express');
const contas = require('./controladores/contas')
const transacoes = require('./controladores/trasacoes')

const rotas = express();

rotas.get('/contas', contas.listarContas)
rotas.post('/contas', contas.criarContas)
rotas.put('/contas/:numeroConta/usuario', contas.atualizarUsuarioConta)
rotas.delete('/contas/:numeroConta', contas.deletarConta)
rotas.post('/transacoes/depositar', transacoes.depositar )
rotas.post('/transacoes/sacar', transacoes.sacar )
rotas.post('/transacoes/transferir', transacoes.transferir )
rotas.get('/contas/saldo', transacoes.saldo )
rotas.get('/contas/extrato', transacoes.extrato )

module.exports = rotas;