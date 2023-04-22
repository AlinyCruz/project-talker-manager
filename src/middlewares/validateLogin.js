// valida o campo login: email e senha
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const emailFormat = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (emailFormat.test(email) === false) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }

  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  } 
  return next();
};

module.exports = validateLogin;