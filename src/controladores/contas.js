let { banco, contas, ultimoId } = require('../bancodedados')

const listarContas = (req, res) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(400).json({ mensagem: "A senha do banco informada é obrigatória!" })
    }

    if (senha_banco !== banco.senha) {
        return res.status(400).json({ mensagem: "A senha do banco informada é inválida!" })
    }

    return res.json(contas);
}

const criarContas = (req, res) => {
    const { nome, email, cpf, data_nascimento, telefone, senha } = req.body;

    if (!nome || !email || !cpf || !data_nascimento || !telefone || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    const contaExistente = contas.find(conta => {
        return conta.usuario.cpf === cpf || conta.usuario.email === email
    })

    if (contaExistente) {
        return res.status(400).json({ mensagem: 'Email ou Cpf já existe' })
    }

    const novaConta = {
        numero: ultimoId++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    contas.push(novaConta);
    return res.status(201).send();
}

const atualizarUsuarioConta = (req, res) => {
    const { nome, email, cpf, data_nascimento, telefone, senha } = req.body;
    const { numeroConta } = req.params;

    if (!nome || !email || !cpf || !data_nascimento || !telefone || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    const contaEncontrada = contas.find(conta => {
        return conta.numero === Number(numeroConta);
    })

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "conta inexistente" });
    }

    if (cpf !== contaEncontrada.usuario.cpf) {
        const cpfEncontrado = cpf.find(conta => {
            return conta.usuario.cpf === cpf
        })

        if (cpfEncontrado) {
            return res.status(400).json({ mensagem: 'cpf existente já cadastrado' });
        }
    }

    if (email !== contaEncontrada.usuario.email) {
        const emailEncontrado = email.find(conta => {
            return conta.usuario.email === email
        })

        if (emailEncontrado) {
            return res.status(400).json({ mensagem: 'cpf existente cadastrado' });
        }
    }
    contaEncontrada.usuario = {nome, email, cpf, data_nascimento, telefone, senha}
    return res.status(204).send();
}

const deletarConta = (req, res) => {
    const {numeroConta} = req.params;
    const contaEncontrada = contas.find(conta => {
        return Number(conta.numero) === Number(numeroConta)
    })
    
    if (!contaEncontrada) {
        return res.status(404).json({mensagem: 'conta inexistente'})
    }

    if (contaEncontrada.saldo > 0) {
        return res.status(403).json({mensagem: 'a conta só pode ser excluida se o saldo for 0'})
    }

    contas = contas.filter(conta => {
        return  Number(conta.numero) !== Number(numeroConta)
    })
    return res.status(204).send();
}

module.exports = {
    listarContas,
    criarContas,
    atualizarUsuarioConta,
    deletarConta
}