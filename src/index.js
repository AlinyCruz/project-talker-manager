const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json());

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
 function generateToken() {
  const token = crypto.randomBytes(8).toString('hex');
  return token;
 } 

async function getTalkers() {
  const arrayTalker = path.resolve(__dirname, 'talker.json');
  console.log(arrayTalker);
  try {
    const readTalker = await fs.readFile(arrayTalker, 'utf-8');
    const talkers = JSON.parse(readTalker);
    console.log(talkers);
    return talkers;
  } catch (error) {
    return [];
  }
}

getTalkers();

app.get('/talker', async (req, res) => {
  try {
    const talkers2 = await getTalkers();
    res.status(200).json(talkers2);
  } catch (error) {
    res.status(200).send([]);
  }
});

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

  app.post('/login', async (req, res) => {
      const { email, password } = req.body;

      if (!email && !password) {
        return res.status(401).send({ message: '401 Unauthorized' });
      }
      const token = generateToken();
      return res.status(200).json({ token });
  }); 
