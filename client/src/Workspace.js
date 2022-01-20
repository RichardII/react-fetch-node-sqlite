import Notes from "./Notes";
import Reports from "./Reports";
import Calendars from "./Calendar";
import utility from "./utility";
import FilesDemo from "./FileManager";

import { Button, Card, Container } from "react-bootstrap";

function Workspace(props) {
    const { height, width } = utility.useWindowDimensions();
    const { wsWindows } = props;

    // TODO fix switchRight when there are only 3 views active
    const switchViews = (slot1, slot2) => {
        let oldWindows = { ...wsWindows };

        if (slot1 === 2 && slot2 === 4 && wsWindows.nWsWindows === 3) slot2 = 3;

        Object.entries(wsWindows).forEach(([key, value]) => {
            if (value.slot === slot1) oldWindows[key] = {...value, slot: slot2};
            else if (value.slot === slot2) oldWindows[key] = {...value, slot: slot1};
        });

        props.setWsWindows({ ...oldWindows });
    };

    wsWindows.notebook.component = (
        <Card key={4} className="ws-window" style={{ maxHeight: (wsWindows.nWsWindows < 3 ? "100%" : "49%") }} >
            <Notes noteList={props.noteList} setNoteList={props.setNoteList} />
        </Card>
    );
    wsWindows.calendar.component = (
        <Card key={2} className="ws-window" style={{ maxHeight: (wsWindows.nWsWindows < 3 ? "100%" : "49%") }} >
            <Calendars noteList={props.noteList} />
        </Card>
    );
    wsWindows.files.component = (
        <Card key={3} className="ws-window" style={{ maxHeight: (wsWindows.nWsWindows < 3 ? "100%" : "49%") }} >
            <FilesDemo />
        </Card>
    );
    wsWindows.reports.component = (
        <Card key={1} className="ws-window" style={{ maxHeight: (wsWindows.nWsWindows < 3 ? "100%" : "49%") }} >
            <Reports reportList={props.noteList} />
        </Card>
    );

    return (
        <>
            {wsWindows.nWsWindows > 2 && <Button onClick={() => switchViews(1, 3)}>SwitchLeft</Button>}
            {wsWindows.nWsWindows > 1 && <Button onClick={() => switchViews(1, 2)}>SwitchTop</Button>}
            {wsWindows.nWsWindows > 2 && <Button onClick={() => switchViews(2, 4)}>SwitchRight</Button>}
            <Container fluid className="d-flex flex-wrap pb-3" style={{ height: height - props.navHeight - 20 + "px" }} >
                {
                    Object.entries(wsWindows)
                        .filter(([key, value]) => key !== "nWsWindows" && value.show)
                        .sort((a, b) => a[1].slot - b[1].slot)
                        .map(([key, value]) => value.component)
                }
            </Container>
            {wsWindows.nWsWindows > 3 && <Button onClick={() => switchViews(3, 4)}>SwitchBottom</Button>}
        </>
    )
}

export default Workspace;