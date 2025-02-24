const path = require("path");
var validator = require('validator');

const user = require("./../models/user");
const quiz = require("./../models/quiz");

const time = 10;

qz = (req,res,next) => {
    if(!validator.isMongoId(req.params.quizid))
    {
        return  res.redirect("/dashboard");
    }
    return user
        .findById(req.user._id)
        .then(user => {
            if(user)
            {
                if(user.quizzes_set && user.quizzes_set.find((q)=>{
                    if(q == req.params.quizid)
                     return true
                 }))
                 {
                        return res.render("attended",{result:"your quiz"});
                 }
                if(user.attended_quiz && user.attended_quiz.find((q)=>{
                   if(q.quiz_id==req.params.quizid && q.status==true)
                    return true
                }))
                {
                    return res.render("attended",{result:"Already attended"});
                }
                else{
                    if(user.attended_quiz && user.attended_quiz.find((q)=>{
                        if(q.quiz_id==req.params.quizid && q.status==false)
                         return true
                     }))
                    {
                        return res.render("attended",{result:"sorry forbidden"});
                    }
                    else{
                        const date = Date.now();
                        user.attended_quiz.push({quiz_id:req.params.quizid,time:date,status:false});
                        return user
                                .save()
                                .then(()=>{
                                    req.user = user;
                                    return quiz
                                            .findById(req.params.quizid)
                                            .then(res1 => {
                                                if(!res1)
                                                {
                                                    return  res.redirect("/dashboard");
                                                }
                                                res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
                                                res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
                                                res.setHeader("Expires", "0");
                                                res.render("quiz",{
                                                                        questions:res1.questions,
                                                                        quizid:req.params.quizid,
                                                                        time:time
                                                                    });
                                            })
                                            .catch(err => {
                                                console.log(err);
                                            });
                                })
                        
                    }
                }
                
            }
        })
        

        
}

module.exports = {qz};