/*
* API calls
*/

function getJson(httpResponsePromise) {
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

          // always return {} from server, never null or non json, otherwise it will fail
          response.json()
            .then(json => resolve(json))
            .catch(err => reject({ error: "Cannot parse server response1" }))

        } else {
          // analyze the cause of error
          response.json()
            .then(obj => reject(obj)) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response2" })) // something else
        }
      })
      .catch(err => reject({ error: "Cannot communicate" })) // connection error
  });
}

async function getAllWorkareas() {
  const response = await fetch('/api/workareas');
  const waJson = await response.json();

  if (response.ok) {
    return waJson;
  } else {
    console.log('error api get all workareas');
  }
}

async function insertWorkarea(workarea) {
  return getJson(
    fetch('/api/workareas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workarea)
    })
  )
}

async function  updateWorkarea(workarea) {
  return getJson(
    fetch(`/api/workareas/${workarea.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workarea)
    })
  )
}

const deleteWorkarea = (workareaId) => {
  return (
    fetch(`/api/workareas/${workareaId}`,
      {
        method: 'DELETE',
      })
      .then(response => response.json())
      .catch(err => console.log(err))
  );
}





async function getAllNotes() {
  const response = await fetch('/api/notes');
  const notesJson = await response.json();
  //console.log(notesJson);
  if (response.ok) {
    return notesJson;
  } else {
    console.log('error api get all notes');
  }
}

async function getAllReports() {
  const response = await fetch('/api/reports');
  const waJson = await response.json();
  //console.log(notesJson);
  if (response.ok) {
    return waJson;
  } else {
    console.log('error api get all reports');
  }
}


async function postSomething(something) {
  return new Promise((resolve, reject) => {
    fetch('/api/something', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(something),
    }).then(response => {
      if (response.ok) resolve(null);
      else response.json()
        .then(message => { reject(message) })
        .catch(() => { reject({ error: "Cannot parse server response on post something." }) })
    }).catch(() => { reject({ error: "Cannot comunicate with server in post something" }) })
  })
}

async function getAllMemes() {
  const response = await fetch('/api/memes');
  const memesJson = await response.json();
  //console.log(memesJson);
  if (response.ok) {
    return memesJson;
  } else {
    console.log('error api get all memes');
  }
}

function deleteSomething(somethingId) {
  return new Promise((resolve, reject) => {
    fetch('/api/something/' + somethingId, { method: 'DELETE', })
      .then((response) => {
        //console.log('delete API: '+ somethingId)
        if (response.ok) resolve(null);
        //analyze cause of error
        else response.json().then(message => { reject(message) }) //error message in the response body
          .catch(() => { reject({ error: "Cannot comunicate with the server" }) }) // connection error
      })
  })
}

const API = { getAllWorkareas, insertWorkarea, deleteWorkarea, getAllNotes, updateWorkarea }
export default API;