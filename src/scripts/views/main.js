import '../components/app-bar.js';
import '../components/note-list.js';
import '../components/loading-indicator.js';
import '../components/search-bar.js';
import * as api from '../utils/api.js';
import * as localStorage from '../utils/local-storage.js';
import Swal from 'sweetalert2';

const main = () => {
  const noteListElement = document.querySelector('note-list');
  const formElement = document.querySelector('#add-note-form');
  const loadingIndicator = document.createElement('loading-indicator');
  const searchBarElement = document.createElement('search-bar');
  let isArchiveView = false;
  let allNotes = [];

  const showLoading = () => {
    document.body.appendChild(loadingIndicator);
  };

  const hideLoading = () => {
    document.body.removeChild(loadingIndicator);
  };

  const renderNotes = async () => {
    try {
      showLoading();
      const { notes } = localStorage.loadFromStorage();
      allNotes = isArchiveView
        ? notes.filter((note) => note.archived)
        : notes.filter((note) => !note.archived);
      hideLoading();
      noteListElement.notes = allNotes;
    } catch (error) {
      hideLoading();
      showAlert('Failed to fetch notes', 'error');
    }
  };

  const syncNotes = async () => {
    try {
      showLoading();
      await localStorage.syncWithServer(api);
      hideLoading();
      renderNotes();
      showAlert('Notes synchronized successfully', 'success');
    } catch (error) {
      hideLoading();
      showAlert('Failed to synchronize notes', 'error');
    }
  };

  const filterNotes = (searchTerm) => {
    const filteredNotes = allNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.body.toLowerCase().includes(searchTerm.toLowerCase())
    );
    noteListElement.notes = filteredNotes;
  };

  formElement.addEventListener('submit', async (event) => {
    event.preventDefault();
    const titleInput = document.querySelector('#title');
    const bodyInput = document.querySelector('#body');

    try {
      showLoading();
      const newNote = {
        title: titleInput.value,
        body: bodyInput.value,
        createdAt: new Date().toISOString(),
        archived: false,
      };
      localStorage.addNoteLocally(newNote);
      hideLoading();
      titleInput.value = '';
      bodyInput.value = '';
      renderNotes();
      showAlert('Note added successfully', 'success');
    } catch (error) {
      hideLoading();
      showAlert('Failed to add note', 'error');
    }
  });

  noteListElement.addEventListener('archive', async (event) => {
    const { id, archived } = event.detail;
    try {
      showLoading();
      localStorage.updateNoteLocally(id, { archived: !archived });
      hideLoading();
      renderNotes();
      showAlert(`Note ${archived ? 'unarchived' : 'archived'} successfully`, 'success');
    } catch (error) {
      hideLoading();
      showAlert(`Failed to ${archived ? 'unarchive' : 'archive'} note`, 'error');
    }
  });

  noteListElement.addEventListener('delete', async (event) => {
    const { id } = event.detail;
    try {
      showLoading();
      localStorage.deleteNoteLocally(id);
      hideLoading();
      renderNotes();
      showAlert('Note deleted successfully', 'success');
    } catch (error) {
      hideLoading();
      showAlert('Failed to delete note', 'error');
    }
  });

  noteListElement.addEventListener('edit', async (event) => {
    const { id, title, body } = event.detail;
    try {
      showLoading();
      localStorage.updateNoteLocally(id, { title, body });
      hideLoading();
      renderNotes();
      showAlert('Note updated successfully', 'success');
    } catch (error) {
      hideLoading();
      showAlert('Failed to update note', 'error');
    }
  });

  const showAlert = (message, type) => {
    Swal.fire({
      title: type === 'success' ? 'Success!' : 'Error!',
      text: message,
      icon: type,
      confirmButtonText: 'OK',
    });
  };

  const toggleView = () => {
    isArchiveView = !isArchiveView;
    renderNotes();
  };

  const initUI = () => {
    document.querySelector('#add-note').insertAdjacentElement('beforebegin', searchBarElement);

    const syncButton = document.querySelector('#sync-button');

    const toggleViewButton = document.querySelector('#toggle-view');
  };

  const initEventListeners = () => {
    searchBarElement.addEventListener('search', (event) => {
      const { searchTerm } = event.detail;
      filterNotes(searchTerm);
    });

    document.querySelector('#sync-button').addEventListener('click', syncNotes);

    document.querySelector('#toggle-view').addEventListener('click', toggleView);
  };

  const init = () => {
    initUI();
    initEventListeners();
    renderNotes();
  };

  init();
};

export default main;
