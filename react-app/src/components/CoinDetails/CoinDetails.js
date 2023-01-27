import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { getOneCoin } from "../../store/coin";
import BtcChart from "../ChartTest";
import TradeCoin from "../TradeCoin/TradeCoin";
import AddCoinToWatchlistModal from "../Watchlists/AddCoinToWatchlistModal";
import CoinChart from "./CoinChart";
import "./CoinDetails.css"


export default function CoinDetails() {
    const dispatch = useDispatch()
    const { coinId } = useParams()

    const [price, setPrice] = useState('Connecting...') //price is string
    const [priceChangePercent, setPriceChangePercent] = useState("")
    const [highPrice, setHighPrice] = useState("")
    const [lowPrice, setLowPrice] = useState("")
    const [volume, setVolume] = useState("")
    const [askPrice, setAskPrice] = useState("")
    const [bidPrice, setBidPrice] = useState("")

    const [showModal, setShowModal] = useState(false) //for add coin to watchlist

    const [errors, setErrors] = useState([])
    const binanceSocket = useRef(null)
    const isMounted = useRef(false)

    const thisCoin = useSelector(state => state.coins.oneCoin)
    const user = useSelector(state => state.session.user)

    useEffect(() => {
        dispatch(getOneCoin(coinId))
    }, [dispatch, coinId])

    //get coin price data
    useEffect(() => {

        fetch(`https://api.binance.us/api/v3/ticker/price?symbol=${thisCoin?.symbol}USD`)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw response
            })
            .then((data) => {
                setPrice(data?.price)
            })
            .catch((error) => {
                console.log("Error fetching initial data: ", error)
                setErrors(error)
            })
    }, [thisCoin])

    //get coin detailed data
    useEffect(() => {
        if (isMounted.current) {
            fetch(`https://api.binance.us/api/v3/ticker/24hr?symbol=${thisCoin?.symbol}USD`)
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    }
                    throw response
                })
                .then((data) => {
                    setPriceChangePercent(data?.priceChangePercent)
                    setHighPrice(data.highPrice)
                    setLowPrice(data.lowPrice)
                    setVolume(data.volume)
                    setBidPrice(data.bidPrice)
                    setAskPrice(data.askPrice)
                })
                .catch((error) => {
                    console.log("Error fetching detailed coin data: ", error)
                    setErrors(error)
                })

        } else {
            isMounted.current = true
        }
    }, [thisCoin])

    //constant update price and % change
    useEffect(() => {
        binanceSocket.current = new WebSocket(`wss://stream.binance.us:9443/ws/${thisCoin?.symbol?.toLowerCase()}usd@ticker`)
        // console.log(binanceSocket)
        binanceSocket.current.onmessage = function (event) {
            console.log(event.data, binanceSocket)

            const msgObj = JSON.parse(event.data)

            setPrice(msgObj.c)
            setPriceChangePercent(msgObj.P)
        }

        binanceSocket.current.addEventListener('error', (event) => {
            setPrice('Websocket Error ', event)
        })

        return () => binanceSocket.current.close();

    }, [thisCoin])




    if (!thisCoin) {
        return null
    }


    return (
        <div className="coin-details-entire-page">
            <div className="page-main-header">{thisCoin.name}
            </div>
            <div className="page-small-title">{thisCoin.symbol}/USD ${price}
                <div><AddCoinToWatchlistModal thisCoin={thisCoin} showModal={showModal} setShowModal={setShowModal} /></div>
            </div>
            <div className="coin-detailed-data-container">
                <div className="detail-inner-container"><div className="detail-title">Price</div><div>${price}</div></div>
                <div className="detail-inner-container"><div className="detail-title">24h Change</div><div className={priceChangePercent >= 0 ? "price-change-positive" : "price-change-negative"}>{priceChangePercent}%</div></div>
                <div className="detail-inner-container"><div className="detail-title">24h High</div><div>{highPrice}</div></div>
                <div className="detail-inner-container"><div className="detail-title">24h Low</div><div>{lowPrice}</div></div>
                <div className="detail-inner-container"><div className="detail-title">24h Volume</div><div>{volume}</div></div>
            </div>
            <CoinChart thisCoin={thisCoin} price={price} showModal={showModal} />
            {user ? <TradeCoin thisCoin={thisCoin} price={price} /> : <NavLink to="/login" exact={true}>Login to Trade</NavLink>}
            {/* <div className="page-small-title">Key Statistics</div> */}
        </div>
    )

}
