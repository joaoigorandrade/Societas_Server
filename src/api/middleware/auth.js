const validateUserId = (req, res, next) => {
  console.log(req.headers)
  const userId = req.headers['x-user-id'];
  console.log(userId)
  if (!userId) {
    return res.status(401).send({ error: 'User ID not provided in the headers' });
  }
  next();
};

module.exports = {
  validateUserId,
};