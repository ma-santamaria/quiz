var models = require('../models/models.js');

// TODO: extraer temasAceptados, ¿tipo de datos virtual en el modelo?
var temasAceptados = ['Otro', 'Humanidades', 'Ocio', 'Ciencia', 'Tecnología'];

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
    res.render('quizes/index.ejs', { quizes: quizes, errors: [] });
  }).catch(function (error) { next(error); });
};

// GET /quizes/:quizId
exports.show = function (req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: [] });
};

// GET /quizes/:quizId/answer
exports.answer = function (req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {
              quiz: req.quiz,
              respuesta: resultado,
              errors: []
            });
};

// GET /quizes/new
exports.new = function (req, res) {
  var quiz = models.Quiz.build(
    { pregunta: "Pregunta", respuesta: "Respuesta", tema: "Otro" }
  );

  res.render('quizes/new', { quiz: quiz, errors: [], temas: temasAceptados });
};

// POST /quizes/create
exports.create= function (req, res) {
  var quiz = models.Quiz.build(req.body.quiz);

  // quiz
  // .validate()
  // .then( function (err) {
  //   if (err) {
  //     res.render('quizes/new', { quiz: quiz, errors: err.errors });
  //   } else {
  //     // guarda en la BD los campos y pregunta la respuesta de quiz
  //     quiz.save({ fields: ["pregunta", "respuesta"] })
  //     .then(function () {
  //       res.redirect('/quizes'); // redirección HTTP a la lista de preguntas
  //     });
  //   }
  // });

  // las líneas anteriores contienen el código visto en las transparencias,
  // al parecer hay algún problema que impide llamar a la promesa then (¿versiones?)
  // se utiliza la siguiente sugerencia del foro en su lugar:
  // https://www.miriadax.net/web/javascript-node-js/foro/-/message_boards/view_message/34207346

  var err = quiz.validate();

  if (err) {
    var errors = errToArray(err);

    res.render('quizes/new', { quiz: quiz, errors: errors, temas: temasAceptados });
  } else {
    // guarda en la BD los campos y pregunta la respuesta de quiz
    quiz.save({ fields: ["pregunta", "respuesta", "tema"] })
    .then(function () {
      res.redirect('/quizes'); // redirección HTTP a la lista de preguntas
    });
  }
};

// GET /quizes/:quizId/edit
exports.edit = function (req, res) {
  var quiz = req.quiz; // aquí lo guarda Autoload
  res.render('quizes/edit', { quiz: quiz, errors: [], temas: temasAceptados });
};

// PUT /quizes/:quizId
exports.update = function (req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  var err = req.quiz.validate();

  if (err) {
    var errors = errToArray(err);

    res.render('quizes/edit', { quiz: req.quiz, errors: errors, temas: temasAceptados });
  } else {
    // guarda en la BD los campos y pregunta la respuesta de quiz
    req.quiz
    .save({ fields: ["pregunta", "respuesta", "tema"] })
    .then(function () {
      res.redirect('/quizes'); // redirección HTTP a la lista de preguntas
    });
  }
};

// DELETE /quizes/:quizId
exports.destroy = function (req, res) {
  req.quiz.destroy()
  .then(function () {
    res.redirect('/quizes');
  }).catch(function (error) { next(error); });
};

// Funciones auxiliares
function sanitize(str) {
  var tmp = str || "";
  return "%" + tmp.trim().replace(/ /g, "%") + "%";
}

function errToArray(err) {
  var errArray = [];
  var i = 0;

  for (var p in err) {
    errArray[i++] = { message: err[p] };
  }

  return errArray;
}
