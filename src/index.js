const express = require('express');
const fs = require('fs').promises;
const path = require('path');

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

//----------- Meu código começa a partir daqui ----------------//

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
};

getTalkers();

app.get('/talker', async (req, res) => {
  try {
    const talkers2 = await getTalkers();
    res.status(200).json(talkers2);
  } catch (error) {
    res.status(200).send([]);
  }
});