const books = [];
const RENDER_EVENT = 'render-book';

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function findBook(bookId) {
    for (bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function makeBook(bookObject) {
    const { id, title, author, year, isCompleted } = bookObject;

    const bookTitle = document.createElement('h3');
    bookTitle.innerText = title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = author;

    const bookYear = document.createElement('p');
    bookYear.innerText = year;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');

    const bookContainer = document.createElement('article');
    bookContainer.classList.add('book_item');
    bookContainer.append(bookTitle, bookAuthor, bookYear, buttonContainer);

    if (isCompleted) {
        const unfinishedReadButton = document.createElement('button');
        unfinishedReadButton.classList.add('green');
        unfinishedReadButton.innerText = 'Belum selesai dibaca';
        unfinishedReadButton.addEventListener('click', function() {
            undoBookFromFinished(id);
        });

        const removedButton = document.createElement('button');
        removedButton.classList.add('red');
        removedButton.innerText = 'Hapus buku';
        removedButton.addEventListener('click', function() {
            removedBookFromFinished(id);
        });

        buttonContainer.append(unfinishedReadButton, removedButton);

    } else {
        const finishedReadButton = document.createElement('button');
        finishedReadButton.classList.add('green');
        finishedReadButton.innerText = "Selesai dibaca"
        finishedReadButton.addEventListener('click', function() {
            addBookTofinished(id);
        });

        const removedButton = document.createElement('button');
        removedButton.classList.add('red');
        removedButton.innerText = 'Hapus buku';
        removedButton.addEventListener('click', function() {
            removedBookFromFinished(id);
        });

        buttonContainer.append(finishedReadButton, removedButton);
    }

    return bookContainer;
}

function addBook() {
    textInputBook = document.getElementById('inputBookTitle').value;
    textInputAuthor = document.getElementById('inputBookAuthor').value;
    textInputYear = document.getElementById('inputBookYear').value;
    textInputFinished = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textInputBook, textInputAuthor, textInputYear, textInputFinished);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBookTofinished(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    alert('Selamat sudah menyelesaikan bukunya')
    saveData();
}

function removedBookFromFinished(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    alert('Buku telah dihapus!')
    saveData();
}

function undoBookFromFinished(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    alert('Silahkan baca kembali')
    saveData();
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById('incompleteBookshelfList');
    const bookListCompleted = document.getElementById('completeBookshelfList');

    uncompletedBookList.innerHTML = '';
    bookListCompleted.innerHTML = '';

    for (bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isCompleted) {
            bookListCompleted.append(bookElement);
        } else {
            uncompletedBookList.append(bookElement);
        }
    }
});

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}