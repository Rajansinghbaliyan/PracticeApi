const dotenv = require('dotenv');
const app = require('./app');
dotenv.config({path:'./config.env'});

require('./util/database');

const port = process.env.PORT;

app.listen(port,()=>{
    console.log(`Server is listening to port ${port} ...`);
})