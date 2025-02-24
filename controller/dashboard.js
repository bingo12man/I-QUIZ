const category = require("./../models/category");

dash = (req,res,next) => {
    return category
                .find()
                .then(res1 =>{
            
                    res1.forEach((item,index,object)=>{

                           item.quizzes.forEach((item1,index1,object1)=>{
                                    
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

                                    if(object1[index1] &&  req.user.quizzes_set && req.user.quizzes_set.find((q)=>{
                                        if(q == req.params.quizid)
                                         return true
                                     }))
                                     {
                                        object1[index1] = null;
                                     }
                           });
                            
                    });

                    res1.forEach((item)=>{

                        item.quizzes = item.quizzes.filter((item1)=>{

                        return item1 != null;

                        });
                        
                         
                    });

                    res1 = res1.filter((item)=>{

                                            return item.quizzes.length !== 0;
                                            
                                        });
                    // console.log(res1);
                    var sma = [];
                    var t,t1;
                    res1.forEach((cat)=>{
                                cat.quizzes.sort((a,b)=>{
                                        var n1=a.noa?a.noa:0;
                                        var n2=b.noa?b.noa:0;
                                        return n2-n1;
                                });
                                t = cat.quizzes.length;
                                for(i=0;i<cat.quizzes.length;i++)
                                {
                                    if(!cat.quizzes[i])
                                    {
                                        continue;
                                    }
                                    for(j=i+1;j<cat.quizzes.length;j++)
                                    {
                                        if(!cat.quizzes[j])
                                        {
                                            continue;
                                        }
                                        if(cat.quizzes[j].name == cat.quizzes[i].name)
                                        {
                                            delete cat.quizzes[j];
                                        }
                                    }
                                }
                                cat.quizzes = cat.quizzes.filter((v1)=>{
                                    return v1;
                                });
                                t1 = cat.quizzes.length;
                                cat.quizzes = cat.quizzes.filter((v1,i1)=>{
                                    return i1 <= 3;
                                });
                                if(t<=4&&t==t1)
                                {
                                    sma.push(0);
                                }
                                else
                                {
                                    sma.push(1);
                                }

                    });
                    res.render("dashboard",{
                                            categories:res1,
                                            setter:req.user.setter,
                                            sma:sma
                                            });
                });  
}

profile = (req,res,next) => {
    res.render("profile",{
                        name:req.user.username,
                        no_of_quiz:req.user.no_of_quiz,
                        total_score:req.user.total_score,
                        total_possible_score:req.user.total_possible_score
                        });
}

module.exports = {dash,profile};