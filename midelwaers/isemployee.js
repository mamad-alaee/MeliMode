
module.exports = function (req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden
  console.log("=====> in isemployee <==========")

  if (req.user.isemployee !== true) return res.status(403).send({message: 'دسترسی ممنوع'});

  console.log("=====> in isemployee  next<==========")
  next();
}