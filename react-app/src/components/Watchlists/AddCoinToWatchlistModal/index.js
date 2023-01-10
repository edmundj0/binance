import React, { useState } from "react"
import { Modal } from "../../../context/Modal"
import AddCoinToWatchlist from "./AddCoinToWatchlist"


export default function AddCoinToWatchlistModal({thisCoin, showModal, setShowModal}){



    return (
        <>
        <button onClick={()=>setShowModal(true)} id="new-payment-method-button">Add to Watchlist</button>
        {showModal && (
            <Modal onClose={()=>setShowModal(false)}>
                <AddCoinToWatchlist thisCoin={thisCoin} setShowModal={setShowModal} />
            </Modal>
        )}
        </>
    )

}
