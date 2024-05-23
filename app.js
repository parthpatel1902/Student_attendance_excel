const express = require('express'); 
const port = process.env.PORT || 1025;    
require('./db/config');
const app = express();
app.use(express.json());

const studentRouter = require('./router/R_student');
app.use(studentRouter);

app.listen(port,()=>{
    console.log(`Server is Running on ${port}`);
})

