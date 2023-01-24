import React, { useState } from "react"
import { Modal } from "../../../context/Modal"
import EditWatchlist from "./EditWatchlistModal"


export default function EditWatchlistModal(){
    const [ showModal, setShowModal ] = useState(false)


    return (
        <>
        <button onClick={()=>setShowModal(true)} className="edit-watchlist-button"><i className="fa-solid fa-pen-to-square"></i>Edit Watchlist</button>
        {showModal && (
            <Modal onClose={()=>setShowModal(false)}>
                {/* <CreateWatchlist setShowModal={setShowModal} /> */}
                <EditWatchlist setShowModal={setShowModal} />
            </Modal>
        )}
        </>
    )

}
