import APIs from "./API";
import { HomeWorkspace, HomeWorkspaceForm } from "./HomeWorkspaceComponents"

import { useState } from "react";
import { Container } from "react-bootstrap";
import { PlusSquareFill } from "react-bootstrap-icons";

function Home(props) {
    const [formVisible, setFormVisible] = useState(false);

   

    const addNewWorkarea = (name) => {
        APIs.insertWorkarea({ name: name })
            .then(() => {
                props.setDirty(true);
                // props.setFormVisible(false);
            })
            .catch(error => console.log(error))
    } 
     

    const onClose = () => {
        setFormVisible(false);
    }

    const onDone = () => {
        props.setDirty(true)
        setFormVisible(false);
    }

    return (
        <>
            <h1 className="title mb-5">Workspaces</h1>
            <Container className="d-flex flex-wrap justify-content-center" >
                {
                    props.workareaList.map(w =>
                        <HomeWorkspace key={w.id} ws={w} deleteWorkspace={props.deleteWorkarea} editWorkarea={props.editWorkarea} onDone={onDone}  onClose={onClose} />
                    )
                }
            </Container>            
            {formVisible ?
                <HomeWorkspaceForm addNewWorkarea={addNewWorkarea} onDone={onDone} onClose={onClose}  />
                :
                <PlusSquareFill size={48} color="#4c4c4c"
                    className="mx-auto my-4 cursor-pointer hover-opaque"
                    onClick={() => setFormVisible(true)}
                />
            }
        </>
    )
}

export default Home;