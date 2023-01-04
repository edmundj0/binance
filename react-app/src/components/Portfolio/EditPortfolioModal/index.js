import React, { useState } from "react"
import { Modal } from "../../../context/Modal"
import EditPortfolio from "./EditPortfolioModal"




export default function EditPortfolioModal({expense, setHasSubmitted}){
    const [ showModal, setShowModal ] = useState(false)


    return (
        <>
        <button onClick={()=>setShowModal(true)} className="edit-portfolio-button">Edit Portfolio Settings</button>
        {showModal && (
            <Modal onClose={()=>setShowModal(false)}>
                <EditPortfolio setShowModal={setShowModal} />
            </Modal>
        )}
        </>
    )

}
