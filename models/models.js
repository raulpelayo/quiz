var path = require('path');

//Cargar modelo ORM
var Sequelize = require ('sequelize');

//Usar BBDD sqlite3
var sequelize = new Sequelize (null, null, null ,
              {dialect:"sqlite", storage: "quiz.sqlite"}
                    );

//Importar la definición de la tabla Quiz desde quiz.js
var Quiz = sequelize.import (path.join(__dirname,'quiz'));
//Exportar defición de la tabla
exports.Quiz = Quiz;

//Crear e inicializar tabla
sequelize.sync().success(function(){
  Quiz.count().success(function (count){
    if (count === 0) {
      Quiz.create({pregunta: 'Capital de Italia', respuesta: 'Roma'
    }).success(function(){console.log('BBDD inicializada')})
    };
  });
});
