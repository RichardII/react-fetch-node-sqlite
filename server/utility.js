exports.sortNotes = (unsortedNotes) => {
    let prev = 0;
    let newPrev;
    let sortedNotes = [];

    unsortedNotes.forEach(note => { 
        sortedNotes.push(unsortedNotes.find(n => {
            newPrev = n.id;
            return n.previous === prev;
        })); 
        
        prev = newPrev;
    });

    return sortedNotes;
};