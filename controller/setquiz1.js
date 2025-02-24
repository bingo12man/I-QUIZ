const url = require("url");
var validator = require('validator');

const category = require("./../models/category");

sq1g = (req,res,next) => {
    var urlobj = url.parse(req.url,true);
    if(urlobj.query.e)
    {
        return category
        .find({},"category")
        .then((res1)=>{
            res.render("scategory",{
                setter:req.user.setter,
                categorys:res1,
                error:true
                });
        });    
    }
    return category
                .find({},"category")
                .then((res1)=>{
                    res.render("scategory",{
                        setter:req.user.setter,
                        categorys:res1,
                        error:false
                        });
                });
}

sq1p = (req,res,next) => {
    console.log(req.body.category[1]);
    if(req.body.category[0] == "" && req.body.category[1] == "" )
    {
        return res.status(422).redirect("/setquiz1?e=true");
    }

    if(req.body.category[0] == "")
    {
        if(!validator.isAlphanumeric(req.body.category[1]))
            return res.status(422).redirect("/setquiz1?e=true");
        return res.redirect("/setquiz2?category="+req.body.category[1]);
    }
    else
    {
        return res.redirect("/setquiz2?category="+req.body.category[0]);
    }
    
};

module.exports = {sq1g,sq1p};