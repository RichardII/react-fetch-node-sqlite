
import React, { useState } from "react";
import { Dropdown, Button, Form } from "react-bootstrap";
import { ChevronDown, ChevronUp, Plus, ThreeDotsVertical, Trash2Fill, PencilSquare, CaretRightFill, CodeSlash, CardText, Image } from "react-bootstrap-icons";
import { useLocation } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { ToolbarNotes } from "./Toolbar";
import utility from './utility';
import { isPropsEqual } from "@fullcalendar/react";
import { ChapterModal } from "./Modals/ChapterModal";

function Notes(props) {
    const location = useLocation();
    /* const [showChapterModal, setShowChapterModal] = useState(false); */
    const [search, setSearch] = useState('');

    let ws;
    if (location.state) ws = location.state.currentWorkspace;

    const sortNotes = (unsortedNotes) => {
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

    const filterNotes = (sortedNotes) => {
        return sortedNotes.filter(note => note.text.toLowerCase().includes(search.toLowerCase()));
    };

    const moveNote = (currentNote, direction) => {
        const unsortedNotes = utility.moveNote(props.noteList, currentNote, direction);

        props.setNoteList([...unsortedNotes]);
    };

    const editNote = (currentNote) => {
        const unsortedNotes = props.noteList;

        const currentIndex = unsortedNotes.findIndex((note) => note.id === currentNote.id);
        unsortedNotes[currentIndex] = currentNote;

        props.setNoteList([...unsortedNotes]);
    };

    const addNote = (currentNote) => {
        const newNote = {
            id: utility.getMaxId(props.noteList) + 1,
            text: "",
            type: "note",
            workspace: currentNote.workspace,
            father: currentNote.father,
            editMode: true,
        };
        const unsortedNotes = utility.insertNote(props.noteList, currentNote, newNote);

        props.setNoteList([...unsortedNotes]);
    };

    const deleteNote = (currentNote) => {
        const unsortedNotes = props.noteList;

        const currentIndex = unsortedNotes.findIndex((note) => note.id === currentNote.id);
        const previousIndex = unsortedNotes.findIndex((note) => note.id === currentNote.previous);
        const afterIndex = unsortedNotes.findIndex((note) => note.id === currentNote.after);

        unsortedNotes[previousIndex].after = currentNote.after;
        unsortedNotes[afterIndex].previous = currentNote.previous;
        unsortedNotes.splice(currentIndex, 1);

        props.setNoteList([...unsortedNotes]);
    };

    return (
        <>
            {/* <ToolbarNotes setShowChapterModal={setShowChapterModal} noteList={notes} /> */}
            <ToolbarNotes search={search} setSearch={setSearch} />
            {
                filterNotes(sortNotes(props.noteList.filter(note => note.workspace === ws.id && !note.father)))
                    .map(note => <Note key={note.id} note={note} sortNotes={sortNotes} filterNotes={filterNotes}
                        moveNote={moveNote} addNote={addNote} editNote={editNote} deleteNote={deleteNote} ws={ws} noteList={props.noteList}
                        childrenNotes={props.noteList.filter(n => n.workspace === ws.id && n.father === note.id)}
                    />)
            }
            { //showChapterModal && <ChapterModal addNote={addNote} setShowChapterModal={setShowChapterModal}/>
                // ATTENTION this is always true, doesnt even close
            }

        </>
    )
}

function Note(props) {
    const { note, childrenNotes, filterNotes, sortNotes, moveNote, addNote, editNote, deleteNote } = props;

    const [showControls, setShowControls] = useState(false);
    const [showChildren, setShowChildren] = useState(false);
    const [editMode, setEditMode] = useState(note.editMode ? note.editMode : false);

    return (
        <>
            {!editMode ?
                <div className={"note d-flex p-1 " + (note.type === "chapter" && "py-5")}
                    style={{ minHeight: note.text.length < 50 && !note.text.includes("\n") ? "2.5rem" : "none" }}
                    onMouseEnter={() => setShowControls(true)}
                    onMouseLeave={() => setShowControls(false)}
                >
                    <span className="d-flex flex-row align-items-center" style={{ minWidth: "42px" }}>
                        {showControls &&
                            <NoteControls
                                note={note}
                                showControls={showControls}
                                setShowControls={setShowControls}
                                moveNote={moveNote}
                                addNote={addNote}
                            />
                        }
                    </span>
                    <NoteContent note={note} showControls={showControls} showChildren={showChildren}
                        setShowChildren={setShowChildren} setEditMode={setEditMode}
                    />
                    {showControls && <NoteMenu />}
                </div>
                : <NoteForm note={note} editNote={editNote} deleteNote={deleteNote} setEditMode={setEditMode} />
            }
            {childrenNotes.length > 0 && showChildren ?
                <div className={note.type !== "chapter" ? "ms-4" : ""} >
                    {filterNotes(sortNotes(childrenNotes))
                        .map(note => <Note key={note.id} note={note} sortNotes={sortNotes} filterNotes={filterNotes}
                            moveNote={moveNote} addNote={addNote} editNote={editNote} deleteNote={deleteNote} ws={props.ws} noteList={props.noteList}
                            childrenNotes={props.noteList.filter(n => n.workspace === props.ws.id && n.father === note.id)}
                        />)}
                </div>
                : ''
            }
        </>
    );
}

function NoteContent(props) {
    return (
        <span className={"w-100 ms-3 text-start d-flex align-items-center " + (props.note.type === "notegroup" && "fw-bold")}
            onClick={() => props.note.text === '' ? props.setEditMode(true) : ''}
        >
            {props.note.type === "note" && <span onClick={() => props.setEditMode(true)}>{props.note.text}</span>}
            {props.note.type === "notegroup" &&
                <>
                    <CaretRightFill size={12} style={{ marginLeft: "-3px" }}
                        className={"cursor-pointer rotate-90 " + (props.showChildren && " open")}
                        onClick={() => props.setShowChildren(!props.showChildren)}
                    />
                    {<span onClick={() => props.setEditMode(true)}>{props.note.text}</span>}
                </>
            }
            {props.note.type === "chapter" && <h2 style={{ marginLeft: "-3px" }}>{props.note.text}</h2>}
            {props.note.type === "chapter" && props.showControls &&
                <Button variant="light" className="ms-3" onClick={() => props.setShowChildren(!props.showChildren)}>
                    {props.showChildren ? "Collapse" : "Expand"}
                </Button>
            }
            {props.note.type === "code" && <NoteMarkdown text={'```' + props.note.text} />}
            {props.note.type === "image" && <NoteMarkdown text={'![](' + props.note.text + ')'} />}
        </span>
    );
}

function NoteMarkdown(props) {
    return (
        <ReactMarkdown className="markdown m-0 p-0" >{props.text}</ReactMarkdown>
    );
}

function NoteControls(props) {
    return (
        <>
            <span className="d-flex flex-column" >
                <ChevronUp
                    size={18}
                    color="#4b4b4b"
                    className={props.note.previous !== 0 ? "hover-opaque cursor-pointer" : "opacity-07"}
                    style={{ position: "relative", marginBottom: "-11px", transform: "translateY(-10px)" }}
                    onClick={() => {
                        if (props.note.previous !== 0) {
                            props.moveNote(props.note, 1);
                            props.setShowControls(false);
                        }
                    }}
                />
                <ChevronDown
                    size={18}
                    color="#4b4b4b"
                    className={props.note.after !== 0 ? "hover-opaque cursor-pointer" : "opacity-07"}
                    style={{ position: "relative", marginTop: "-11px", transform: "translateY(10px)" }}
                    onClick={() => {
                        if (props.note.after !== 0) {
                            props.moveNote(props.note, -1);
                            props.setShowControls(false);
                        }
                    }}
                />
            </span>
            <span>
                <Plus
                    size={24}
                    color="#4b4b4b"
                    className="hover-opaque cursor-pointer"
                    style={{ position: "relative" }}
                    onClick={() => props.addNote(props.note)}
                />
            </span>
        </>
    );
}

function NoteMenu(props) {
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            href=""
            ref={ref}
            onClick={e => {
                e.preventDefault();
                onClick(e);
            }}
            style={{ marginTop: "-4px" }}
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
        <Dropdown className="ml-auto cursor-pointer hover-opaque z-index-max d-flex align-items-center" >
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                <ThreeDotsVertical color="#4b4b4b" size={18} />
            </Dropdown.Toggle>

            <Dropdown.Menu className="z-index-max" as={CustomMenu}>
                <Dropdown.Item
                    className="d-flex align-items-center px-3"
                    onClick={() => {  console.log("Notes.js NoteMenu Edit") }}
                >
                    <PencilSquare className="mr-3" size={16} />
                    <span style={{ marginLeft: "0.35rem" }} >Edit</span>
                </Dropdown.Item>
                <Dropdown.Item
                    className="d-flex align-items-center px-3"
                    onClick={() => { console.log("Notes.js NoteMenu Delete") }}
                >
                    <Trash2Fill className="mr-3" size={16} />
                    <span style={{ marginLeft: "0.35rem" }} >Delete</span>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

function NoteForm(props) {
    const { note } = props;

    const [text, setText] = useState(note.text ? note.text : '');
    const [show, setShow] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setShow(false);

        props.editNote(note);
        props.setEditMode(false);
    };

    const handleChange = (event) => {
        setText(event.target.value);
        setShow(!event.target.value);
        // setmenutop con l'altezza della textarea per posizionare il menu
        event.target.style.height = 'inherit';
        event.target.style.height = `${event.target.scrollHeight}px`;

        note.text = event.target.value;
    };

    const handleKeyDown = (key) => {
        if (key === "Backspace" && text === '') props.deleteNote(note);
    };

    return (
        <div className="note p-1 d-flex">
            <span style={{ minWidth: "42px" }} />
            <Form className="d-flex ms-3 w-100" onSubmit={handleSubmit}>
                <Form.Control
                    type="text"
                    as="textarea"
                    value={text}
                    className="transparent no-borders p-0 my-1 w-100 min-height-0 resize-none"
                    onChange={(ev) => handleChange(ev)}
                    onKeyDown={(ev) => handleKeyDown(ev.key)}
                    onFocus={() => setShow(true)}
                    onBlur={(ev) => handleSubmit(ev)}
                    autoFocus
                />
                {/* <X size={32} color="#4c4c4c" className="my-auto ms-2 cursor-pointer hover-scaleup-12" onClick={() => { }} />
                <Check2 size={32} color="#4c4c4c" className="my-auto cursor-pointer hover-scaleup-12" onClick={(e) => handleSubmit(e)} /> */}
            </Form>
            <Dropdown.Menu show={show} className="z-index-max" style={{ margin: "75px 0 0 42px" }}>
                <Dropdown.Item
                    className="d-flex align-items-center px-3"
                    onClick={() => { console.log("Notes.js Image") }}
                >
                    <Image className="mr-3" size={16} />
                    <span style={{ marginLeft: "0.35rem" }} >Image</span>
                </Dropdown.Item>
                <Dropdown.Item
                    className="d-flex align-items-center px-3"
                    onClick={() => { console.log("Notes.js Group")}}
                >
                    <CaretRightFill className="mr-3" size={16} />
                    <span style={{ marginLeft: "0.35rem" }} >Group</span>
                </Dropdown.Item>
                <Dropdown.Item
                    className="d-flex align-items-center px-3"
                    onClick={() => {  console.log("Notes.js Chapter") }}
                >
                    <CardText className="mr-3" size={16} />
                    <span style={{ marginLeft: "0.35rem" }} >Chapter</span>
                </Dropdown.Item>
                <Dropdown.Item
                    className="d-flex align-items-center px-3"
                    onClick={() => { console.log("Notes.js Code") }}
                >
                    <CodeSlash className="mr-3" size={16} />
                    <span style={{ marginLeft: "0.35rem" }} >Code</span>
                </Dropdown.Item>
                
            </Dropdown.Menu>
        </div>
    );
}

export default Notes;