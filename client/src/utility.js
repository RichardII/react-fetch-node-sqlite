import { useState, useEffect } from 'react';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

const moveNote = (unsortedNotes, currentNote, direction) => {
  console.log(currentNote)
  const currentIndex = unsortedNotes.findIndex((note) => note.id === currentNote.id);
  const previousIndex = unsortedNotes.findIndex((note) => note.id === currentNote.previous);
  const afterIndex = unsortedNotes.findIndex((note) => note.id === currentNote.after);

  if (direction > 0) {
    const prevSqIndex = unsortedNotes.findIndex((note) => note.id === unsortedNotes[previousIndex].previous);

    if (unsortedNotes[currentIndex].after !== 0) {
      if (unsortedNotes[prevSqIndex]) {
        unsortedNotes[prevSqIndex].after = unsortedNotes[currentIndex].id;
      }

      unsortedNotes[currentIndex].previous = unsortedNotes[previousIndex].previous;
      unsortedNotes[currentIndex].after = unsortedNotes[previousIndex].id;

      unsortedNotes[previousIndex].previous = unsortedNotes[currentIndex].id;
      unsortedNotes[previousIndex].after = unsortedNotes[afterIndex].id;

      unsortedNotes[afterIndex].previous = unsortedNotes[previousIndex].id;
    }
    else {
      if (unsortedNotes[prevSqIndex]) {
        unsortedNotes[prevSqIndex].after = unsortedNotes[currentIndex].id;
      }

      unsortedNotes[currentIndex].after = unsortedNotes[currentIndex].previous;
      unsortedNotes[currentIndex].previous = unsortedNotes[previousIndex].previous;

      unsortedNotes[previousIndex].previous = unsortedNotes[currentIndex].id;
      unsortedNotes[previousIndex].after = 0;
    }
  }
  else {
    const afterSqIndex = unsortedNotes.findIndex((note) => note.id === unsortedNotes[afterIndex].after);

    if (unsortedNotes[currentIndex].previous !== 0) {
      unsortedNotes[previousIndex].after = unsortedNotes[afterIndex].id;

      unsortedNotes[currentIndex].previous = unsortedNotes[afterIndex].id;
      unsortedNotes[currentIndex].after = unsortedNotes[afterIndex].after;

      unsortedNotes[afterIndex].previous = unsortedNotes[previousIndex].id;
      unsortedNotes[afterIndex].after = unsortedNotes[currentIndex].id;

      if (unsortedNotes[afterSqIndex]) {
        unsortedNotes[afterSqIndex].previous = unsortedNotes[currentIndex].id;
      }
    }
    else {
      unsortedNotes[currentIndex].previous = unsortedNotes[afterIndex].id;
      unsortedNotes[currentIndex].after = unsortedNotes[afterIndex].after;

      unsortedNotes[afterIndex].previous = 0;
      unsortedNotes[afterIndex].after = unsortedNotes[currentIndex].id;

      if (unsortedNotes[afterSqIndex]) {
        unsortedNotes[afterSqIndex].previous = unsortedNotes[currentIndex].id;
      }
    }
  }

  return unsortedNotes;
};

const insertNote = (unsortedNotes, currentNote, newNote) => {
  const currentIndex = unsortedNotes.findIndex((note) => note.id === currentNote.id);
  const afterIndex = unsortedNotes.findIndex((note) => note.id === currentNote.after);

  unsortedNotes[currentIndex].after = newNote.id;

  if (unsortedNotes[afterIndex]) unsortedNotes[afterIndex].previous = newNote.id;

  newNote.previous = unsortedNotes[currentIndex].id;

  if (unsortedNotes[afterIndex]) newNote.after = unsortedNotes[afterIndex].id;
  else newNote.after = 0;

  unsortedNotes.push(newNote);

  return unsortedNotes;
};

const getMaxId = (list) => {
  return list.reduce((a, b) => a.id > b.id ? a : b).id;
};

const insertBefore = (string, insert, index) => {
  return string.slice(0, index) + insert + string.slice(index,);
};

const insertBeforeAndAfter = (string, insertBefore, insertAfter, startIndex, endIndex) => {
  return string.slice(0, startIndex) + insertBefore + string.slice(startIndex, endIndex) + insertAfter + string.slice(endIndex,);
};

const getMaxSlot = (wsWindows) => {
  let max = 0;

  Object.entries(wsWindows).forEach(([key, value]) => {
    if (value.slot && value.slot > max) {
      max = value.slot;
    }
  });

  return max;
};

const utility = { moveNote, insertNote, getMaxId, useWindowDimensions, insertBefore, insertBeforeAndAfter, getMaxSlot };
export default utility;