var models = require('../models/models.js');

// Autoload
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
            where: {
                id: Number(quizId)
            },
            include: [{
                model: models.Comment
            }]
        }).then(function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else{next(new Error('No existe quizId=' + quizId));}
    }
  ).catch(function(error){next(error)});
};

// GET /quizes
exports.index = function(req, res) {

  //Si se indica un término de búsqueda, se realiza la búsqueda
	if (typeof req.query.search != 'undefined'){
		//Se incluyen los operadores % para hacer la búsqueda con cualquier aparición de los términos
		var search = req.query.search;
		search = '%'+search.replace(' ','%')+'%';
		models.Quiz.findAll({where: ["pregunta like ?", search]}).then(function(quizes){
			res.render('quizes/index', { quizes: quizes, errors: []});
		});
	}
	else {
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index', { quizes: quizes, errors: []});
		});
	}
};
// GET /quizes/:id
exports.show = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz) {
    res.render('quizes/show', { quiz: req.quiz, errors: []});
  })
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build( // crea objeto quiz
    { pregunta: 'Pregunta', respuesta: 'Respuesta', tema: 'Otro' }
  );
  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta", "tema"]})
        .then( function(){ res.redirect('/quizes')})
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  );

// guarda en DB los campos pregunta y respuesta de quiz
//  quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){
//    res.redirect('/quizes');
//  })   // res.redirect: Redirección HTTP a lista de preguntas
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz) {
    if (req.query.respuesta === req.quiz.respuesta) {
      res.render('quizes/answer',
                 { quiz: req.quiz, respuesta: 'Correcto' , errors: []});
    } else {
      res.render('quizes/answer',
                 { quiz: quiz, respuesta: 'Incorrecto', errors: []});
    }
  })
};

// GET /quizes/:id/edit
exports.edit = function(req, res, next){
  var quiz = req.quiz; // autoload de instancia de quiz
  res.render('quizes/edit', {quiz: quiz, errors: []});
}


// PUT /quizes/:id
exports.update = function(req, res){
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  req.quiz
  .validate()
  .then(
    function(err){
      if(err){
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      }else{
        req.quiz  // save: guarda campos pregunta y respuesta en DB
        .save({fields: ["pregunta","respuesta", "tema"]})
        // Redirección HTTP a lista de preguntas (URL relativo)
        .then(function(){res.redirect('/quizes');});
      }
    }
  )
}

// DELETE /quizes/:id
exports.destroy = function(req, res){
  req.quiz.destroy().then(function(){
    res.redirect('/quizes');
  }).catch(function(error){
    next(error)
  });
}
