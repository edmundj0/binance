import React, { useState } from "react"
import { Modal } from "../../../context/Modal"
import CreatePaymentMethod from "./CreatePaymentMethodModal"




export default function CreatePaymentMethodModal(){
    const [ showModal, setShowModal ] = useState(false)


    return (
        <>
        <button onClick={()=>setShowModal(true)}>Add New Payment Method</button>
        {showModal && (
            <Modal onClose={()=>setShowModal(false)}>
                <CreatePaymentMethod setShowModal={setShowModal} />
            </Modal>
        )}
        </>
    )

}
