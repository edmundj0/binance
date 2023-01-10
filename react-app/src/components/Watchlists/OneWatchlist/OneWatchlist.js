import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { deleteWatchlist, getOneWatchlist } from "../../../store/watchlist";
import EditWatchlistModal from "../EditWatchlistModal";

export default function OneWatchlist({ watchlist }) {
    const dispatch = useDispatch()
    const history = useHistory()
    const [errors, setErrors] = useState([])
    const { watchlistId } = useParams()

    const thisWatchlist = useSelector(state => state.watchlists.oneWatchlist)

    const deleteThisWatchlist = async (e) => {
        let deletingWatchlist = await dispatch(deleteWatchlist(watchlistId))

        if (deletingWatchlist.errors) {
            setErrors(deletingWatchlist.errors)
        }
        else {
            history.push('/dashboard')
        }
    }

    useEffect(() => {
        dispatch(getOneWatchlist(watchlistId))
    }, [dispatch, watchlistId])

    if (!thisWatchlist) {
        return null
    }

    return (
        <div className="watchlist-entire-page">
            <div className="watchlist-settings-container">
                <div className="page-main-header">{thisWatchlist.name}</div>
                <div className="watchlist-settings-buttons">
                    <EditWatchlistModal />
                    <button onClick={() => dispatch(deleteThisWatchlist)} className="delete-watchlist-button">Delete</button>
                </div>
            </div>
            Under development :D
        </div>
    )
}
