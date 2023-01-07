import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { editOnePortfolio, getOnePortfolio } from "../../../store/portfolio";
import { editOneWatchlist, getOneWatchlist } from "../../../store/watchlist";


export default function EditWatchlist({ setShowModal, watchlist }) {
    const dispatch = useDispatch()
    const [watchlistName, setWatchlistName] = useState("")
    const [description, setDescription] = useState("")
    const [errors, setErrors] = useState([])

    // const thisWatchlist = useSelector(state => state.watchlists.oneWatchlist)

    useEffect(() => {
        dispatch(getOneWatchlist(watchlist.id))
    }, [watchlist])

    // useEffect(() => {
    //     if (thisWatchlist) {
    //         setWatchlistName(thisWatchlist.name)
    //         setDescription(thisWatchlist.description)
    //     }
    // }, [thisWatchlist])

    useEffect(() => {
        if(watchlist) {
            setWatchlistName(watchlist.name)
            setDescription(watchlist.description)
        }
    }, [watchlist])

    const info = {
        name: watchlistName,
        description
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        let editedWatchlist = await dispatch(editOneWatchlist(info, watchlist.id))

        if (editedWatchlist.errors) {
            await setErrors(editedWatchlist.errors)
        }
        else {
            setShowModal(false)
            // dispatch(getOneWatchlist(thisWatchlist.id))
        }
    }



    return (
        <div className="modal-entire-container">
            <div className="modal-header-text">Edit Watchlist</div>
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
                    placeholder="Watchlist Name"></input>

                <div className="form-input-text">Description</div>
                <input required
                    type="text"
                    className="form-input"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    placeholder="Description"></input>

                <div></div>
                <button type="submit" className="form-submit-button">Save Changes</button>
            </form>
        </div>
    )
}
