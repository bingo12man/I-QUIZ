const url = require("url");
var validator = require('validator');
var objectID = require("mongodb").ObjectID

const category = require("./../models/category");

sq3g = (req,res,next)=>{
    var urlobj = url.parse(req.url,true);  
    if(urlobj.query.e)
    {
        error=true;
    }
    else
    {
        error=false;
    }
    if(!urlobj.query.sid)
    {
        return res.redirect("/setquiz1");
    }

    return res.render("setimg",{
            setter:req.user.setter,
            sid:urlobj.query.sid,
            error:error,
            js:urlobj.query.js
        });
};

sq3p = (req,res,next)=>{
    var urlobj = url.parse(req.url,true);  

    if(!validator.isMongoId(req.body.sid))
    {
        return res.redirect("/setquiz1");
    }
    if(!req.file && !req.body.skip)
    {
        return res.redirect("/setquiz3?sid="+req.body.sid+"&js="+req.body.js+"&e=true");
    }
    else
    {
        category
            .findOne({quizzes:{$elemMatch:{_id:new objectID(req.body.sid)}}})
            .then((res1)=>{
                    if(!res1)
                    {
                        return res.redirect("/setquiz1");
                    }
                    if(!req.file && req.body.skip)
                    {
                        return res.redirect("/setquiz4?sid="+req.body.sid);
                    }
                    res1.quizzes.forEach((q,i)=>{
                        if(q._id == req.body.sid)
                        {
                            q.imgurl = req.file.filename;
                        }
                    });
                    res1.save(()=>{
                        if(req.body.js == 0)
                        {
                            res.redirect("/setquiz4?sid="+req.body.sid);
                        }
                        else
                        {
                            res.redirect("/quizzesset");
                        } 
                    });
            });
    }
};

module.exports = {sq3g,sq3p};

