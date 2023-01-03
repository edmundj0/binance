import React, { useState } from "react"
import { Modal } from "../../../context/Modal"
import CreatePortfolio from "./CreatePorfolioModal"




export default function CreatePortfolioModal({expense, setHasSubmitted}){
    const [ showModal, setShowModal ] = useState(false)


    return (
        <>
        <button id="open-portfolio-button" onClick={()=>setShowModal(true)}>Open New Portfolio</button>
        {showModal && (
            <Modal onClose={()=>setShowModal(false)}>
                <CreatePortfolio setShowModal={setShowModal} />
            </Modal>
        )}
        </>
    )

}
