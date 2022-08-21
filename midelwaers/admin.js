
module.exports = function (req, res, next) { 
  // 401 Unauthorized
  // 403 Forbidden 
  
  if (req.user.isadmin !== true) return res.status(403).send({message : 'دسترسی ممنوع'});

  next();
}