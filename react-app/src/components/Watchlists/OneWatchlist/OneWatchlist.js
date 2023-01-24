import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { deleteWatchlist, getOneWatchlist } from "../../../store/watchlist";
import EditWatchlistModal from "../EditWatchlistModal";
import CoinDataTable from "../../CoinDetails/CoinDataTable";

export default function OneWatchlist({ watchlist }) {
    const dispatch = useDispatch()
    const history = useHistory()
    const [errors, setErrors] = useState([])
    const { watchlistId } = useParams()

    const thisWatchlist = useSelector(state => state.watchlists.oneWatchlist)

    const thisWatchlistCoinsArr = thisWatchlist?.Coins //need "?" because thisWatchlist can be undefined first render
    console.log(thisWatchlistCoinsArr)

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
            <div className="watchlist-coins-table-container">
                <table className="home-page-table">
                    <thead>
                        <tr className="table-homepage-tr">
                            <th className='table-homepage-th'>Cryptocurrency</th>
                            <th className='table-homepage-th'>Price</th>
                            <th className='table-homepage-th'>24h % Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {thisWatchlistCoinsArr && thisWatchlistCoinsArr.map((coin) => {
                            return (
                                <tr key={`watchlistcoin ${coin.id}`} className='table-homepage-tr'>
                                    <CoinDataTable coin={coin} />
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {/* {thisWatchlist && (thisWatchlist.Coins.length ?
                <>
                </>
            )} */}
            </div>
        </div>
    )
}
