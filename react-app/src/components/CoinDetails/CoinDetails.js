import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOneCoin } from "../../store/coin";
import TradeCoin from "../TradeCoin/TradeCoin";


export default function CoinDetails() {
    const dispatch = useDispatch()
    const { coinId } = useParams()

    const [price, setPrice] = useState('Connecting...') //price is string
    const [errors, setErrors] = useState([])
    const binanceSocket = useRef(null)

    const thisCoin = useSelector(state => state.coins.oneCoin)

    useEffect(() => {
        dispatch(getOneCoin(coinId))
    }, [dispatch, coinId])

    useEffect(() => {
        fetch(`https://api.binance.us/api/v3/ticker/price?symbol=${thisCoin?.symbol}USD`)
        .then((response) => {
            if (response.ok){
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

    useEffect(() => {
        binanceSocket.current = new WebSocket(`wss://stream.binance.us:9443/ws/${thisCoin?.symbol?.toLowerCase()}usd@trade`)
        console.log(binanceSocket)
        binanceSocket.current.onmessage = function (event) {
            console.log(event.data, binanceSocket)

            const msgObj = JSON.parse(event.data)

            setPrice(msgObj.p)
        }

        binanceSocket.current.addEventListener('error', (event) => {
            setPrice('Websocket Error ', event)
        })

        return () => binanceSocket.current.close();

    }, [thisCoin])




    if(!thisCoin){
        return null
    }


    return (
        <div>
            <h1>{thisCoin.name}</h1>
            <h3>{thisCoin.symbol}/USD</h3>
            <div>${price}</div>
            <TradeCoin thisCoin={thisCoin} />
        </div>
    )

}
