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
                    setData(res.data)
                })


        }
    }, [thisCoin])

    return (
        <>
            <div>Options Data</div>
            <div>{data.map(contract=> {
                return (<>{contract.date_exercise}</>)
            })}</div>
        </>
    )
}
