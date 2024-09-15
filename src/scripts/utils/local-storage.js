const STORAGE_KEY = 'NOTES_APP';

const loadFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  return serializedData ? JSON.parse(serializedData) : { notes: [], lastSync: null };
};

const saveToStorage = (data) => {
  const serializedData = JSON.stringify(data);
  localStorage.setItem(STORAGE_KEY, serializedData);
};

const addNoteLocally = (note) => {
  const data = loadFromStorage();
  data.notes.push({ ...note, _status: 'new' });
  saveToStorage(data);
};

const updateNoteLocally = (id, updates) => {
  const data = loadFromStorage();
  const noteIndex = data.notes.findIndex((note) => note.id === id);
  if (noteIndex !== -1) {
    data.notes[noteIndex] = { ...data.notes[noteIndex], ...updates, _status: 'updated' };
    saveToStorage(data);
  }
};

const deleteNoteLocally = (id) => {
  const data = loadFromStorage();
  data.notes = data.notes.filter((note) => note.id !== id);
  saveToStorage(data);
};

const syncWithServer = async (apiModule) => {
  const data = loadFromStorage();
  const { notes } = data;

  for (const note of notes) {
    if (note._status === 'new') {
      await apiModule.addNote(note);
    } else if (note._status === 'updated') {
      await apiModule.updateNote(note.id, note);
    }
  }

  const serverNotes = await apiModule.getAllNotes();
  saveToStorage({ notes: serverNotes, lastSync: new Date().toISOString() });
};

export {
  loadFromStorage,
  saveToStorage,
  addNoteLocally,
  updateNoteLocally,
  deleteNoteLocally,
  syncWithServer,
};
