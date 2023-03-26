import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

export default function CoinOptions({ thisCoin }) {
    const dispatch = useDispatch()
    const [data, setData] = useState([])

    // useEffect(() => {
    //     const coin_id = thisCoin.id
    //     console.log(coin_id, 'testttttttttttt')
    //     setData(dispatch(getOptionsData(coin_id)))

    // }, [thisCoin])

    console.log(data, 'data')
    useEffect(() => {
        console.log(thisCoin, 'testttttttttttttttttttttttttt')
        if (thisCoin) {
            fetch(`/api/market-data/options/${thisCoin.id}`)
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    }
                    throw response
                })
                .then((res) => {
                    setData(res.data.reverse())
                })


        }
    }, [thisCoin])

    useEffect(() => {
        const optionsSocket = new WebSocket(`wss://api.ledgerx.com/ws`)
        optionsSocket.onmessage = function (event) {
            console.log(event)
        }

        return () => optionsSocket.close();
    })


    return (
        <>
            <div>Options Data</div>
            <div>{data.map(contract => {
                return (
                    <div key={contract.id}>{contract.date_exercise} ${contract.strike_price / 100}</div>)
            })}</div>
        </>
    )
}
