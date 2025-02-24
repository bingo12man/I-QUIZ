const category = require("./../models/category");

quizset=(req,res,next)=>{
    return category
    .find()
    .then(res1 =>{

        res1.forEach((item,index,object)=>{

               item.quizzes.forEach((item1,index1,object1)=>{
                        
                if(!item1.user)
                {
                    object1[index1] = null;
                }
                if(!item1.user.userid)
                {
                    object1[index1] = null;
                }
                if(item1.user && item1.user.userid && item1.user.userid.toString() != req.user.id.toString())
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


        res.render("quizzesset",{
                                categories:res1,
                                setter:req.user.setter,
                                });
    });  
};

module.exports = {quizset};