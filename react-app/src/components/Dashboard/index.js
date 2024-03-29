import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useHistory } from "react-router-dom"
import { getAllCoins } from "../../store/coin"
import { deletePaymentMethod, getAllPaymentMethods } from "../../store/paymentMethod"
import { getAllPortfolios } from "../../store/portfolio"
import { getAllWatchlists, deleteWatchlist, getWatchlistCoins } from "../../store/watchlist"
import CreatePaymentMethodModal from "../PaymentMethods/CreatePaymentMethodModal"
import DepositsModal from "../PaymentMethods/DepositsModal"
import EditPaymentMethodModal from "../PaymentMethods/EditPaymentMethodModal"
import CreatePortfolioModal from "../Portfolio/CreatePortfolioModal"
import CreateWatchlistModal from "../Watchlists/CreateWatchlistModal"
import EditWatchlistModal from "../Watchlists/EditWatchlistModal"
import WatchlistCoinsList from "../Watchlists/OneWatchlist/WatchlistCoinsList"
import "./Dashboard.css"

export default function Dashboard() {
    const dispatch = useDispatch()
    const history = useHistory()

    let allPortfolios = useSelector(state => state.portfolios.allUserPortfolios)
    // console.log(allPortfolios, 'allPortfolios')
    let allPaymentMethods = useSelector(state => state.paymentMethods.allPaymentMethods)

    let allCoins = useSelector(state => state.coins.allCoins)
    let allWatchlists = useSelector(state => state.watchlists.allUserWatchlists)

    //throw all of these into one useEffect
    useEffect(() => {
        dispatch(getAllPortfolios())
    }, [dispatch])

    useEffect(() => {
        dispatch(getAllPaymentMethods())
    }, [dispatch])

    useEffect(() => {
        dispatch(getAllCoins())
    }, [dispatch])

    useEffect(() => {
        dispatch(getAllWatchlists())
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

                <div className="page-small-title"><span>Your Payment Methods</span>
                    <CreatePaymentMethodModal />
                </div>
                <div>
                    {Object.values(allPaymentMethods).map((method) => {
                        return (
                            <div key={`method ${method.id}`} className="each-payment-method-container">
                                <div id="payment-method-text">{method.note} • {method?.type?.toUpperCase()} *{method?.account_number?.slice(-4)}
                                </div>
                                <div className="payment-method-buttons-container">
                                    <EditPaymentMethodModal method={method} />
                                    <button onClick={() => dispatch(deletePaymentMethod(method.id))} className="delete-payment-method-button">Delete</button>
                                </div>
                            </div>
                        )
                    })}
                </div>


            </div>
            <div className="dashboard-right-container">
                <div className="deposits-entire-container">
                    <div className="deposits-header-text">Deposits</div>
                    <p className="deposits-description-text">
                        Our Instant Deposits give you immediate access to your money after you initiate a deposit. That means if you see an opportunity in the market, you can use your money right away instead of waiting for your funds to settle.
                    </p>
                    <div>
                        <DepositsModal />
                    </div>
                </div>

                <div className="watchlists-entire-container">
                    <div className="watchlists-header-text">Your Watchlists
                        <CreateWatchlistModal />
                    </div>
                    <div>
                        {Object.values(allWatchlists).map((watchlist) => {
                            return (
                                <div key={`watchlist ${watchlist.id}`} className="watchlist-row">
                                    <div className='each-watchlist-name'>
                                        <NavLink to={`/watchlists/${watchlist.id}`} style={{ textDecoration: 'none' }} className="watchlist-navlink">{watchlist.name}</NavLink>
                                        {/* <EditWatchlistModal watchlist={watchlist} /> */}
                                        {/* <button onClick={() => dispatch(deleteWatchlist(watchlist.id))}>Delete</button> */}
                                    </div>
                                    <WatchlistCoinsList watchlist={watchlist} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

        </div>
    )
}
