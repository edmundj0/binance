import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCoinToWatchlist, createNewWatchlist, getAllWatchlists } from "../../../store/watchlist";


export default function AddCoinToWatchlist({ setShowModal, thisCoin }) {
    const dispatch = useDispatch()
    const [symbol, setSymbol] = useState("")
    const [errors, setErrors] = useState([])

    const [watchlistId, setWatchlistId] = useState(0)

    useEffect(() => {
        dispatch(getAllWatchlists())
    }, [thisCoin])

    const userWatchlists = useSelector(state => state.watchlists.allUserWatchlists)
    const userWatchlistsArr = Object.values(userWatchlists)



    const info = {
        symbol: thisCoin?.symbol
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        let addedCoin = await dispatch(addCoinToWatchlist(info, watchlistId))

        if (addedCoin.errors) {
            console.log('ADDED COIN ERROR')
            await setErrors(addedCoin.errors)
        }
        else {
            setShowModal(false)
        }

        //dispatch(getAllWatchlists())
    }



    return (
        <div className="modal-entire-container">
            <div className="modal-header-text">Add to Watchlist</div>
            <div>
                {errors && (
                    <ul className="error-text">
                        {/* {errors} */}
                        {Object.values(errors).map((error, idx) => <li key={idx} className="newexpense-error-list">{error}</li>)}
                    </ul>
                )}
            </div>
            <form onSubmit={onSubmit} className="modal-form-entire">

                <div className="form-input-text">Select a Watchlist</div>
                <select required
                    name="watchlist"
                    type="text"
                    className="form-input"
                    onChange={(e) => setWatchlistId(e.target.value)}
                    value={watchlistId}>

                    <option style={{ color: "gray"}}>Select a Watchlist</option>
                    {userWatchlistsArr && userWatchlistsArr.map(watchlist =>
                        <option value={watchlist.id} key={watchlist.id}>{watchlist.name}</option>)}
                </select>

                <button type="submit" className="form-submit-button">Add</button>
            </form>
        </div>
    )
}
