class AppBar extends HTMLElement {
  constructor() {
    super();
    this.shadowDOM = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowDOM.innerHTML = `
        <style>
          :host {
            display: block;
            width: 100%;
            background-color: #3498db;
            color: white;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
          }
          h1 {
            padding: 16px;
          }
        </style>
        <h1>Notes App</h1>
      `;
  }
}

customElements.define("app-bar", AppBar);
