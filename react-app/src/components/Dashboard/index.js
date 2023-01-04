import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useHistory } from "react-router-dom"
import { getAllCoins } from "../../store/coin"
import { deletePaymentMethod, getAllPaymentMethods } from "../../store/paymentMethod"
import { getAllPortfolios } from "../../store/portfolio"
import CreatePaymentMethodModal from "../PaymentMethods/CreatePaymentMethodModal"
import DepositsModal from "../PaymentMethods/DepositsModal"
import EditPaymentMethodModal from "../PaymentMethods/EditPaymentMethodModal"
import CreatePortfolioModal from "../Portfolio/CreatePortfolioModal"
import "./Dashboard.css"

export default function Dashboard() {
    const dispatch = useDispatch()
    const history = useHistory()

    let allPortfolios = useSelector(state => state.portfolios.allUserPortfolios)
    console.log(allPortfolios, 'allPortfolios')
    let allPaymentMethods = useSelector(state => state.paymentMethods.allPaymentMethods)

    let allCoins = useSelector(state => state.coins.allCoins)


    useEffect(() => {
        dispatch(getAllPortfolios())
    }, [dispatch])

    useEffect(() => {
        dispatch(getAllPaymentMethods())
    }, [dispatch])

    useEffect(() => {
        dispatch(getAllCoins())
    }, [dispatch])

    const tradeRouteChange = (coin) => {
        history.push(`/coins/${coin.id}`)
    }

    return (
        <div className="dashboard-entire-page">
            <div className="dashboard-left-container">
                <div className="page-main-header">My Dashboard</div>
                <div className="page-small-title"><span>My Portfolios (Accounts)</span>
                    <CreatePortfolioModal />
                </div>
                {Object.values(allPortfolios).map((portfolio) => {
                    return (
                        <div key={`portfolio ${portfolio.id}`} className="each-portfolio-container">
                            <NavLink to={`/portfolios/${portfolio.id}`} key={`portfolios ${portfolio.id}`} style={{ textDecoration: 'none' }} className='navlink-portfolio'>
                                <div id="portfolio-name-text">{portfolio.name}</div>
                                <div>Account Type: <span id="buying-power-and-type-text">{portfolio.account_type}</span> • Buying Power (USD): $<span id="buying-power-and-type-text">{portfolio.buying_power.toFixed(2)}</span> </div>
                            </NavLink>
                        </div>
                    )
                })}

                <div className="page-small-title">Market Information</div>
                <table className="my-table">
                    <thead>
                        <tr>
                            <th>Coin Name</th>
                            <th>Coin Symbol</th>
                            <th>Coin Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(allCoins).map((coin) => {
                            return (
                                <tr key={`coin ${coin.id}`}>
                                    <td className="my-table-td">{coin.name}</td>
                                    <td className="my-table-td">{coin.symbol}</td>
                                    <td className="my-table-td" id="coin-description-text">{coin.description}</td>
                                    <td className="my-table-td"><button className="trade-button-dashboard" onClick={() => tradeRouteChange(coin)}>Trade</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>


                <div>Your Payment Methods
                    {Object.values(allPaymentMethods).map((method) => {
                        return (
                            <div key={`method ${method.id}`}>
                                <div>{method.note}</div>
                                <div>{method.account_number}</div>
                                <EditPaymentMethodModal method={method} />
                                <button onClick={() => dispatch(deletePaymentMethod(method.id))}>Delete</button>
                            </div>
                        )
                    })}
                    <CreatePaymentMethodModal />
                </div>
                <div>
                    <DepositsModal />
                </div>
            </div>
            <div className="dashboard-right-container">Test</div>

        </div>
    )
}
