// valida o campo idade
const validateAge = (req, res, next) => {
  const { age } = req.body;
  
  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (Number(age) < 18 || !Number(age) || !Number.isInteger(age)) {
    return res.status(400)
      .json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' });
  }
  // if (typeof authorization !== 'string') {
  //   return res.status(401).json({ message: 'Token inválido' });
  // }
  return next();
};

module.exports = validateAge;