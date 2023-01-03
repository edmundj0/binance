import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { deletePortfolio, getOnePortfolio } from "../../../store/portfolio";
import EditPortfolioModal from "../EditPortfolioModal";
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

    console.log(assets, 'asset')

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
                <table>
                    <thead>
                        <tr>
                            <th className="table-th-portfolio-asset">Asset Name</th>
                            <th className="table-th-portfolio-asset">Asset Symbol</th>
                            <th className="table-th-portfolio-asset">Quantity</th>
                            <th className="table-th-portfolio-asset">Avg Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="table-tr-portfolio-asset">
                            <td>United States Dollar</td>
                            <td>USD</td>
                            <td>{thisPortfolio?.buying_power.toFixed(2)}</td>
                            <td>N/A</td>
                        </tr>
                        {assets && Object.values(assets).map((asset) => {
                            return (
                                <tr className="table-tr-portfolio-asset" key={`/assets/${asset.name}`}>
                                    {/* <div>{asset.name} ({asset.symbol})</div>
                                    <div>Quantity: {asset.quantity} Avg Cost:{asset.avg_price}</div> */}
                                    <td>{asset.name}</td>
                                    <td>{asset.symbol}</td>
                                    <td>{asset.quantity.toFixed(7)}</td>
                                    <td>${asset.avg_price.toFixed(2)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className="transactions-container">
                <div className="page-small-title">Transactions</div>
                <table className="transactions-table">
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
                                    <td className="table-td-portfolio-transaction">{transaction.action}</td>
                                    <td className="table-td-portfolio-transaction">${transaction.avg_price.toFixed(2)}</td>
                                    <td className="table-td-portfolio-transaction">{transaction.quantity.toFixed(7)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>

    )
}
