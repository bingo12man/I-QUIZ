const url = require("url");
var validator = require('validator');
const { validationResult } = require('express-validator');
var objectID = require("mongodb").ObjectID

const quiz = require("./../models/quiz");
const category = require("./../models/category");

sq5g = (req,res,next)=>{
    var urlobj = url.parse(req.url,true);
    var darr = ["0","1","2"];
    var noq = parseInt(urlobj.query.nq)
    if(!urlobj.query.sid || !urlobj.query.nq || !urlobj.query.d || !validator.isMongoId(urlobj.query.sid) || !(urlobj.query.d in darr) || !noq || noq < 3 || noq > 15)
    {
        res.redirect("/setquiz1");   
    }
    else{
        res.render("setquestion",{
                sid:urlobj.query.sid,
                setter:req.user.setter,
                difficulty:urlobj.query.d,
                noq:urlobj.query.nq,
                error:false
        });
    }
};


sq5p = (req,res,next)=>{
    var darr = ["0","1","2"];
    if(!req.body.sid || !req.body.noq || !req.body.difficulty || !validator.isMongoId(req.body.sid) || !(req.body.difficulty in darr) || !req.body.noq || req.body.noq < 3 || req.body.noq > 15)
    {
        res.redirect("/setquiz1");   
    }
    else
    {
        var ov = new Array(req.body.noq);
        var e = new Array(req.body.noq);
        var error = false;
        for (var i = 0; i < req.body.noq; i++) {
            ov[i] = new Array(7);
            e[i] = new Array(7);
            ov[i][0] = eval("req.body.q"+(i+1));
            ov[i][1] = eval("req.body.q"+(i+1)+"o1");
            ov[i][2] = eval("req.body.q"+(i+1)+"o2");
            ov[i][3] = eval("req.body.q"+(i+1)+"o3");
            ov[i][4] = eval("req.body.q"+(i+1)+"o4");
            ov[i][5] = eval("req.body.q"+(i+1)+"a");
            ov[i][6] = eval("req.body.q"+(i+1)+"p");
            if(!ov[i][0] || !validator.isLength(ov[i][0],{min:1,max:300}))
            {
                error = true;
                e[i][0] = 1;
            }
            else
            {
                e[i][0] = 0;
            }
            if(!ov[i][1] || !validator.isLength(ov[i][1],{min:1,max:55}))
            {
                error = true;
                e[i][1] = 1;
            }
            else
            {
                e[i][1] = 0;
            }
            if(!ov[i][2] || !validator.isLength(ov[i][2],{min:1,max:55}))
            {
                error = true;
                e[i][2] = 1;
            }
            else
            {
                e[i][2] = 0;
            }
            if(!ov[i][3] || !validator.isLength(ov[i][3],{min:1,max:55}))
            {
                error = true;
                e[i][3] = 1;
            }
            else
            {
                e[i][3] = 0;
            }
            if(!ov[i][4] || !validator.isLength(ov[i][4],{min:1,max:55}))
            {
                error = true;
                e[i][4] = 1;
            }
            else
            {
                e[i][4] = 0;
            }
            var a = parseInt(ov[i][5])
            if(!a || a < 1 || a > 4)
            {
                error = true;
                e[i][5] = 1;
            }
            else
            {
                e[i][5] = 0;
            }
            var p = parseInt(ov[i][6])
            if(!p || p < 3 || p > 15)
            {
                error = true;
                e[i][6] = 1;
            }
            else
            {
                e[i][6] = 0;
            }
        }
        if(error)
        {       
            res.render("setquestion",{
                sid:req.body.sid,
                setter:req.user.setter,
                difficulty:req.body.difficulty,
                noq:req.body.noq,
                ov:ov,
                e:e,
                error:true
             });
        }
        else
        {
            var questions = [];
            for (var i = 0; i < req.body.noq; i++) {
                questions.push({
                    question:ov[i][0],
                    options:[ov[i][1],ov[i][2],ov[i][3],ov[i][4]],
                    answer:parseInt(ov[i][5]),
                    points:parseInt(ov[i][6])
                })
            }
            var newq = new quiz({questions:questions});
            var error = false;
            newq.save(()=>{
                category
                    .findOne({quizzes:{$elemMatch:{_id:new objectID(req.body.sid)}}})
                    .then((res1)=>{
                            var quizid = [];
                            if(!res1)
                            {
                                return res.redirect("/setquiz1");
                            }
                            else
                            {
                            res1.quizzes.forEach((q,i)=>{
                                if(q._id == req.body.sid)
                                {
                                    if(q.user.userid != req.user.id)
                                    {
                                        error = true;
                                        return res.render("attended",{result:"not your quiz"});
                                        
                                    }
                                    if(q.quizid[parseInt(req.body.difficulty)] != null)
                                    {
                                        error = true;
                                        return res.render("attended",{result:"quiz already set"});
                                    }
                                    else
                                    {
                                        quizid.push(q.quizid[0]);
                                        quizid.push(q.quizid[1]);
                                        quizid.push(q.quizid[2]);
                                        quizid[parseInt(req.body.difficulty)] = newq._id;
                                        q.quizid = quizid;
                                    }
                                }
                            });
                            if(!error)
                            {
                                res1.save(()=>{
                                req.user.quizzes_set.push(newq._id);
                                req.user.save(()=>{
                                    return res.redirect("/quizzesset");
                                });
                            }); 
                            }
                            
                        }
                    });
            });
        }
    }

};


module.exports = {sq5g,sq5p};