import React, { useState } from "react"
import { Modal } from "../../../context/Modal"
import CreateWatchlist from "./CreateWatchlistModal"
import "./CreateWatchlistModal.css"


export default function CreateWatchlistModal(){
    const [ showModal, setShowModal ] = useState(false)


    return (
        <>
        <button onClick={()=>setShowModal(true)} id="new-watchlist-button">New Watchlist</button>
        {showModal && (
            <Modal onClose={()=>setShowModal(false)}>
                <CreateWatchlist setShowModal={setShowModal} />
            </Modal>
        )}
        </>
    )

}
