// Used for error management

module.exports.res = (res, status) => {
  res.status(status).end();
};
