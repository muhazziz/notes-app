import './note-item.js';

class NoteList extends HTMLElement {
  constructor() {
    super();
    this.shadowDOM = this.attachShadow({ mode: 'open' });
  }

  set notes(notes) {
    this._notes = notes;
    this.render();
  }

  render() {
    this.shadowDOM.innerHTML = `
         <style>
           :host {
             display: block;
             margin-top: 32px;
             width: 100%;
             padding: 16px;
           }
         </style>
       `;

    this._notes.forEach((note) => {
      const noteItemElement = document.createElement('note-item');
      noteItemElement.note = note;
      this.shadowDOM.appendChild(noteItemElement);
    });
  }
}

customElements.define('note-list', NoteList);
