const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const validateLogin = require('./middlewares/validateLogin');
const validateName = require('./middlewares/validateName');
const validateToken = require('./middlewares/validateToken');
const validateAge = require('./middlewares/validateAge');
const { validateTalk, validateWatchedAt, validateRate } = require('./middlewares/validateTalk');
// const talker = require('./talker.json');
// const writeFile = require('fs/promises');

const app = express();
app.use(express.json());

const talkerPath = path.resolve(__dirname, './talker.json');

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

// -----------Meu código começa a partir daqui----------------

// função que gera o token
function generateToken() {
  const token = crypto.randomBytes(8).toString('hex');
  return token;
 }

// função que lê o arquivo talker.json
async function getTalkers() {
  const arrayTalker = path.resolve(__dirname, 'talker.json');
  try {
    const readTalker = await fs.readFile(arrayTalker, 'utf-8');
    const talkers = JSON.parse(readTalker);
    return talkers;
  } catch (error) {
    return [];
  }
}

// retorna um array com todas as pessoas palestrantes cadastradas
app.get('/talker', async (_req, res) => {
  try {
    const talkers2 = await getTalkers();
    res.status(200).json(talkers2);
  } catch (error) {
    res.status(200).send([]);
  }
});

// retorna uma pessoa palestrante com base no id da rota
app.get('/talker/:id', async (req, res) => {
  try {
    const talkers2 = await getTalkers();
    const talkerId = talkers2.find(({ id }) => id === Number(req.params.id));

    if (!talkerId) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    return res.status(200).json(talkerId);
  } catch (error) {
    console.error(error);
  }
  });

// retorna um token aleatório de 16 caracteres
app.post('/login', validateLogin, (_req, res) => {
  try {
    const token = generateToken();
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// adiciona uma nova pessoa palestrante ao seu arquivo
app.post('/talker', validateToken, validateName, validateAge,
  validateTalk, validateWatchedAt, validateRate, async (req, res) => {
    const { name, age, talk } = req.body;
    const readTalk = await getTalkers();
    const id = readTalk[readTalk.length - 1].id + 1;
    // console.log(id);
   
    const newTalker = { id, name, age, talk };
    const readNewTalker = JSON.stringify([...readTalk, newTalker]);

    console.log(newTalker);

    await fs.writeFile(talkerPath, readNewTalker);
    return res.status(201).json(newTalker);
});

// edita uma pessoa palestrante com base no id da rota
app.put('/talker/:id', validateToken, validateName, validateAge,
validateTalk, validateWatchedAt, validateRate, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  
  const readTalk = await getTalkers();
  const idTalk = readTalk.findIndex((t) => t.id === Number(id));
  
  readTalk[idTalk] = { name, age, talk, id: Number(id) };
 if (idTalk < 0) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
 }
 await fs.writeFile(talkerPath, JSON.stringify(readTalk));
 return res.status(200).json({ name, age, talk, id: Number(id) });
});

// deleta uma pessoa palestrante com base no id da rota
app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  
  const readTalk = await getTalkers();
  const idTalk = readTalk.findIndex((t) => t.id !== Number(id));

  fs.writeFile(talkerPath, JSON.stringify(idTalk));
 return res.status(204).end();
});
