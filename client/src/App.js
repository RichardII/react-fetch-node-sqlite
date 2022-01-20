import './App.css';
import './markdown.css';

//import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import Home from './Home';
import Header from "./Header";
import Workspace from './Workspace';
import APIs from './API';

function App() {
  const [dirty, setDirty] = useState(true);

  const [workareaList, setWorkareaList] = useState([]);
  const [noteList, setNoteList] = useState([]);
  const [reportList, setReportList] = useState([]);
  const [wsWindows, setWsWindows] = useState({
    nWsWindows: 1,
    notebook: { show: true, slot: 1 },
    calendar: { show: false },
    files: { show: false },
    reports: { show: false }
  });

  const [navHeight, setNavHeight] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    setNavHeight(elementRef.current.clientHeight);
  }, []);

  useEffect(() => {
    if (dirty) {
      APIs.getAllWorkareas().then(workareas => setWorkareaList(workareas));
      APIs.getAllNotes().then(notes => setNoteList(notes));
      setDirty(false);
    }
  }, [dirty]);

  const deleteWorkarea = (workareaId) => {
    
    setWorkareaList(oldWorkareas => {
      return oldWorkareas.map(wa => {
        if (wa.id === workareaId) {
          return { ...wa, status: 'deleting' };
        }
        else
          return wa;
      });
    });

    async function deleting(id) {
      const response = await APIs.deleteWorkarea(id);
      if (response.status === 'success') setDirty(true);
    }

    deleting(workareaId);
  };


  async function editWorkarea(workareaId, workareaname) {
    
    console.log("App.js : CallBack editWorkarea()  ID_WS="+workareaId);
    const workarea = { id: workareaId, name: workareaname };
    APIs.updateWorkarea(workarea)
            .then(() => {  })
            .catch(error => console.log(error))

  };

  return (
    <Router>
      <div className="App">
        <Header wsWindows={wsWindows} setWsWindows={setWsWindows} elementRef={elementRef} />
        <Switch>
          <Route exact path="/" render={() => (
            <Home workareaList={workareaList} setDirty={setDirty} deleteWorkarea={deleteWorkarea}  editWorkarea={editWorkarea} />
          )} />
          <Route path="/workspace" render={() => (
            <Workspace noteList={noteList} setNoteList={setNoteList} reportList={reportList}
              wsWindows={wsWindows} setWsWindows={setWsWindows} navHeight={navHeight} />
          )} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
