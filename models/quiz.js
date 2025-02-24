const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const quizSchema = new Schema({
  questions: [{
      _id:false,
      question: {type:String , required:true},
      options: [{type:String , required:true}],
      answer: {type:Number , required:true},
      points: {type:Number , required:true}
  }]
});

module.exports = mongoose.model('quiz', quizSchema,'quizs');