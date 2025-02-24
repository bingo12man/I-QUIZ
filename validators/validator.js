const { body } = require('express-validator');

module.exports.isvalid1 = [
    body('fname', 'firstname has to be of min-lenght 5.')
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body('lname', 'lastname has to be of min-lenght 1.')
      .isLength({ min: 1 })
      .isAlphanumeric(),
    body('mail')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('username', 'username has to be of min-lenght 5.')
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body('password', 'Password has to be of lenght 8.')
      .isLength({ min: 8 }),
    body('confirmpassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      })
];

module.exports.isvalid2 = [
  body('username', 'username has to be of min-lenght 5.')
    .isLength({ min: 5 })
    .isAlphanumeric(),
  body('password', 'Password has to be of lenght 8.')
    .isLength({ min: 8 })
];

module.exports.isvalid3 = [
  body('difficulty')
  .custom((value, { req }) => {
    var darr = ["0","1","2"];
    if (!(value in darr)) {
      throw new Error('difficulty should be selected');
    }
    return true;
  }),
  body('noq')
    .isNumeric()
    .custom((value, { req }) => {
      if (value < 3 || value > 15) {
        throw new Error('no of questions ( 3 to 15 )');
      }
      return true;
    })
];