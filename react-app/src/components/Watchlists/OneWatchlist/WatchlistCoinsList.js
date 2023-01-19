import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWatchlistCoins, removeCoinFromWatchlist } from "../../../store/watchlist";
import "./OneWatchlist.css"

export default function WatchlistCoinsList({ watchlist }) {
    const dispatch = useDispatch()
    const [showWatchlistCoins, setShowWatchlistCoins] = useState(false)
    const [coinPrices, setCoinPrices] = useState({})
    const [errors, setErrors] = useState([])
    const watchlistContainer = useRef([])
    // const [isMounted, setIsMounted] = useState(false)
    const thisWatchlist = useSelector(state => state.watchlists.oneWatchlist)
    const watchlistCoinsArr = thisWatchlist.Coins //watchlistCoinsArr can be undefined if thisWatchlist is {}
    const allCoins = useSelector(state => state.coins.allCoins)
    const allCoinsArr = Object.values(allCoins)


    // useEffect(() => {
    //     watchlistContainer.current = watchlistContainer.current.slice(0, watchlistCoinsArr.length)
    // }, [watchlistCoinsArr.length])



    //hide watchlist coins on click, except for the container with the watchlist info
    useEffect(() => {

        if (!showWatchlistCoins) { //only run logic in useEffect if showWatchlistCoins is true
            return
        }

        console.log(watchlistContainer.current, 'watchlist container')


        const closeWatchlistCoins = (e) => {
            if (!watchlistContainer || !watchlistContainer.current || !watchlistContainer.current.contains(e.target)) setShowWatchlistCoins(false)
        }

        // const doNotCloseWatchlistCoins = (e) => {
        //     e.stopPropagation() //prevent close when click is in watchlist container; however, button onClick won't fire
        // }


        document.addEventListener('click', closeWatchlistCoins)

        // if (watchlistContainer && watchlistContainer.current) {
        //     const watchlistListener = watchlistContainer.current.addEventListener('click', doNotCloseWatchlistCoins)
        // }


        return () => {
            document.removeEventListener('click', closeWatchlistCoins)
            // if (watchlistContainer && watchlistContainer.current) {
            //     watchlistContainer.current.removeEventListener('click', doNotCloseWatchlistCoins)
            // }
            return
        };
    }, [showWatchlistCoins, watchlistContainer.current])


    //load coin prices into coinPrices state
    //minimize fetches but nested for loop complexity
    useEffect(() => {
        console.log('fetchingggggggggggg')
        fetch(`https://api.binance.us/api/v3/ticker/price`)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw response
            })
            .then((dataArr => {
                for (let coin of allCoinsArr) {
                    if (!(`${coin.symbol}USD` in coinPrices)) {
                        const obj = dataArr.find(objInDataArr => objInDataArr.symbol === `${coin.symbol}USD`)
                        coinPrices[obj.symbol] = obj.price
                        console.log(coinPrices, 'inside the loop')
                        setCoinPrices(coinPrices)
                    }
                }
            }))
    }, [])

    return (
        <>
            <div className="show-details-button-container">
                <button onClick={() => {
                    dispatch(getWatchlistCoins(watchlist.id))
                    setShowWatchlistCoins(!showWatchlistCoins)
                    return
                }} className="show-details-button">{showWatchlistCoins ? <i className="fa-solid fa-angle-up"></i> : <i className="fa-solid fa-angle-down"></i>}
                </button>
            </div>
            <div>

                {showWatchlistCoins && (
                    <div ref={watchlistContainer} className='watchlist-coins-container'>
                        {watchlistCoinsArr && watchlistCoinsArr.length ? null : <div>Empty Watchlist</div>}
                        {watchlistCoinsArr && Object.values(watchlistCoinsArr).map(coin => {
                            return (
                                <div key={`watchlistcoin ${coin.id}`} className="watchlist-each-coin-container">
                                    <div className="watchlist-coin-name-price">{coin.name} {coinPrices[`${coin.symbol}USD`]}</div>
                                    {/*prices are saved as (coin.symbol)USD  */}
                                    <button onClick={() => dispatch(removeCoinFromWatchlist({ symbol: coin.symbol }, watchlist.id))} className='remove-from-watchlist-button'>x</button>

                                </div>
                            )
                        })}
                    </div>
                )}

            </div>

        </>
    )
}







    //this would cause too many fetches
    // for (let coin of allCoinsArr) {
    //     console.log('forloop ran')
    //     if (!(coin.symbol in coinPrices)) {
    //         fetch(`https://api.binance.us/api/v3/ticker/price?symbol=${coin.symbol}USD`)
    //             .then((response) => {
    //                 if (response.ok) {
    //                     return response.json()
    //                 }
    //                 throw response
    //             })
    //             .then((data => {
    //                 coinPrices[coin.symbol] = data?.price
    //                 setCoinPrices(coinPrices)
    //                 console.log(coinPrices, 'inside the fetch')
    //             }))
    //             .catch((error) => {
    //                 console.log("Error fetching initial data: ", error)
    //                 setErrors(error)
    //             })
    //     }
    // }
