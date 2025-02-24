const user = require("./../models/user");
const category = require("./../models/category");
const quiz = require("./../models/quiz");

var ts1 = 0;

rescal = (req,res,next) => {
    
    return user
            .findById(req.user._id)
            .then(user => {
                if(user.quizzes_set && user.quizzes_set.find((q)=>{
                    if(q == req.params.quizid)
                     return true
                 }))
                 {
                        return res.render("attended",{result:"your quiz"});
                 }
                if(user)
                {
                    if(user.attended_quiz && user.attended_quiz.find((q)=>{
                        ts1 = q.time;
                        if(q.quiz_id==req.body.quizid && q.status==true)
                         return true
                     }))
                    {
                        res.redirect("/dashboard");
                        return;
                    }
                    else{
                        return user;
                    }
                    
                }
            })
            .then((user) => {
                if(user)
                { 
                    return quiz
                        .findById(req.body.quizid)
                        .then(quiz => {
                            let ts = Date.now();
                            let date1 = new Date(ts);
                            let date2 = new Date(ts1);
                            if((date1-date2)/1000 >= quiz.questions.length*12)
                            {
                                return res.render("attended",{result:"sorry forbidden"});
                            }
                            else
                            {
                                user.no_of_quiz += 1;
                                aqi=user.attended_quiz.findIndex((q)=>{
                                    if(q.quiz_id==req.body.quizid && q.status==false)
                                     return true
                                 });
                                user.attended_quiz[aqi].status = true;
                                var result = [];
                                var total = 0;
                                var totalpos = 0;
                                var setter = false;
                                for(i=1 ; i<=quiz.questions.length ; i++)
                                {
                                    var sel = eval("req.body.q"+i);
                                    if(sel === quiz.questions[i-1].options[quiz.questions[i-1].answer-1])
                                    {
                                        user.total_score += quiz.questions[i-1].points;
                                        total += quiz.questions[i-1].points;
                                        result.push({op:sel,r:true});
                                    }
                                    else
                                    {
                                        result.push({op:sel,r:false});
                                    }
                                    user.total_possible_score += quiz.questions[i-1].points;
                                    totalpos += quiz.questions[i-1].points;
                                }
                                user.attended_quiz[aqi].total_score = total;
                                user.attended_quiz[aqi].total_possible_score = totalpos;
                                if(user.setter == false)
                                {
                                    if(user.total_score >= 50)
                                    {
                                        setter=true;
                                        user.setter=true;
                                    }
                                }
                                category.addAttend(req.body.quizid);
                                return user
                                    .save()
                                    .then(()=>{
                                        req.user = user;
                                        res.render("result",{
                                            setter:req.user.setter,
                                            questions:quiz.questions,
                                            result:result,
                                            total:total,
                                            totalpos:totalpos,
                                            newsetter:setter,
                                            qid:req.body.quizid
                                            });
                                    });
                                
                            }
                        });
                }
            })
            .catch(err => {
                console.log(err);
            });
}

module.exports = {rescal};