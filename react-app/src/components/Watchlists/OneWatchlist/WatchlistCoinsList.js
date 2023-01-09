import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWatchlistCoins } from "../../../store/watchlist";

export default function WatchlistCoinsList({ watchlist }) {
    const dispatch = useDispatch()
    const [showWatchlistCoins, setShowWatchlistCoins] = useState(false)
    const [coinPrices, setCoinPrices] = useState({})
    const [errors, setErrors] = useState([])
    // const [isMounted, setIsMounted] = useState(false)
    const thisWatchlist = useSelector(state => state.watchlists.oneWatchlist)
    const watchlistCoinsArr = thisWatchlist.Coins //watchlistCoinsArr can be undefined if thisWatchlist is {}
    const allCoins = useSelector(state => state.coins.allCoins)
    const allCoinsArr = Object.values(allCoins)


    console.log(watchlistCoinsArr, 'watchlistcoinsarr')


    //hide watchlist coins on click
    useEffect(() => {
        if (!showWatchlistCoins) {
            return
        }

        const closeWatchlistCoins = () => {
            setShowWatchlistCoins(false);
        }

        document.addEventListener('click', closeWatchlistCoins)

        return () => document.removeEventListener('click', closeWatchlistCoins);
    }, [showWatchlistCoins])


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
    




    return (
        <>
            <button onClick={() => {
                dispatch(getWatchlistCoins(watchlist.id))
                setShowWatchlistCoins(!showWatchlistCoins)
                return
            }}>show details</button>
            {showWatchlistCoins && (
                <div>
                    {watchlistCoinsArr && Object.values(watchlistCoinsArr).map(coin => {
                        return (<div key={`watchlistcoin ${coin.id}`}>
                            {coin.name} {coinPrices[`${coin.symbol}USD`]}
                            {/*prices are saved as (coin.symbol)USD  */}
                        </div>)
                    })}
                </div>
            )}
        </>
    )
}
