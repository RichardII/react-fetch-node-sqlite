import { useState } from 'react';
import { DropdownButton, Row, Col, Form } from 'react-bootstrap';

function FileManager(){
	const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
  const [list, setList]= useState([]);
  let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

	const handleSubmission = () => {
    setList([...list, selectedFile]);
    console.log(list);
	};

	return(
    <div>
      <Row>
        <Col>
          <Form.Group controlId="formFileMultiple" className="mb-3" onChange={changeHandler}>
            <Form.Label>Multiple files input </Form.Label>
            <Form.Control type="file" multiple />
          </Form.Group>
        </Col>
        <Col>
          {isFilePicked ? (
            <>
                <p>Filename: {selectedFile.name}</p>
                <p>Filetype: {selectedFile.type}</p>
                <p>Size in bytes: {selectedFile.size}</p>
                <p>
                  lastModifiedDate:{' '}
                  {todayStr}
                </p>
              </>
          ) : (
            <p>Select a file to show details</p>
          )}
          <div>
            <button onClick={handleSubmission}>Submit</button>
          </div>
        </Col>
      </Row>
      <Row>
            {list.map(e=>
              <>
                <a href = {e} target = "_blank">{e.name}</a>
                <embed src={e} width="800px" height="2100px" />
              </>  
              )
            }
      </Row>
      
		</div>
	)
}

export default FileManager;