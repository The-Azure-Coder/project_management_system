
const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const layout = require('express-ejs-layouts')
const app = express();
const router = express.Router();
const db = require('./database')

// var conn = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "Root",
//     database: "amberapp1"
// });

db.connect((err) => {
    if (!err)
        console.log('Connected to database Successfully');
    else
        console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
});

var homeRouter = require('./routes/home')
var notesRouter = require('./routes/notes')
var projectRouter = require('./routes/project')

app.use(layout)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/images', express.static('images'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout')

app.use('/', homeRouter);
app.use('/notes', notesRouter);
app.use('/project', projectRouter);




//Specify the Port to listen on
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}..`));



function JSONResponse(results, err_code = 200, err_msg = 'null') {
    return JSON.stringify({ "status_code": err_code, "error": err_msg, "message": results });
}

function redirectTo(locationURL) {
    response.writeHead(301, {
        Location: locationURL
    }).end();
}

// //Default Route
// app.get('/' , (req, res) => {
//     var strHTML = "<h1>Invalid Route!!</h1> <br/> <a href='/students'>Click Here To Start</a>";
//     res.send(strHTML);

//     }); 

module.export = conn;