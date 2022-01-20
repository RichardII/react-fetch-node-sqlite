//import { ToolbarReports } from "./Toolbar";

import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from "react";
import { Form, Card, Button, Row, Col } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';

import utility from './utility';

function Reports(props) {
    const [preview, setPreview] = useState(false);
    const [text, setText] = useState("");
    const [selection, setSelection] = useState({ start: 0, end: 0 });

    return (
        <>
            <ToolbarReports preview={preview} setPreview={setPreview} selection={selection} text={text} setText={setText} />
            {preview ?
                <ReactMarkdown className="markdown" style={{ maxWidth: "80vw" }} >{text}</ReactMarkdown>
                :
                <TextEditor className="h-100" text={text} setText={setText} setSelection={setSelection} />
            }
        </>
    )
}

function TextEditor(props) {

    useEffect(() => {
        const mdTextarea = document.getElementById("md-textarea");

        document.addEventListener("selectionchange", () => {
            props.setSelection({ start: mdTextarea.selectionStart, end: mdTextarea.selectionEnd });
        });

        mdTextarea.addEventListener("selectionchange", () => {
            props.setSelection({ start: mdTextarea.selectionStart, end: mdTextarea.selectionEnd });
        });

        return () => {
            document.removeEventListener("selectionchange", () => {
                props.setSelection({ start: mdTextarea.selectionStart, end: mdTextarea.selectionEnd });
            });

            mdTextarea.removeEventListener("selectionchange", () => {
                props.setSelection({ start: mdTextarea.selectionStart, end: mdTextarea.selectionEnd });
            });
        };
    }, []);

    return (
        <Form.Control
            id="md-textarea"
            type="text"
            as="textarea"
            className="textarea transparent h-100"
            value={props.text}
            onChange={(event) => {
                props.setText(event.target.value);
            }}
        ></Form.Control>
    );
}

function ToolbarReports(props) {
    const { text, selection } = props;

    const addMdSyntax = (syntaxType) => {
        let newText = "";

        switch (syntaxType) {
            case "h1":
                newText = utility.insertBefore(text, "# ", selection.start);
                break;
            case "bold":
                newText = utility.insertBeforeAndAfter(text, "**", "**", selection.start, selection.end);
                break;
            case "italic":
                newText = utility.insertBeforeAndAfter(text, "*", "*", selection.start, selection.end);
                break;
            case "underline":
                // TO DO, insert </ins> after
                newText = utility.insertBeforeAndAfter(text, "<ins>", "</ins>", selection.start, selection.end);
                break;
            case "code":
                newText = utility.insertBeforeAndAfter(text, "```\n", "\n```", selection.start, selection.end);
                break;
            case "table":
                // tables apparently don't work in this markdown
                newText = utility.insertBefore(text,
`| Syntax      | Description | Test Text     |
| :---        |    :----:   |          ---: |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |`
                    , selection.start);
                break;
            case "link":
                newText = utility.insertBefore(text, "[Site Name](https://sitename.com)", selection.start);
                break;
            case "image":
                newText = utility.insertBefore(text, `![cGAN!](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/526744/4f90a48f-d6d6-1c69-1a09-3ae44040da0e.jpeg)`, selection.start);
                break;
        }

        props.setText(newText);
    };

    return (
        <Card>
            <Row style={{ display: 'flex', alignItems: 'center' }}>
                <Col>
                    <Icon.ArrowLeft className='icon-button' size={26} />
                    <Icon.ArrowReturnLeft className='icon-button' size={26} />
                    <Icon.ArrowReturnRight className='icon-button' size={26} />
                </Col>
                <>|</>
                <Col>
                    <Icon.TypeBold className='icon-button' onClick={() => addMdSyntax("bold")} size={20} />
                    <Icon.TypeItalic className='icon-button' onClick={() => addMdSyntax("italic")} size={20} />
                    <Icon.TypeUnderline className='icon-button' onClick={() => addMdSyntax("underline")} size={20} />
                </Col>
                <>|</>
                <Col>
                    <Icon.TypeH1 className='icon-button' onClick={() => addMdSyntax("h1")} size={20} />
                    <Icon.CodeSlash className='icon-button' onClick={() => addMdSyntax("code")} size={20} />
                    <Icon.Grid3x3 className='icon-button' onClick={() => addMdSyntax("table")} size={20} />
                    <Icon.Link className='icon-button' onClick={() => addMdSyntax("link")} size={20} />
                    <Icon.Image className='icon-button' onClick={() => addMdSyntax("image")} size={20} />
                </Col>
                <>|</>
                <Col>
                    <Icon.Upload className='icon-button' size={20} />
                    <Button size='sm' style={{ borderRadius: '80px' }} onClick={() => props.setPreview(!props.preview)}>Preview</Button>
                </Col>
            </Row>
        </Card>
    )
}

export default Reports;