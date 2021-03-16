const mongoose = require("mongoose");

const DB = process.env.DATABASE;
console.log(DB);
mongoose.connect(DB, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
.then(()=>{
    console.log(`Connected to ${DB} instance ...`)
})
.catch(err=>{
    console.log(err);
})


module.exports = mongoose;
