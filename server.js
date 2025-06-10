const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 3000;

// Conexão com MongoDB
mongoose.connect('mongodb+srv://admin:admin123@donatio.ibhk0zy.mongodb.net/?retryWrites=true&w=majority&appName=Donatio', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB conectado"))
.catch(err => console.error("❌ Erro MongoDB:", err));

// Schemas
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
const User = mongoose.model('User', userSchema);

const doacaoSchema = new mongoose.Schema({
    doador: String,
    valor: Number,
    data: Date
});
const Doacao = mongoose.model('Doacao', doacaoSchema);

// Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'segredo-super-seguro',
    resave: false,
    saveUninitialized: false
}));

// Rotas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.send('<p>Usuário não encontrado. <a href="/">Voltar</a></p>');

    const senhaOk = await bcrypt.compare(password, user.password);
    if (!senhaOk) return res.send('<p>Senha incorreta. <a href="/">Voltar</a></p>');

    req.session.authenticated = true;
    res.redirect('/painel.html');
});

app.get('/painel.html', (req, res, next) => {
    if (req.session.authenticated) {
        return next();
    }
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// Rota de teste para criar um usuário
app.get('/registrar-admin', async (req, res) => {
    const hash = await bcrypt.hash('1234', 10);
    await User.create({ email: 'admin@teste.com', password: hash });
    res.send('Usuário admin criado');
});

// DOAÇÕES
app.post('/doacoes', async (req, res) => {
    if (!req.session.authenticated) return res.status(401).send('Não autorizado');
    const { doador, valor, data } = req.body;
    await Doacao.create({ doador, valor, data });
    res.status(201).send('Doação registrada');
});

app.get('/doacoes', async (req, res) => {
    if (!req.session.authenticated) return res.status(401).send('Não autorizado');
    const doacoes = await Doacao.find();
    res.json(doacoes);
});

app.listen(PORT, () => console.log(`🚀 Servidor em http://localhost:${PORT}`));
