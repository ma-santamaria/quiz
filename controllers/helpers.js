// Funciones auxiliares
exports.sanitize = function (str) {
  var tmp = str || "";
  return "%" + tmp.trim().replace(/ /g, "%") + "%";
};

exports.errToArray = function (err) {
  var errArray = [];
  var i = 0;

  for (var p in err) {
    errArray[i++] = { message: err[p] };
  }

  return errArray;
};
