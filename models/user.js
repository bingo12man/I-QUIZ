const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fname: {type:String , required:true},
  lname: {type:String , required:true},
  email: {type:String , required:true},
  username: {type:String , required:true},
  password: {type:String , required:true},
  no_of_quiz: {type:Number , required:true},
  total_score: {type:Number , required:true},
  total_possible_score: {type:Number , required:true},
  setter: {type:Boolean , required:true},
  quizzes_set: [{type:Schema.Types.ObjectId,ref:'quiz',required:true}],
  attended_quiz: [
                  {_id:false,
                    quiz_id:{type:Schema.Types.ObjectId,
                      ref:'quiz',required:true},
                      time:{type:Date , required:true},
                      total_score: {type:Number , required:false},
                      total_possible_score: {type:Number , required:false},
                      status: {type:Boolean , required:true},
                      reviewStatus:{type:Boolean , required:false},
                    }]
});

module.exports = mongoose.model('user', userSchema);
