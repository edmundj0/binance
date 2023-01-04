import React, { useState } from "react"
import { Modal } from "../../../context/Modal"
import Deposits from "./DepositsModal"


export default function DepositsModal(){
    const [ showModal, setShowModal ] = useState(false)


    return (
        <>
        <button onClick={()=>setShowModal(true)} className="deposit-button">Deposit Now</button>
        {showModal && (
            <Modal onClose={()=>setShowModal(false)}>
                <Deposits setShowModal={setShowModal} />
            </Modal>
        )}
        </>
    )

}
