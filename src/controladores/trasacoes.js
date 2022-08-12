let { contas, saques, depositos, transferencias } = require('../bancodedados');
const { format } = require('date-fns');

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: 'o numero da conta e o valor são obrigatórios' });
    }

    const contaEncontrada = contas.find(conta => Number(conta.numero) === Number(numero_conta));

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'conta não encontrada' })
    }

    if (valor <= 0) {
        return res.status(404).json({ mensagem: 'o valor não pode ser menor ou igual a zero' })
    }

    contaEncontrada.saldo += valor;

    const registro = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        valor,
        numero_conta
    }

    depositos.push(registro);
    return res.status(201).send();

}


const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: 'o numero da conta, senha e o valor são obrigatórios' });
    }

    const contaEncontrada = contas.find(conta => Number(conta.numero) === Number(numero_conta));

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'conta não encontrada' })
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'senha inválida' })
    }

    if (contaEncontrada.saldo < valor) {
        return res.status(403).json({ mensagem: 'saldo insuficiente' })
    }

    contaEncontrada.saldo -= valor;

    const registro = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        valor,
        numero_conta
    }

    saques.push(registro);
    return res.status(201).send();
}

const transferir = (req, res) => {

    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ mensagem: 'o numero da conta, senha e o valor são obrigatórios' });
    }

    const contaOrigemEncontrada = contas.find(conta => Number(conta.numero) === Number(numero_conta_origem));

    if (!contaOrigemEncontrada) {
        return res.status(404).json({ mensagem: 'conta não encontrada' })
    }

    const contaDestinoEncontrada = contas.find(conta => Number(conta.numero) === Number(numero_conta_destino));

    if (!contaDestinoEncontrada) {
        return res.status(404).json({ mensagem: 'conta não encontrada' })
    }

    if (contaOrigemEncontrada.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'senha inválida' })
    }

    if (contaOrigemEncontrada.saldo < valor) {
        return res.status(403).json({ mensagem: 'saldo insuficiente' })
    }

    contaOrigemEncontrada.saldo -= valor;
    contaDestinoEncontrada.saldo += valor;

    const registro = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        valor,
        numero_conta_origem,
        numero_conta_destino
    }

    transferencias.push(registro);
    return res.status(201).send();

}

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'o numero da conta e a senha são obrigatórios' });
    }

    const contaEncontrada = contas.find(conta => Number(conta.numero) === Number(numero_conta))

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'conta não encontrada' })
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'senha inválida' })
    }

    return res.status(201).json({ saldo: contaEncontrada.saldo })
}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'o numero da conta e a senha são obrigatórios' });
    }

    const contaEncontrada = contas.find(conta => Number(conta.numero) === Number(numero_conta))

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'conta não encontrada' })
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'senha inválida' })
    }

    const depositoExtrato = depositos.filter(deposito => Number(deposito.numero_conta) === Number(numero_conta) );

    const saqueExtrato = saques.filter(saque => Number(saque.numero_conta) === Number(numero_conta))

    const transferenciaEnviada = transferencias.filter(transferencia =>  Number(transferencia.numero_conta_origem) === Number(numero_conta) )

    const transferenciaDestino = transferencias.filter(transferencia =>  Number(transferencia.numero_conta_destino) === Number(numero_conta) )

    res.status(201).json({depósitos: depositoExtrato,
        saques: saqueExtrato,
        transferenciaEnviada,
        transferenciaDestino
    })
}

module.exports = {
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}