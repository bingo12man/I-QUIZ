module.exports = (req, res, next) => {
    if(req.user.setter == false)
    {
        return res.render("attended",{result:"sorry you are not allowed to set yet"});
    }
    next();
}