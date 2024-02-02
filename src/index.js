const express = require("express");
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();

const userRouter = require('./routes/userRoutes.js')
const expenseRouter = require('./routes/expenseRoutes.js')


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'utils'));

//routers
app.use('/users', userRouter)
app.use('/expenses', expenseRouter)


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
