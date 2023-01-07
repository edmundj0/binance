import React, { useState } from "react"
import { Modal } from "../../../context/Modal"
import EditWatchlist from "./EditWatchlistModal"


export default function EditWatchlistModal({watchlist}){
    const [ showModal, setShowModal ] = useState(false)


    return (
        <>
        <button onClick={()=>setShowModal(true)}><i className="fa-solid fa-pen-to-square"></i></button>
        {showModal && (
            <Modal onClose={()=>setShowModal(false)}>
                {/* <CreateWatchlist setShowModal={setShowModal} /> */}
                <EditWatchlist setShowModal={setShowModal} watchlist={watchlist} />
            </Modal>
        )}
        </>
    )

}
