//DEPENDENCIES
const express = require('express');
const fs = require('fs');
const path = require('path');
const notes = require('./db/db.json');
const note = JSON.parse(fs.readFileSync('./db/db.json'));


// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing and routing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// ROUTES
// handle htmls
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//handle api
app.get('/api/notes', (req, res) => 
res.json(note)
);



//handle post - add new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;  
  note.push(newNote);

  fs.writeFileSync('./db/db.json', JSON.stringify(note), err => {
    if (err)
    throw (err);
  });  
  res.json(newNote);
});

// handle delete

app.delete("/api/notes/:id", (req, res) => {
  const deleteNote = note
  .findIndex(i => i.id == req.params.id);  
  note.splice(deleteNote, 1);

  fs.writeFileSync('./db/db.json', JSON.stringify(note), err => {
    if (err)
      throw (err);
  });
  return res.json(true);
});



//Start Server
app.listen(PORT, () => {
  console.log(`notetaker is listening on PORT: ${PORT}`);
});

module.exports = app;
