var validator = require('validator');

const quiz = require("./../models/quiz");

ans = (req,res,next) => {
    if(!validator.isMongoId(req.params.quizid))
    {
        return  res.redirect("/dashboard");
    }
    if(req.user.quizzes_set && req.user.quizzes_set.find((q)=>{
        if(q == req.params.quizid)
         return true
     }))
     {
        return quiz
        .findById(req.params.quizid)
        .then(q => {
            if(!q)
            {
                return  res.redirect("/dashboard");
            }
            res.render("answer",{
                setter:req.user.setter,
                questions:q.questions,
                });
        })
     }
     else
     {
        if(!req.user.attended_quiz || !req.user.attended_quiz.find((q)=>{
            console.log(q.quiz_id," ",req.params.quizid,"\n")
            if(q.quiz_id.toString() == req.params.quizid.toString())
             return true
         }))
        {
            return res.render("attended",{result:"Not attended"});
        }
        else if(req.user.attended_quiz && req.user.attended_quiz.find((q)=>{
            console.log(q.quiz_id," ",req.params.quizid,"\n")
            if(q.quiz_id.toString() == req.params.quizid.toString() && !q.status)
             return true
         }))
        {
            return res.render("attended",{result:"Not attended"});
        }
        else
        {
            return quiz
                    .findById(req.params.quizid)
                    .then(q => {
                        if(!q)
                        {
                            return  res.redirect("/dashboard");
                        }
                        res.render("answer",{
                            setter:req.user.setter,
                            questions:q.questions,
                            });
                    })
        }
     }
    
}

module.exports = {ans};