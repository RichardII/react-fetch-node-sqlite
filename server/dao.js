"use strict";

const sqlite = require("sqlite3");

const db = new sqlite.Database("finthesis.db", (err) => {
    if (err) throw err;
});


// GET workareas 
exports.getAllWorkareas = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM workareas';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            if (rows == undefined) {
                resolve({ error: 'Workareas not found' });
            } else {
                const workareasList = rows.map(row => (
                    {
                        id: row.id,
                        name: row.name,
                        creatorID: row.creator_id
                    }))
                resolve(workareasList);
            }
        })
    })
}

// POST new workarea
exports.createWorkarea = (name) => {
    return new Promise((resolve, reject) => {
        let sql = 'INSERT INTO workareas (name, creator_id) VALUES (?, ?)';
        db.run(sql, [name, 1], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        })
    })
}

// UPDATE a workarea
exports.updateWorkarea = (id, name) => { 

    return new Promise((resolve, reject) => {
        const sql = 'UPDATE  workareas SET name = ? WHERE id = ?';
        db.run(sql, [name, id], err => {
            if (err) {
                reject(err);
                return;
            } else resolve(null);
        })
    })
}

// DELETE a workarea
exports.deleteWorkarea = (user, id) => {
    return new Promise((resolve, reject) => {
        //console.log(id)
        const sql = 'DELETE FROM workareas WHERE id = ? and creator_id = ?';
        db.run(sql, [id, user], err => {
            if (err) {
                reject(err);
                return;
            } else resolve(null);
        })
    })
}

// GET all notes
exports.getAllNotes = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM notes';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            if (rows == undefined) {
                resolve({ error: 'Notes not found' });
            } else {
                /* const notesList = rows.map(row => ({
                    id: row.id, 
                    workspace: row.workspace,
                    father: row.father,
                    type: row.type,
                    text: row.text,
                    previous: row.previous,
                    after: row.after
                })); */
                resolve(rows);
            }
        })
    })
}

// POST new note
exports.createNote = (id, workspace, father, type, text, previous, after) => {
    return new Promise((resolve, reject) => {
        let sql = 'INSERT INTO notes (id, workspace, father, type, text, previous, after) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.run(sql, [id, workspace, father, type, text, previous, after], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        })
    })
}

/* async function populateNotes() {
    for (let i = 1; i <= 100; i++) {
        await createNote(i, 1, null, "note", "Example note #" + i, i-1, i+1);
    }
}
populateNotes(); */