jQuery(document).ready(function ($) {
  //consolidate and update variables 
  const noteTitle = $('.note-title');
  const noteText = $('.note-textarea');
  const saveNoteBtn = $('.save-note');
  const newNoteBtn = $('.new-note');
  const noteList = $('.list-container .list-group');

  // activeNote is used to keep track of the note in the textarea
  let activeNote = {};

  const getNotes = () => {
    return $.ajax({
      url: '/api/notes',
      method: 'GET',
    });
  };

  const saveNote = (note) => {
    return $.ajax({
      url: '/api/notes',
      data: note,
      method: 'POST',
    });
  };

  const deleteNote = (id) => {
    return $.ajax({
      url: `/api/notes/${id}`,
      method: 'DELETE',
    });
  };

  const renderActiveNote = () => {
    saveNoteBtn.hide();

    if (activeNote.id) {
      noteTitle.attr('readonly', true);
      noteText.attr('readonly', true);
      noteTitle.val(activeNote.title);
      noteText.val(activeNote.text);
    }
    else {
      noteTitle.attr('readonly', false);
      noteText.attr('readonly', false);
      noteTitle.val('');
      noteText.val('');
    }
  };

  const handleNoteSave = () => {
      const newNote = {
      id: Math.floor(Math.random() * 815),
      title: noteTitle.val(),
      text: noteText.val(),
    };

    saveNote(newNote).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  };

  // Delete the clicked note
  function handleNoteDelete(e) {
    // prevents the click listener for the list from being called when the button inside of it is clicked
    e.stopPropagation();

    const note = $(this).parent('.list-group-item').data();

    if (activeNote.id === note.id) {
      activeNote = {};
    }

    deleteNote(note.id).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  }

  // Sets the activeNote and displays it
  function handleNoteView(e) {
    e.preventDefault();
    activeNote = $(this).data();
    renderActiveNote();
  }

  // Sets the activeNote to and empty object and allows the user to enter a new note
  function handleNewNoteView() {
    activeNote = {};
    renderActiveNote();
  }

  const handleRenderSaveBtn = () => {
    if (!noteTitle.val().trim() || !noteText.val().trim()) {
      saveNoteBtn.hide();
    }
    else {
      saveNoteBtn.show();
    }
  };

  // Render the list of note titles
  const renderNoteList = async (notes) => {
    noteList.empty();

    const noteListItems = [];

    // Returns HTML element with or without a delete button
    const createLi = (text, delBtn = true) => {
      const liEl = $('<li class = "list-group-item">');
      const spanEl = $('<span>').text(text);

      spanEl.on('click', handleNoteView);

      liEl.append(spanEl);

      if (delBtn) {
        const delBtnEl = $('<i class = "fas fa-trash-alt float-right text-danger delete-note">');

        delBtnEl.on('click', handleNoteDelete);

        liEl.append(delBtnEl);
      }

      return liEl;
    };

    if (notes.length === 0) {
      noteListItems.push(createLi('No saved Notes', false));
    }

    notes.forEach((note) => {
      const li = createLi(note.title).data(note);
      noteListItems.push(li);
    });
    noteList.append(noteListItems);
  }

  // Gets notes from the db and renders them to the sidebar
  const getAndRenderNotes = () => {
    return getNotes()
      .then(renderNoteList);
  }

  noteList.on("click", ".list-group-item", handleNoteView);
  noteList.on("click", ".delete-note", handleNoteDelete);
  saveNoteBtn.on('click', handleNoteSave);
  newNoteBtn.on('click', handleNewNoteView);
  noteTitle.on('keyup', handleRenderSaveBtn);
  noteText.on('keyup', handleRenderSaveBtn);

  getAndRenderNotes();
});