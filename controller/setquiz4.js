const url = require("url");
var validator = require('validator');
const { validationResult } = require('express-validator');

sq4g = (req,res,next)=>{
    var urlobj = url.parse(req.url,true);
    var darr = ["0","1","2"];
    if(!urlobj.query.sid)
    {
        return res.redirect("/setquiz1");
    }
    else if(!urlobj.query.d || !(urlobj.query.d in darr))
    {
        return res.render("setnq",{
            setter:req.user.setter,
            sid:urlobj.query.sid,
            d:false,
            validationErrors: [],
            oldvalue:{d:"",n:""}
        }); 
    }
    else
    {
        return res.render("setnq",{
            setter:req.user.setter,
            sid:urlobj.query.sid,
            d:urlobj.query.d,
            validationErrors: [],
            oldvalue:{d:"",n:""}
        }); 
    }

};


sq4p = (req,res,next)=>{

    const errors = validationResult(req);

    if(!validator.isMongoId(req.body.sid))
    {
        return res.redirect("/setquiz1");
    }

    if (!errors.isEmpty()) {
        if(req.body.h && !errors.array().find(e => e.param === 'difficulty'))
        {
            return res.render("setnq",{
                setter:req.user.setter,
                sid:req.body.sid,
                d:req.body.difficulty,
                validationErrors: errors.array(),
                oldvalue:{d:"",n:req.body.noq}
            }); 
        }
        else
        {
            return res.render("setnq",{
                setter:req.user.setter,
                sid:req.body.sid,
                d:false,
                oldvalue:{d:req.body.difficulty,n:req.body.noq},
                validationErrors: errors.array()
            });
        }
      }

      else
      {
              return res.redirect("/setquiz5?sid="+req.body.sid+"&d="+req.body.difficulty+"&nq="+req.body.noq);
        
      }
};


module.exports = {sq4g,sq4p};