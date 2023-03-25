import { useEffect, useState } from "react"

export default function CoinOptions({thisCoin}) {
    const [data, setData] = useState("")

    useEffect(() => {
        fetch(`https://api.ledgerx.com/trading/contracts`, {
            headers: {'accept': 'application/json'}
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw response
            })
            .then((data) => {
                setData = data
            })

    }, [thisCoin])

    return (
        <>
        <div>Options Data</div>
        <div>{data}</div>
        </>
    )
}
