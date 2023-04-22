// valida o campo talk
const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  
  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
  return next();
};

// valida o campo watchedAt
const validateWatchedAt = (req, res, next) => {
  const { watchedAt } = req.body.talk;
  const dataFormat = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

  if (!watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }

  if (dataFormat.test(watchedAt) === false) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  return next();
};

// valida o campo rate
const validateRate = (req, res, next) => {
  const { rate } = req.body.talk;
  if (rate === undefined) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (Number(rate) < 1 || Number(rate) > 5 || !Number.isInteger(rate)) {
    // console.log(rate);
    return res.status(400)
      .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  return next();
};

module.exports = { validateTalk, validateWatchedAt, validateRate };