const url = require("url");

const category = require("./../models/category");

cat = (req,res,next) => {
    var urlobj = url.parse(req.url,true);
    return category
                .findOne({category:urlobj.query.name})
                .then(res1 =>{
                            if(!res1)
                            {
                                return res.redirect("/dashboard");
                            }

                           res1.quizzes.forEach((item1,index1,object1)=>{
                                    
                                    item1.quizid.forEach((item2,index2,object2)=>{
                                        
                                        if(req.user.attended_quiz && req.user.attended_quiz.find((q)=>{
                                            if(q.quiz_id.toString() == (item2?item2.toString():item2))
                                            return true;
                                         }))
                                        {
                                            object2[index2] = null;
                                        }
                                        if(req.user.quizzes_set && req.user.quizzes_set.find((q)=>{
                                            if(q.toString() == (item2?item2.toString():item2))
                                             return true
                                         }))
                                         {
                                            object2[index2] = null;
                                         }
                                        
                                    });

                                    if(!item1.quizid[0]&&!item1.quizid[1]&&!item1.quizid[2])
                                    {
                                        object1[index1] = null;
                                    }

                           });

                        res1.quizzes = res1.quizzes.filter((item1)=>{

                        return item1 != null;

                        });
                        
                        for(i=0;i<res1.quizzes.length;i++)
                                {
                                    if(!res1.quizzes[i])
                                    {
                                        continue;
                                    }
                                    for(j=i+1;j<res1.quizzes.length;j++)
                                    {
                                        if(!res1.quizzes[j])
                                        {
                                            continue;
                                        }
                                        if(res1.quizzes[j].name == res1.quizzes[i].name)
                                        {
                                            delete res1.quizzes[j];
                                        }
                                    }
                                }
                                res1.quizzes = res1.quizzes.filter((v1)=>{
                                    return v1;
                                });

                    res.render("category",{
                    name:res1.category,
                    quizzes:res1.quizzes,
                    setter:req.user.setter
                    });

                    });
                };

module.exports = cat;

                
