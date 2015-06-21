// Definición del modelo de Quiz

var Subject = require('./subject.js');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Quiz',
          {
            pregunta: {
              type: DataTypes.STRING,
              validate: { notEmpty: { msg: "-> Falta pregunta"} }
            },
            respuesta: {
              type: DataTypes.STRING,
              validate: { notEmpty: { msg: "-> Falta respuesta"}}
            },
            tema: {
              type: DataTypes.STRING,
              validate: {
                notEmpty: { msg: "-> Falta temática"},
                isIn: {
                  args: [Subject.temasAceptados],
                  msg: "-> Tema no válido"
                }
              }
            }
          }
          // ,
          // {
          //   classMethods: {
          //     countCommented: function () {
          //       return models.sequelize // ver como acceder a sequelize desde aquí
          //       .query("SELECT COUNT(DISTINCT(`QuizId`)) as `count` FROM `Comments`") // devolver solo la promesa
          //       .spread(function (results, metadata) { // esto no creo que sea necesario hacerlo
          //         numCommented = results[0].count;
          //       });
          //     }
          //   }
          // }
          );
};
