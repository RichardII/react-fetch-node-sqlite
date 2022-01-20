import React, { useState } from "react";
import { Card, Form, Dropdown } from "react-bootstrap";
import { X, Check2, Trash2Fill, ThreeDotsVertical, PencilSquare } from "react-bootstrap-icons";
import { Link } from 'react-router-dom';

function HomeWorkspace(props) {
    const [showControls, setShowControls] = useState(false);
   
    const [editboolean, setEditboolean] = useState(false);

    function setEditionWorkspace(edit) {
        setEditboolean(true);
    }

    return (
        <Card
            className={"mx-3 my-2 hover-scaleup-11" + (showControls && " z-index-max")}
            style={{ width: "300px" }}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <Card.Header className={"d-flex " + props.ws.status + (showControls ? " justify-content-between z-index-max" : " justify-content-center")}>
                {showControls && <span style={{ width: "18px" }} />}
                <Link to={ { pathname: "/workspace", state: { currentWorkspace: props.ws } }}
                    className="me-2 no-link-style w-100" 
                >
                 {  editboolean ? <HomeWorkspaceForm  isEdit={editboolean}  editWorkarea={props.editWorkarea}  id={props.ws.id} onDone={props.onDone} onClose={props.onClose}/> 
                                :  <h4>{props.ws.name}</h4>   
                 }
                 
                </Link>
                {showControls && <HomeWorkspaceControls id={props.ws.id} deleteWorkspace={props.deleteWorkspace} setEditionWorkspace={setEditionWorkspace}  />}
            </Card.Header>
        </Card>
    );
}

function HomeWorkspaceForm(props) {
    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [validated, setValidated] = useState(false);


    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');

        // basic validation
        let valid = true;
        if (name === '') {
            valid = false;
            setErrorMessage('Please choose a name');
            setValidated(true);
        }

        if (valid) {
            if(props.isEdit===false) {
                props.addNewWorkarea(name)
                props.onDone()
            } else if (props.isEdit===true) {
                props.editWorkarea(props.id, name)
            }
             
        } 
    };

    return (
        <div className="d-flex justify-content-center my-4" >
            <Card style={{ width: "380px" }} >
                <Card.Header>
                    <Form className="d-flex justify-content-center" validated={validated} onSubmit={handleSubmit}>
                        <Form.Group controlId="name" >
                            <Form.Control
                                type="text"
                                value={name}
                                className="h6-style transparent p-0 my-1 text-center"
                                onChange={(ev) => {  setName(ev.target.value); } }
                                autoFocus
                            />
                            <Form.Control.Feedback type="invalid">
                                {errorMessage}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <X size={32} color="#4c4c4c" className="my-auto ms-2 cursor-pointer hover-scaleup-12" onClick={() => props.onClose()} />
                        <Check2 size={32} color="#4c4c4c" className="my-auto cursor-pointer hover-scaleup-12" onClick={(e) => handleSubmit(e)} />
                    </Form>
                </Card.Header>
            </Card>
        </div>
    );
}

function HomeWorkspaceControls(props) {
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            href=""
            ref={ref}
            onClick={e => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}
        </a>
    ));

    const CustomMenu = React.forwardRef(
        ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
            const [value, setValue] = useState('');

            return (
                <div
                    ref={ref}
                    style={style}
                    className={className}
                    aria-labelledby={labeledBy}
                >
                    <ul className="list-unstyled m-0">
                        {React.Children.toArray(children).filter(
                            child =>
                                !value || child.props.children.toLowerCase().startsWith(value)
                        )}
                    </ul>
                </div>
            );
        }
    );
    return (
        <Dropdown className="ml-auto cursor-pointer hover-opaque z-index-max" style={{ paddingTop: "4px" }} >
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                <ThreeDotsVertical color="#4b4b4b" size={18} />
            </Dropdown.Toggle>

            <Dropdown.Menu className="z-index-max" as={CustomMenu}>
                <Dropdown.Item
                    className="d-flex align-items-center px-3"
                    onClick={() =>  { console.log("HomeWorkspaceControls -> Edit"); props.setEditionWorkspace(true)} }
                >
                    <PencilSquare className="mr-3" size={16} />
                    <span style={{ marginLeft: "0.35rem" }} >Edit</span>
                </Dropdown.Item>
                <Dropdown.Item
                    className="d-flex align-items-center px-3"
                    onClick={() => { console.log("HomeWorkspaceControls -> Delete"); props.deleteWorkspace(props.id)} }
                >
                    <Trash2Fill className="mr-3" size={16} />
                    <span style={{ marginLeft: "0.35rem" }} >Delete</span>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export { HomeWorkspace, HomeWorkspaceForm };