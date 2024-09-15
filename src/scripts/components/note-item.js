import anime from 'animejs/lib/anime.es.js';

class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.shadowDOM = this.attachShadow({ mode: 'open' });
    this.isEditing = false;
  }

  set note(note) {
    this._note = note;
    this.render();
  }

  connectedCallback() {
    this.render();
    this.animate();
  }

  render() {
    this.shadowDOM.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 18px;
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          overflow: hidden;
        }
        
        .note-content {
          padding: 16px;
        }
        
        .note-content h2 {
          font-weight: lighter;
          margin-bottom: 8px;
        }
        
        .note-content p {
          margin-top: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }

        .note-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px;
          background-color: #f8f8f8;
        }

        .note-date {
          font-size: 0.8em;
          color: #777;
        }

        .note-actions {
          display: flex;
        }

        .note-actions button {
          margin-left: 8px;
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .edit-btn {
          background-color: #3498db;
          color: white;
        }

        .archive-btn {
          background-color: #f39c12;
          color: white;
        }

        .delete-btn {
          background-color: #e74c3c;
          color: white;
        }

        .edit-form {
          padding: 16px;
        }

        .edit-form input, .edit-form textarea {
          width: 100%;
          padding: 8px;
          margin-bottom: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .edit-form button {
          padding: 8px 16px;
          background-color: #2ecc71;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
      ${this.isEditing ? this.renderEditForm() : this.renderNoteContent()}
    `;

    if (!this.isEditing) {
      this.shadowDOM.querySelector('.edit-btn').addEventListener('click', this._onEditClick);
      this.shadowDOM.querySelector('.archive-btn').addEventListener('click', this._onArchiveClick);
      this.shadowDOM.querySelector('.delete-btn').addEventListener('click', this._onDeleteClick);
    } else {
      this.shadowDOM.querySelector('.edit-form').addEventListener('submit', this._onSaveEdit);
    }
  }

  renderNoteContent() {
    return `
      <div class="note-content">
        <h2>${this._note.title}</h2>
        <p>${this._note.body}</p>
      </div>
      <div class="note-footer">
        <div class="note-date">${this.formatDate(this._note.createdAt)}</div>
        <div class="note-actions">
          <button class="edit-btn">Edit</button>
          <button class="archive-btn">${this._note.archived ? 'Unarchive' : 'Archive'}</button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
    `;
  }

  renderEditForm() {
    return `
      <form class="edit-form">
        <input type="text" name="title" value="${this._note.title}" required>
        <textarea name="body" required>${this._note.body}</textarea>
        <button type="submit">Save</button>
      </form>
    `;
  }

  formatDate(dateString) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  }

  _onEditClick = () => {
    this.isEditing = true;
    this.render();
  };

  _onSaveEdit = (event) => {
    event.preventDefault();
    const form = event.target;
    const title = form.title.value;
    const body = form.body.value;
    this.dispatchEvent(
      new CustomEvent('edit', {
        detail: {
          id: this._note.id,
          title,
          body,
        },
        bubbles: true,
        composed: true,
      })
    );
    this.isEditing = false;
    this.render();
  };

  _onArchiveClick = () => {
    this.dispatchEvent(
      new CustomEvent('archive', {
        detail: {
          id: this._note.id,
          archived: this._note.archived,
        },
        bubbles: true,
        composed: true,
      })
    );
  };

  _onDeleteClick = () => {
    this.dispatchEvent(
      new CustomEvent('delete', {
        detail: {
          id: this._note.id,
        },
        bubbles: true,
        composed: true,
      })
    );
  };

  animate() {
    anime({
      targets: this,
      opacity: [0, 1],
      translateY: [20, 0],
      easing: 'easeOutExpo',
      duration: 500,
      delay: anime.stagger(100),
    });
  }
}

customElements.define('note-item', NoteItem);
