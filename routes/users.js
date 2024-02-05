const mongoose=require('mongoose')
const plm=require('passport-local-mongoose')
 mongoose.connect('mongodb://127.0.0.1:27017/Pinterest')
  const userSchema=mongoose.Schema({
    profileimage:String,
    fullname:String,
    username:String,
    description:String,
    email:String,
    password:String,
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    }],
    saved:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'post'
    }
    ]
   
  })
  userSchema.plugin(plm);
  module.exports=mongoose.model('user',userSchema)
