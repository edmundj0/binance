import { useEffect, useRef, useState } from "react"
import { NavLink, useHistory } from "react-router-dom"




export default function CoinDataTable({ coin }) {
    const [price, setPrice] = useState(0)
    const [priceChangePercent, setPriceChangePercent] = useState(0)
    const [errors, setErrors] = useState([])
    const binanceSocket = useRef(null)

    const history = useHistory()

    //get initial coin data
    useEffect(() => {
        fetch(`https://api.binance.us/api/v3/ticker/24hr?symbol=${coin?.symbol}USD`)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw response
            })
            .then((data) => {
                setPrice(data?.lastPrice)
                setPriceChangePercent(data?.priceChangePercent)
            })
            .catch((error) => {
                console.log("Error fetching initial data: ", error)
                setErrors(error)
            })
    }, [coin])

    //update coin prices with websocket
    useEffect(() => {
        binanceSocket.current = new WebSocket(`wss://stream.binance.us:9443/ws/${coin?.symbol?.toLowerCase()}usd@ticker`)
        // console.log(binanceSocket)
        binanceSocket.current.onmessage = function (event) {

            const msgObj = JSON.parse(event.data)

            setPrice(msgObj.c)
            setPriceChangePercent(msgObj.P)
        }

        binanceSocket.current.addEventListener('error', (event) => {
            setPrice('Websocket Error ', event)
        })

        return () => binanceSocket.current.close();

    }, [coin])

    const tradeRouteChange = (coin) => {
        history.push(`/coins/${coin?.id}`)
    }

    return (
        <>
            <td className="table-homepage-td"><span id="homepage-table-coin-symbol">{coin.symbol}</span> {coin.name}</td>
            <td className="table-homepage-td">${price}</td>
            <td className={priceChangePercent >= 0 ? 'homepage-price-change-positive table-homepage-td' : 'homepage-price-change-negative table-homepage-td'}>{priceChangePercent}%</td>
            <td className="table-homepage-td"><button onClick={()=>tradeRouteChange(coin)} className='view-coin-button'>View</button></td>
        </>
    )
}
