import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllCoins } from "../../store/coin"
import CoinDataTable from "../CoinDetails/CoinDataTable"

export default function AllMarketData () {
    const dispatch = useDispatch()
    let allCoins = useSelector(state => state.coins.allCoins)

    useEffect(() => {
        dispatch(getAllCoins())
    }, [dispatch])



    return (
        <div className='all-coins-market-container'>
        <table className='home-page-table'>
            <thead>
                <tr className='table-homepage-tr'>
                    <th className='table-homepage-th'>Cryptocurrency</th>
                    <th className='table-homepage-th'>Price</th>
                    <th className='table-homepage-th'>24h % Change</th>
                </tr>
            </thead>
            <tbody>
            {allCoins && Object.values(allCoins).map((coin) => {
                return (
                    <tr key={`coins ${coin.id}`} className='table-homepage-tr'>
                        <CoinDataTable coin={coin} />
                    </tr>
                )
            })}
            </tbody>
        </table>
    </div>
    )
}
