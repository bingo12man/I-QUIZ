const url = require("url");
var validator = require('validator');
var objectID = require("mongodb").ObjectID
var Sentiment = require('sentiment');

const category = require("./../models/category");

var sentiment1 = new Sentiment();

cg = (req,res,next) => {
    if(!validator.isMongoId(req.params.quizid))
    {
        return  res.redirect("/dashboard");
    }
    res.render("comment",{setter:req.user.setter,qid:req.params.quizid});
}

cp = (req,res,next) => {
    if(!validator.isMongoId(req.body.quizid))
    {
        return  res.redirect("/dashboard");
    }
    if(req.user.quizzes_set && req.user.quizzes_set.find((q)=>{
        if(q == req.body.quizid)
         return true
     }))
     {
            return res.render("attended",{result:"your quiz"});
     }
     if(req.user.quizzes_set && req.user.attended_quiz.find((q)=>{
        if(q.quiz_id == req.body.quizid && q.status==false)
         return true
     }))
    {
        return res.render("attended",{result:"sorry forbidden"});
    }
    else if(req.user.quizzes_set && req.user.attended_quiz.find((q)=>{
        if(q.quiz_id == req.body.quizid && q.reviewStatus)
         return true
     }))
    {
        return res.render("attended",{result:"Already commented"});
    }  
    else if(req.user.quizzes_set && req.user.attended_quiz.find((q)=>{
        if(q.quiz_id == req.body.quizid && !q.reviewStatus)
         return true
     }))
    {
        res.redirect("/dashboard");
        category
            .find()
            .then(res1 => {
                tosave = -1
                res1.forEach((item,index,object)=>{

                    item.quizzes.forEach((item1,index1,object1)=>{
                             
                             item1.quizid.forEach((item2,index2,object2)=>{
                                 
                                 if(req.body.quizid.toString() == (item2?item2.toString():item2))
                                 {
                                     var cres = sentiment1.analyze(req.body.comment).score/5;
                                     console.log(cres)
                                     if(!object1[index1].star)
                                     {
                                        object1[index1].star = cres;
                                     }
                                     else
                                     {
                                        var tres = (2*object1[index1].star + cres)/2;
                                        if(tres > 5)
                                        {
                                            object1[index1].star = 5;
                                        }
                                        else if(tres < 1)
                                        {
                                            object1[index1].star = 1;
                                        }
                                        else
                                        {
                                            object1[index1].star = tres;
                                        }
                                     }
                                     
                                     tosave = index
                                 }
                                 
                             });
                    });
                     
             });
             if(tosave != -1)
             {
                res1[tosave].save(()=>{
                })
             }
            });
    }
    else
    {
        return res.render("attended",{result:"Didn't attend the quiz"});
    }
};

module.exports = {cg,cp};