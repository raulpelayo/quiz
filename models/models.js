var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

//Cargar modelo ORM
var Sequelize = require ('sequelize');

//Usar BBDD sqlite3 o Pstgres
var sequelize = new Sequelize(DB_name, user, pwd,
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }
);
//Importar la definición de la tabla Quiz desde quiz.js
var Quiz = sequelize.import (path.join(__dirname,'quiz'));
//Exportar defición de la tabla
exports.Quiz = Quiz;

//Crear e inicializar tabla
sequelize.sync().then(function(){
  Quiz.count().then(function (count){
    if (count === 0) {
      Quiz.create({pregunta: 'Capital de Italia', respuesta: 'Roma'
    }).then(function(){console.log('BBDD inicializada')})
    };
  });
});
