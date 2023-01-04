import React, { useState } from "react"
import { Modal } from "../../../context/Modal"
import CreatePaymentMethod from "./CreatePaymentMethodModal"
import "../../Portfolio/CreatePortfolioModal/CreatePortfolioModal.css"




export default function CreatePaymentMethodModal(){
    const [ showModal, setShowModal ] = useState(false)


    return (
        <>
        <button onClick={()=>setShowModal(true)} id="new-payment-method-button">Add New Payment Method</button>
        {showModal && (
            <Modal onClose={()=>setShowModal(false)}>
                <CreatePaymentMethod setShowModal={setShowModal} />
            </Modal>
        )}
        </>
    )

}
