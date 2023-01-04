import React, { useState } from "react"
import { Modal } from "../../../context/Modal"
import EditPaymentMethod from "./EditPaymentMethodsModal"




export default function EditPaymentMethodModal({method}){
    const [ showModal, setShowModal ] = useState(false)


    return (
        <>
        <button onClick={()=>setShowModal(true)} className="edit-payment-method-button">Edit</button>
        {showModal && (
            <Modal onClose={()=>setShowModal(false)}>
                <EditPaymentMethod setShowModal={setShowModal} method={method} />
            </Modal>
        )}
        </>
    )

}
