const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

let notes = [];

function render(notesToRender = notes) {
    notesList.replaceChildren();

    if (notesToRender.length === 0 && searchInput.value.trim() !== "") {
        const message = document.createElement("li");
        message.textContent = "No notes match your search.";
        notesList.appendChild(message);
        return;
    }

    notesToRender.forEach((note) => {
        const listItem = document.createElement("li");
        listItem.classList.add("note-card");

        const categoryClass = `category-${note.category.toLowerCase()}`;
        listItem.classList.add(categoryClass);

        const noteText = document.createElement("p");
        noteText.classList.add("note-text");
        noteText.textContent = note.text;

        const categoryLabel = document.createElement("span");
        categoryLabel.classList.add("note-category");
        categoryLabel.textContent = note.category;

        const date = document.createElement("small");
        date.classList.add("note-date");
        date.textContent = note.createdAt;

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            notes = notes.filter((item) => item.id !== note.id);
            saveNotes();
            updateCount();
            render(getFilteredNotes());
        });

        listItem.appendChild(noteText);
        listItem.appendChild(categoryLabel);
        listItem.appendChild(date);
        listItem.appendChild(deleteButton);

        notesList.appendChild(listItem);
    });
}

function updateCount() {
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}

function getFilteredNotes() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm === "") {
        return notes;
    }

    const searchWords = searchTerm.split(/\s+/);

    return notes.filter((note) => {
        const noteText = note.text.toLowerCase();

        return searchWords.every((word) => noteText.includes(word));
    });
}

noteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent = "Notes must be 200 characters or fewer.";
        return;
    }

    const note = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

    notes.push(note);

    noteInput.value = "";
    errorMessage.textContent = "";

    saveNotes();
    updateCount();
    render(getFilteredNotes());
});

searchInput.addEventListener("input", () => {
    render(getFilteredNotes());
});

function saveNotes() {
    localStorage.setItem("quickNotes", JSON.stringify(notes));
}

function loadNotes() {
    const savedNotes = localStorage.getItem("quickNotes");

    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    }
}

loadNotes();
updateCount();
render(getFilteredNotes());