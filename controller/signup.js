const bcrypt = require('bcryptjs');

const user = require("./../models/user");
const { validationResult } = require('express-validator');

signup = (req,res,next) => {

    fname=req.body.fname;
    lname=req.body.lname;
    email=req.body.mail;
    username=req.body.username;
    password=req.body.password;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render("signup",{
            errorMessage: errors.array()[0].msg,
            oldinput: {
                fname : fname,
                lname: lname,
                mail: email,
                username: username,
            },
            validationErrors: errors.array()
        });
      }

    user
        .findOne({username:username})
        .then(user1 => {
            if (user1) 
            {
                res.status(422).render("signup",{
                    errorMessage: 'username exists',
                    oldinput: {
                        fname : fname,
                        lname: lname,
                        mail: email,
                        username: username,
                    },
                    validationErrors: [{param:'username'}]
                });
            }
            else
            {
                user
                    .findOne({email:email})
                    .then(user2 => {
                        if (user2) 
                        {
                            res.status(422).render("signup",{
                                errorMessage: 'email exists',
                                oldinput: {
                                    fname : fname,
                                    lname: lname,
                                    mail: email,
                                    username: username,
                                },
                                validationErrors: [{param:'mail'}]
                            });
                        }
                        else
                        {
                            return bcrypt
                                        .hash(password, 12)
                                        .then(hashedPassword => {
                                            const user3 = new user({
                                                fname:fname,
                                                lname:lname,
                                                email:email,
                                                username:username,
                                                password:hashedPassword,
                                                no_of_quiz:0,
                                                total_score:0,
                                                total_possible_score:0,
                                                setter:false,
                                                attended_quiz:[]
                                            });
                                            return user3.save();
                                        })
                                        .then(result => {
                                            res.redirect('/login');
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        })
        .catch(err => {
            console.log(err);
        });

    // const user1 = new user({
    //     fname:fname,
    //     lname:lname,
    //     email:email,
    //     username:username,
    //     password:password
    // });
    // user1
    //     .save()
    //     .then((result) => {
    //         res.redirect("/login");
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
}

module.exports = signup;