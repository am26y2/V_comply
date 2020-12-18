const express=require('express')
const dotenv=require('dotenv')
const connectDB=require('./config/db')
const user =require('./routes/users')
const auth =require('./routes/auth')
const employee =require('./routes/employee')
dotenv.config();
const app=express() 

connectDB();

app.use(express.json({extended:false}))
app.use('/api/users',user);
app.use('/api/auth',auth);
app.use('/api/employee',employee);
const port=process.env.PORT||8000;
app.listen(port, console.log(`Server begins in ${port} in ${process.env.MODE}`))