import { Form, Button, Alert, Modal } from 'react-bootstrap';
import { useState } from 'react';

function ChapterModal(props) {
  const [name, setName] = useState('');
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
  
    // basic validation
    let valid = true;
    if (name === '') {
      valid = false;
      setErrorMessage('Please insert a valid name for this Workarea.');
      setShow(true);
    }

    if(valid)
    {
      props.addNote(name)
    }
  };

  return (
    <Modal centered show animation={false} onHide={() => props.setShowChapterModal(false)}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert
            dismissible
            show={show}
            onClose={() => setShow(false)}
            variant="danger">
            {errorMessage}
          </Alert>
          <Form.Group controlId="name">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Add</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export { ChapterModal };


