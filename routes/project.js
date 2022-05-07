var express = require('express');
var router = express.Router();
const db = require('../database')
const bodyparser = require('body-parser');

router.use(bodyparser.json()); // for parsing application/json
router.use(bodyparser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded




/* GET home page. */
// router.get('/view', function (req, res, next) {
//     res.render('projects/viewProjects', { title: 'Express' });
// });


router.get('/form', function (req, res, next) {
    res.render('projects/addProject', { title: 'Express' });
});


router.get('/view', (req, res) => {
    let sql = `SELECT * FROM amberapp2.projects; `;
    let sql2 = "SELECT amberapp2.notes.note, amberapp2.notes.active_date, amberapp2.projects.project_title FROM amberapp2.notes LEFT JOIN amberapp2.projects ON amberapp2.projects.id = amberapp2.notes.project_id;";
    db.query(sql, (err, projects) => {
        if (err) throw err;

        db.query(sql2, (err, notes) => {
            if (err) throw err;

            res.render('projects/viewProjects', {
                title: 'projects Table',
                projects: projects,
                notes: notes
            });
        });
    });

    // db.query(sql2, (err, rows) => {
    //     if (err) throw err;
    //     res.render('projects/viewProjects', {
    //         title: 'notes Table',
    //         notes: rows

    //     });
    // });
})

// router.get('/notes', (req, res) => {
//     let sql = "SELECT * FROM amberapp2.notes";
//     db.query(sql, (err, rows) => {
//         if (err) throw err;
//         res.render('projects/viewProjects', {
//             title: 'Notes Table',


//         });
//     });
// })




router.post('/add', (req, res) => {
    let projectData = {
        project_title: req.body.project_title,
        project_description: req.body.project_description,
        project_start_dt: req.body.project_start_dt,
        project_due_dt: req.body.project_due_dt
    };


    let projectQuery = "INSERT INTO projects SET ?";
    let noteQuery = "INSERT INTO notes SET ?";


    db.query(projectQuery, projectData, (err, proResults) => {
        if (err) throw err;

        let noteData = {
            note: req.body.note,
            project_id: proResults.insertId,
            active_date: new Date(Date.now())
        };

        db.query(noteQuery, noteData, (err, rows, noteResults) => {
            if (err) throw err;
            res.redirect('/project/view')

        })
    });
});

router.get('/edit/:projectId', (req, res) => {
    const id = req.params.projectId;
    let sql = `SELECT pt.id,  pt.project_title, pt.project_description, pt.project_start_dt, pt.project_due_dt, nt.project_id, nt.note FROM amberapp2.projects pt LEFT JOIN amberapp2.notes nt ON pt.id= nt.project_id WHERE pt.id =${id} `;

    db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('projects/editProjects', {
            title: 'Project Edit',
            project: result[0],
            // note: result[0]
        });
    });
});


router.post('/edit/:projectId/update', (req, res) => {
    const id = req.params.projectId;
    let projectSql = "update amberapp2.projects SET project_title='" + req.body.project_title + "',  project_description='" + req.body.project_description + "',  project_start_dt='" + req.body.project_start_dt + "',  project_due_dt='" + req.body.project_due_dt + "' where id =" + id;
    let noteSql = `update amberapp2.notes SET note= '${req.body.note}' Where project_id = ${id}`;

    db.query(projectSql, (err, proResults) => {
        if (err) throw err;

        db.query(noteSql, (err, noteResults) => {
            if (err) throw err;
            res.redirect('/project/view')

        })
    });
});


router.get('/delete/:projectId', (req, res) => {
    const id = req.params.projectId;
    let sql = `DELETE from amberapp2.projects where id = ${id}`;
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/project/view')
    });
});
module.exports = router;