const category = require("./../models/category");

atten = (req,res,next) => {
    return category
    .find()
    .then(res1 =>{

        res1.forEach((item,index,object)=>{

               item.quizzes.forEach((item1,index1,object1)=>{
                        
                        item1.quizid.forEach((item2,index2,object2)=>{
                            if(!req.user.attended_quiz.length)
                            {
                                object2[index2] = null;
                            }
                            else if(!req.user.attended_quiz.find((q)=>{
                                if(q.quiz_id.toString() == (item2?item2.toString():item2) && q.status == true)
                                return true;
                             }))
                            {
                                object2[index2] = null;
                            }
                            else
                            {
                                var id = req.user.attended_quiz.findIndex((q)=>{
                                    if(q.quiz_id.toString() == (item2?item2.toString():item2) && q.status == true)
                                    return true;
                                 });
                                object2[index2] = {
                                                qid:object2[index2],
                                                tots:req.user.attended_quiz[id].total_score,
                                                totps:req.user.attended_quiz[id].total_possible_score
                                                };
                            }
                            
                        });

                        if(!item1.quizid[0]&&!item1.quizid[1]&&!item1.quizid[2])
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


        res.render("attendedquiz",{
                                categories:res1,
                                setter:req.user.setter,
                                });
    });  
};

module.exports = atten;