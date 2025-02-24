const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  category: {type:String , required:true},
  quizzes: [{
      name: {type:String , required:true},
      user: {userid:{type:Schema.Types.ObjectId,ref:'user'},name:{type:String}},
      imgurl: {type:String},
      star:{type:Number},
      noa:{type:Number},
      quizid:[{type:Schema.Types.ObjectId,ref:'quiz'}]
  }]
});

categorySchema.statics.addAttend = function(quizid) {
  return this.model("category")
              .find()
              .then((cat)=>{
                var uq;
                cat.forEach((q)=>{
                  q.quizzes.forEach((d)=>
                  {
                    d.quizid.forEach((qid)=>{
                      if(qid == quizid)
                      {
                        if(d.noa == null)
                        {
                          d.noa = 1;
                        }
                        else
                        {
                          d.noa++;
                        }
                        uq = q;
                      }
                    });
                  });
                });
                return uq;
              })
              .then((uq)=>{
                if(!uq)
                {
                  return;
                }
                return uq.save();
              });
}

module.exports = mongoose.model('category', categorySchema,'categorys');
