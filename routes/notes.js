
var express = require('express');
var router = express.Router();
const db = require('../database')
const bodyparser = require('body-parser');
router.use(bodyparser.json()); // for parsing application/json
router.use(bodyparser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/* GET home page. */
router.get('/form', function (req, res, next) {
    res.render('notes/addNotes', { title: 'Express' });
});


router.get('/view', (req, res) => {
    let sql = `SELECT nt.project_id, nt.note, nt.id, pt.project_title, pt.project_start_dt FROM amberapp2.notes nt, amberapp2.projects pt where pt.id = nt.project_id `;
    // let sql2 = "SELECT * FROM amberapp2.notes";
    db.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('notes/viewNotes', {
            title: 'Notes Table',
            notes: rows

        });
    });
});


router.get('/edit/:noteId', (req, res) => {
    const note_id = req.params.noteId;
    let sql = `SELECT * FROM amberapp2.notes WHERE notes.id = ${note_id};`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('notes/editNotes', {
            title: 'NoteEdit',
            note: result[0]
        });
    });
});

router.post('/edit/:projectId/update', (req, res) => {
    const projectId = req.params.projectId;
    const noteId = req.body.id;

    let noteSql = `UPDATE amberapp2.notes SET notes.note = '${req.body.note}' WHERE notes.project_id = ${projectId} AND notes.id = ${noteId};`;

    db.query(noteSql, (err, noteResults) => {
        if (err) throw err;

        res.redirect('/notes/view')
    })
});



router.post('/add', (req, res) => {
    let data = {
        project_id: req.body.project_id,
        note: req.body.note,
        active_date: new Date(Date.now())
    };

    let sqlQuery = "INSERT INTO notes SET ?";


    db.query(sqlQuery, data, (err, results) => {
        if (err) throw err;
        // res.send(JSONResponse(results));
        res.redirect('/notes/view')
    });
});


module.exports = router;