import { Navbar, Container, Button, FormControl, Form, Nav } from "react-bootstrap";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { JournalBookmarkFill, CalendarDate, FileEarmarkText, FileRichtext, JournalBookmark, CalendarDateFill, FileEarmarkTextFill, FileRichtextFill, ArrowLeft } from 'react-bootstrap-icons';
import utility from "./utility";


function Header(props) {
    const location = useLocation();

    let ws;
    if (location.state) ws = location.state.currentWorkspace;

    const { wsWindows } = props;

    const manageWindows = (currentWindow) => {
        let oldWindows = {...wsWindows};

        if (wsWindows[currentWindow].show) {
            Object.entries(wsWindows).forEach( ([key, value]) => {
                if (key === "nWsWindows") oldWindows[key] = value - 1;
                else if (value.slot > wsWindows[currentWindow].slot) oldWindows[key] = {...value, slot: value.slot - 1};
                else if (key === currentWindow) oldWindows[key] = {...value, slot: undefined, show: false};
            });
        }
        else {
            oldWindows = {
                ...wsWindows,
                nWsWindows: wsWindows.nWsWindows + 1,
                [currentWindow]: {
                    ...wsWindows[currentWindow],
                    slot: utility.getMaxSlot(wsWindows) + 1,
                    show: true,                
                },
            };
        }

        props.setWsWindows({...oldWindows});
    };

    return (
        <>
            <Navbar className="myNav" expand="lg" ref={props.elementRef}>
                <Container>
                    {location.pathname === "/" ?
                        <>
                            <Navbar.Brand ><h3>finTHESIS</h3></Navbar.Brand>
                            <Form className="d-flex">
                                <FormControl type="search" placeholder="Search" className="me-2" aria-label="Search" />
                                <Button variant="outline-success">Search</Button>
                            </Form>
                        </>
                        :
                        <>
                            <span className="d-flex align-items-center" >
                                <Link to="/" className="no-link-style hover-scaleup-12 me-3" ><ArrowLeft size={36} /></Link>
                                <Navbar.Brand ><h3>{ws.name}</h3></Navbar.Brand>
                            </span>
                            <Nav style={{display:'flex', flexDirection:'row'}}>
                                <Nav.Link className='icon-button' onClick={() => manageWindows("notebook")}>
                                    {wsWindows.notebook.show ? <JournalBookmarkFill /> : <JournalBookmark />}
                                    <br />
                                    <span>Notebook</span>
                                </Nav.Link>
                                <Nav.Link className='icon-button' onClick={() => manageWindows("calendar")}>
                                    {wsWindows.calendar.show ? <CalendarDateFill /> : <CalendarDate />}
                                    <br />
                                    <span>Calendar</span>
                                </Nav.Link>
                                <Nav.Link className='icon-button' onClick={() => manageWindows("files")}>
                                    {wsWindows.files.show ? <FileEarmarkTextFill /> : <FileEarmarkText />}
                                    <br />
                                    <span>Files</span>
                                </Nav.Link>
                                <Nav.Link className='icon-button' onClick={() => manageWindows("reports")}>
                                    {wsWindows.reports.show ? <FileRichtextFill /> : <FileRichtext />}
                                    <br />
                                    <span>Report</span>
                                </Nav.Link>
                            </Nav>
                        </>
                    }

                </Container>
            </Navbar>
        </>
    )
}

export default Header;