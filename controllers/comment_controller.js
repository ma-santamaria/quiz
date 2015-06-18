var models = require('../models/models.js');
var helpers = require('./helpers.js');

// Autoload :commentId de comentarios
exports.load = function (req, res, next, commentId) {
  models.Comment.find({
    where: { id: Number(commentId) }
  })
  .then(function (comment) {
    if (comment) {
      req.comment = comment;
      next();
    } else {
      next(new Error('No existe commentId=' + commentId));
    }
  }).catch(function (error) { next(error); });
};

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
    var errors = helpers.errToArray(err);

    res.render('comments/new.ejs', { quizid: req.params.quizId, comment: comment, errors: errors });
  } else {
    comment.save() // guardamos el comentario en la BD
    .then( function() { res.redirect('/quizes/' + req.params.quizId); });
  } // TODO: Falta catch para errores
};

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function (req, res) {
  req.comment.publicado = true;

  req.comment.save( { fields: ["publicado"] })
  .then( function () {
    res.redirect('/quizes/' + req.params.quizId);
  })
  .catch(function (error) { next(error); });
};
