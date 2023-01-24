import { useState } from "react";
import { useDispatch } from "react-redux";
import { createNewWatchlist, getAllWatchlists } from "../../../store/watchlist";


export default function CreateWatchlist({ setShowModal }) {
    const dispatch = useDispatch()
    const [watchlistName, setWatchlistName] = useState("")
    const [description, setDescription] = useState("")
    const [errors, setErrors] = useState([])



    const info = {
        name: watchlistName,
        description
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        if(watchlistName?.length > 30) {
            setErrors(["Name must be less than 30 characters"])
        }

        else {

            let newWatchlist = await dispatch(createNewWatchlist(info))

            if (newWatchlist.errors) {
                await setErrors(newWatchlist.errors)
            }
            else {
                setShowModal(false)
            }
        }

        //dispatch(getAllWatchlists())
    }



    return (
        <div className="modal-entire-container">
            <div className="modal-header-text">Create New Watchlist</div>
            <div>
                {errors && (
                    <ul className="error-text">
                        {/* {errors} */}
                        {Object.values(errors).map((error, idx) => <li key={idx} className="newexpense-error-list">{error}</li>)}
                    </ul>
                )}
            </div>
            <form onSubmit={onSubmit} className="modal-form-entire">

                <div className="form-input-text">Watchlist Name</div>
                <input required
                    type="text"
                    className="form-input"
                    onChange={(e) => setWatchlistName(e.target.value)}
                    value={watchlistName}
                    placeholder="Watchlist Name">
                </input>

                <div className="form-input-text">Description</div>
                <input required
                    type="text"
                    className="form-input"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    placeholder="Description"></input>

                <button type="submit" className="form-submit-button">Create Watchlist</button>
            </form>
        </div>
    )
}
