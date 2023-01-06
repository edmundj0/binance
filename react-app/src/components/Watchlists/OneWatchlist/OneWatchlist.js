import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOneWatchlist } from "../../../store/watchlist";

export default function OneWatchlist(){
    const dispatch = useDispatch()
    const { watchlistId } = useParams()

    const thisWatchlist = useSelector(state => state.watchlists.oneWatchlist)


    useEffect(() => {
        dispatch(getOneWatchlist(watchlistId))
    }, [dispatch, watchlistId])

    if(!thisWatchlist) {
        return null
    }

    return (
        <div>Testt</div>
    )
}
