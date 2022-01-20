'use strict';

const express = require("express");
const dao = require("./dao");
const utility = require("./utility");
const { body, validationResult, check, param } = require("express-validator");

// init express
const app = new express();
const port = 3001;

app.use(express.json());
app.use(express.static('public'));

/******** API ********/

// ---   CRUD = CREATE READ UPDATE DELETE ---

// POST workareas : CREATE
app.post('/api/workareas', [
  check('name').isString()
], async (req, res) => {
  try {
    let title = req.body.name
    const result = await dao.createWorkarea(title);
    res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

// GET workareas : READ

app.get('/api/workareas', async (req, res) => {
  try {
    const result = await dao.getAllWorkareas();

    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});




// PUT a workarea : UPDATE
app.post('/api/workareas/:id', [
  check('id').isInt()
], async (req, res) => {
  try {
    let id   = req.params.id;
    let name = req.body.name
    const result = await dao.updateWorkarea(id, name);
    res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

// DELETE workareas : DELETE
app.delete('/api/workareas/:id', [
  check('id').isInt()
], async (req, res) => {
  try {
    console.log(' DELETE workarea : '+ req.params.id)
    await dao.deleteWorkarea(1, req.params.id);
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(503).json({ error: `Database error during deletion of meme ${req.params.id}` })
  }
})






// GET notes
app.get('/api/notes', async (req, res) => {
  try {
    const result = await dao.getAllNotes();

    if (result.error)
      res.status(404).json(result);
    else {
      //res.json(utility.sortNotes(result));
      res.json(result);
    }      
  } catch (err) {
    res.status(500).end();
  }
});


// POST something
app.post('/api/something', [
  check('creator').isString().isLength({ min: 1, max: 40 }),
  check('title').isString().isLength({ min: 1, max: 51 }),
  check('id_img').isInt(),
  check('vis').isInt(),
  check('text1').isString().isLength({ max: 100 }),
  check('text2').isString().isLength({ max: 100 }),
  check('text3').isString().isLength({ max: 100 }),
  check('color').isString().custom(c => colorCheck(c)),
  check('font').isString()

], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  const something = {
    creator: req.body.creator,
    title: req.body.title,
    id_img: req.body.id_img,
    vis: req.body.vis,
    text1: req.body.text1,
    text2: req.body.text2,
    text3: req.body.text3,
    color: req.body.color,
    font: req.body.font
  };

  try {
    const result = await dao.createSomething(something);
    res.json(result);
  } catch (err) {
    res.status(503).json({ error: 'Database errror during post something:  ' + err });
  }
})

// DELETE something
app.delete('/api/something/:id', [
  check('id').isInt()
], async (req, res) => {
  try {
    console.log('delete SERVER '+ req.params.id)
    await dao.deleteSomething(req.user.name, req.params.id);
    res.status(200).json({});
  } catch (err) {
    res.status(503).json({ error: `Database error during deletion of meme ${req.params.id}` })
  }
})


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});