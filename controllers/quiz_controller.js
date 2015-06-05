var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function (req, res, next, quizId) {
  models.Quiz.find(quizId).then(function (quiz) {
    if (quiz) {
      req.quiz = quiz;
      next();
    } else {
      next(new Error('No existe quizId=' + quizId));
    }
  });
};

// GET /quizes
exports.index = function (req, res) {
  // SQLite busca con like sin tener en cuenta la capitalización
  // Para obtener el mismo resultado en postgresql hacemos la búsqueda en minúsculas
  models.Quiz.findAll({
          where: ["lower(pregunta) like ?", sanitize(req.query.search).toLowerCase()],
          order: ["pregunta"] // orden alfabético de las preguntas
          })
  .then(function (quizes) {
    res.render('quizes/index.ejs', { quizes: quizes });
  }).catch(function (error) { next(error); });
};

// GET /quizes/:quizId
exports.show = function (req, res) {
  res.render('quizes/show', { quiz: req.quiz });
};

// GET /quizes/:quizId/answer
exports.answer = function (req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado});
};

// GET /quize/new
exports.new = function (req, res) {
  var quiz = models.Quiz.build(
    { pregunta: "Pregunta", respuesta: "Respueta" }
  );

  res.render('quizes/new', { quiz: quiz });
};

// POST /quizes/create
exports.create= function (req, res) {
  var quiz = models.Quiz.build(req.body.quiz);

  // guarda en la BD los campos y pregunta la respuesta de quiz
  quiz.save( { fields: ["pregunta", "respuesta"] })
  .then(function () {
    res.redirect('/quizes'); // redirección HTTP a la lista de preguntas
  });
};

// Funciones auxiliares
function sanitize(str) {
  var tmp = str || "";
  return "%" + tmp.trim().replace(/ /g, "%") + "%";
}
