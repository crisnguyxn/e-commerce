const express= require('express');
const dbConnect = require('./configs/dbConnect');
const authRouter = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const productRouter = require('./routes/productRoutes')
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const app = express()
const dotenv = require('dotenv').config()
const port = process.env.PORT || 4000;


dbConnect()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())
app.use("/api/user",authRouter)
app.use("/api/product",productRouter)
app.use(notFound)
app.use(errorHandler)
app.listen(port,() => {
    console.log(`server is running at PORT: ${port}`);
})