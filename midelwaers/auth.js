const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  console.log("auth token is ===============>" + token)
  if (!token) return res.status(401).send({message : 'دسترسی شما به این قسمت محدود می باشد.'});

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.jwtPrivateKey);
    console.log("decoded is ===============>" + decoded);
  } catch (ex) {
    return res.status(403).send({message : 'توکن ارسالی نامعتبر می باشد'} );
  }
  req.user = decoded;
  console.log("decoded is ===============> next");
  next();
}