const url = require("url");
var validator = require('validator');

const category = require("./../models/category");

sq2g = (req,res,next)=>{
        var urlobj = url.parse(req.url,true);
        if(!urlobj.query.category || !validator.isAlphanumeric(urlobj.query.category))
        {
            return res.redirect("/setquiz1");
        }
        return category
        .findOne({category:urlobj.query.category})
        .then(res1 =>{
                    var error=false;
                    var oldvalue={};
                    oldvalue.q = urlobj.query.q;
                    oldvalue.q1 = urlobj.query.q1;
                    if(urlobj.query.qe == "true")
                    {
                        error=true;
                    }
                    if(!res1)
                    {
                        return res.render("sqname",{
                            setter:req.user.setter,
                            category:urlobj.query.category,
                            qname:[],
                            error:error,
                            oldvalue:oldvalue
                        });
                    }
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
                        return res.render("sqname",{
                            setter:req.user.setter,
                            category:urlobj.query.category,
                            qname:res1.quizzes,
                            error:error,
                            oldvalue:oldvalue
                        });
                });

    };
        
    sq2p = (req,res,next)=>{
            var error=false;
            var dop = ["0","1","2"];
            if(req.user.setter == false)
            {
                return res.render("attended",{result:"sorry you are not allowed to set yet"});
            }
            if(!req.body.category || !validator.isAlphanumeric(req.body.category))
            {
                return res.redirect("/setquiz1");
            }

            if( (req.body.qname[0] && req.body.qname[1]) || (req.body.qname[0] == "" &&!validator.isAlphanumeric(req.body.qname[1])) )
            {
                if((req.body.qname[0] == "" && req.body.qname[1] == "") || (req.body.qname[0] == "" &&!validator.isAlphanumeric(req.body.qname[1])))
                {
                    error=true;
                }
                return res.redirect("/setquiz2?category="+req.body.category+"&q="+req.body.qname[0]+"&q1="+req.body.qname[1]+"&qe="+error);
            }

            category
                .findOne({category:req.body.category})
                .then((res1)=>{
                    if(!res1)
                    {
                        res1 = new category({category:req.body.category[0].toUpperCase()+req.body.category.slice(1),
                                            quizzes:[]});
                    }
                    res1.quizzes.push({name:req.body.qname[0]? req.body.qname[0] : req.body.qname[1][0].toUpperCase()+req.body.qname[1].slice(1),
                        imgurl:"iquiz.png",
                        quizid:[null,null,null],
                        user:{userid:req.user._id,name:req.user.username}
                            });
                    return res1.save(()=>{
                        return res.redirect("setquiz3?sid="+res1.quizzes[res1.quizzes.length-1]._id+"&js=0");
                    });
                });
    };
    
        module.exports = {sq2g,sq2p};