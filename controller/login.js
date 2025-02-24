const bcrypt = require('bcryptjs');

const user = require("./../models/user");
const { validationResult } = require('express-validator');

login = (req,res,next) => {

    username = req.body.username;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render("login",{
            errorMessage: errors.array()[0].msg,
            oldinput: {
                username: username,
            },
            validationErrors: errors.array()
        });
    }

    user
        .findOne({username:username})
        .then(user => {
            if(!user)
            {
                res.status(422).render("login",{
                    errorMessage: 'user does not exists',
                    oldinput: {
                        username: username,
                    },
                    validationErrors: [{param:'username'}]
                });
            }
            else
            {
                bcrypt
                    .compare(req.body.password, user.password)
                    .then(doMatch => {
                        if (doMatch) {
                            req.session.isLoggedIn = true;
                            req.session.user = user;
                            return req.session.save(err => {
                                console.log(err);
                                res.redirect("/dashboard");
                            });
                        }
                        res.status(422).render("login",{
                            errorMessage: 'wrong password',
                            oldinput: {
                                username: username,
                            },
                            validationErrors: [{param:'password'}]
                        });
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

module.exports = login;