var models = require('../models/models.js');

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
  res.render('comments/new.ejs', { quizid: req.params.quizId, errors: [] });
};

// POST /quizes/:quizId/comments
exports.create = function(req, res) {
  var comment = models.Comment.build(
    {
      texto: req.body.comment.texto,
      QuizId: req.params.quizId
    }
  );

  var err = comment.validate();

  if (err) {
    var errors = errToArray(err);

    res.render('comments/new.ejs', { quizid: req.params.quizId, comment: comment, errors: errors });
  } else {
    comment.save() // guardamos el comentario en la BD
    .then( function() { res.redirect('/quizes/' + req.params.quizId); });
  } // TODO: Falta catch para errores
};

// Funciones auxiliares

function errToArray(err) {
  var errArray = [];
  var i = 0;

  for (var p in err) {
    errArray[i++] = { message: err[p] };
  }

  return errArray;
}
