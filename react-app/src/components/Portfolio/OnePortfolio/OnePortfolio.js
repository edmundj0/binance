import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { deletePortfolio, getOnePortfolio } from "../../../store/portfolio";
import EditPortfolioModal from "../EditPortfolioModal";
import OnePortfolioChart from "../OnePortfolioChart/OnePortfolioChart";
import "./OnePortfolio.css"

export default function OnePortfolio() {
    const dispatch = useDispatch()
    const { portfolioId } = useParams();
    const history = useHistory()
    const [assets, setAssets] = useState([])
    const [errors, setErrors] = useState([])

    // const [portfolioTransactions, setPortfolioTransactions] = useState("")

    const thisPortfolio = useSelector(state => state.portfolios.onePortfolio)
    console.log(thisPortfolio, 'thisportfolio')



    useEffect(() => {
        dispatch(getOnePortfolio(portfolioId))
    }, [dispatch, portfolioId])

    useEffect(() => {
        if (thisPortfolio.id) {
            fetch(`/api/portfolios/${thisPortfolio.id}/assets`)
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    }
                    throw response
                })
                .then((data) => {
                    setAssets(data.Assets)
                })
        }
    }, [dispatch, thisPortfolio])

    //unnecessary
    // useEffect(() => {
    //     console.log(thisPortfolio, 'thisportfolioinuseeffect')
    //     if (thisPortfolio.id) {
    //         setPortfolioTransactions(thisPortfolio.Transactions)
    //     }
    // }, [thisPortfolio])

    if (!thisPortfolio.id) {
        return null
    }

    const portfolioTransactions = thisPortfolio.Transactions



    const deleteThisPortfolio = async (e) => {
        let deletingPortfolio = await dispatch(deletePortfolio(portfolioId))

        if (deletingPortfolio.errors) {
            setErrors(deletingPortfolio.errors)
        }
        else {
            history.push('/dashboard')
        }
    }

    return (
        <div className="portfolio-entire-page">
            <div className="portfolio-settings-container">
                <div className="page-main-header">{thisPortfolio.name}</div>
                <div className="portfolio-settings-buttons">
                    <EditPortfolioModal />
                    <div>
                        <div>
                            {errors && (
                                <ul>
                                    {/* {errors} */}
                                    {Object.values(errors).map((error, idx) => <li key={idx} className="error-text">{error}</li>)}
                                </ul>
                            )}
                        </div>
                        <button onClick={() => dispatch(deleteThisPortfolio)} className="delete-portfolio-button">Delete Portfolio</button>
                        <p id="delete-warning-text">*cannot delete portfolios with existing transactions</p>
                    </div>
                </div>
            </div>
            <div className="account-holdings-container">
                <div className="page-small-title">Account Holdings</div>
                <table className="my-table">
                    <thead>
                        <tr>
                            <th className="table-th-portfolio-asset">Asset Name</th>
                            <th className="table-th-portfolio-asset">Asset Symbol</th>
                            <th className="table-th-portfolio-asset">Quantity</th>
                            <th className="table-th-portfolio-asset">Avg Cost</th>
                            {/* <th className="table-th-portfolio-asset">TOTAL VALUE</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="table-tr-portfolio-asset">
                            <td className="my-table-td">United States Dollar</td>
                            <td className="my-table-td">USD</td>
                            <td className="my-table-td">{thisPortfolio?.buying_power.toFixed(2)}</td>
                            <td className="my-table-td">N/A</td>
                            {/* <td className="my-table-td">${thisPortfolio?.buying_power.toFixed(2)}</td> */}
                        </tr>
                        {assets && Object.values(assets).map((asset) => {
                            return (
                                <tr className="table-tr-portfolio-asset" key={`/assets/${asset.name}`}>
                                    {/* <div>{asset.name} ({asset.symbol})</div>
                                    <div>Quantity: {asset.quantity} Avg Cost:{asset.avg_price}</div> */}
                                    <td className="my-table-td">{asset.name}</td>
                                    <td className="my-table-td"><NavLink to={`/coins/${asset.coin_id}`}>{asset.symbol}</NavLink></td>
                                    <td className="my-table-td">{asset.quantity.toFixed(7)}</td>
                                    <td className="my-table-td">${asset.avg_price.toFixed(2)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className="portfolio-graph-container">
                <div className="page-small-title">Portfolio Performance</div>
                <OnePortfolioChart thisPortfolio={thisPortfolio} />
                <div id='portfolio-chart-warning-text'>This chart illustrates historical performance based on current account holdings and may not accurately reflect performance based on purchase dates.</div>
            </div>
            <div className="transactions-container">
                <div className="page-small-title">Transactions</div>
                {portfolioTransactions.length ?
                    <table className="transactions-table my-table">
                        <thead>
                            <tr>
                                <th className="table-th-portfolio-transaction">Time</th>
                                <th className="table-th-portfolio-transaction">Symbol</th>
                                <th className="table-th-portfolio-transaction">Type</th>
                                <th className="table-th-portfolio-transaction">Side</th>
                                <th className="table-th-portfolio-transaction">Price</th>
                                <th className="table-th-portfolio-transaction">Amount</th>
                            </tr>

                        </thead>
                        <tbody>
                            {portfolioTransactions && Object.values(portfolioTransactions).reverse().map((transaction) => {
                                return (
                                    <tr key={`/transactions/${transaction.id}`}>
                                        <td className="table-td-portfolio-transaction">{transaction.created_at.slice(5)}</td>
                                        <td className="table-td-portfolio-transaction"><NavLink to={`/coins/${transaction.Coin.id}`}>{transaction.Coin.symbol}</NavLink>/USD</td>
                                        <td className="table-td-portfolio-transaction">Market</td>
                                        <td className={transaction.action === 'buy' ? "table-td-portfolio-transaction transaction-text-buy" : "table-td-portfolio-transaction transaction-text-sell"}>{transaction.action}</td>
                                        <td className="table-td-portfolio-transaction">${transaction.avg_price.toFixed(2)}</td>
                                        <td className="table-td-portfolio-transaction">{transaction.quantity.toFixed(7)}{transaction.Coin.symbol}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    : <div>Make a transaction and they will appear here!</div>}
            </div>

        </div>

    )
}
