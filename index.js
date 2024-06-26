const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const AuthRoute = require('./routes/AuthRoute.js');
const UserRoute = require('./routes/UserRoute.js');
// const db = require('./models/index.js');
const MessageRoute = require('./routes/MessageRoute.js');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// db.sequelize
//     .sync()
//     .then(() => {
//         console.log('Database connected');
//     })
//     .catch((err) => {
//         console.error('Database connection error:', err);
//     });

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(AuthRoute);
app.use(UserRoute);
app.use(MessageRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
