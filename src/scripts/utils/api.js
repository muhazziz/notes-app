const BASE_URL = "https://notes-api.dicoding.dev/v2";

const getAllNotes = async () => {
  const response = await fetch(`${BASE_URL}/notes`);
  const responseJson = await response.json();
  return responseJson.data;
};

const getArchivedNotes = async () => {
  const response = await fetch(`${BASE_URL}/notes/archived`);
  const responseJson = await response.json();
  return responseJson.data;
};

const addNote = async (note) => {
  const response = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  const responseJson = await response.json();
  return responseJson.data;
};

const archiveNote = async (id) => {
  const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
    method: "POST",
  });
  const responseJson = await response.json();
  return responseJson;
};

const unarchiveNote = async (id) => {
  const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
    method: "POST",
  });
  const responseJson = await response.json();
  return responseJson;
};

const deleteNote = async (id) => {
  const response = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "DELETE",
  });
  const responseJson = await response.json();
  return responseJson;
};

export {
  getAllNotes,
  getArchivedNotes,
  addNote,
  archiveNote,
  unarchiveNote,
  deleteNote,
};
