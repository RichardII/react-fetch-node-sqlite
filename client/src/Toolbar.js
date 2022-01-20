import { Button, Card, Navbar, Container, Form, FormControl } from "react-bootstrap"

export function ToolbarNotes(props) {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container fluid>
                {/* <Button onClick={ props.setShowChapterModal(true) } variant="secondary">New Chapter</Button> */}
                <Form className="d-flex">
                    <FormControl type="search" placeholder="Search"
                        value={props.search} onChange={ (e) => props.setSearch(e.target.value) } 
                        className="me-2" aria-label="Search"/>
                </Form>
            </Container>
        </Navbar>
    )
}

export function ToolbarReports(props) {
    return (
        <>
            <Card className="toolbar">
                <Button onClick={()=> props.setPreview(!props.preview)}>Preview</Button>
            </Card>
        </>
    )
}