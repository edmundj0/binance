import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { deletePortfolio, getOnePortfolio } from "../../../store/portfolio";
import EditPortfolioModal from "../EditPortfolioModal";

export default function OnePortfolio() {
    const dispatch = useDispatch()
    const { portfolioId } = useParams();
    const history = useHistory()
    const [assets, setAssets] = useState([])
    const [errors, setErrors] = useState([])

    const thisPortfolio = useSelector(state => state.portfolios.onePortfolio)



    useEffect(() => {
        dispatch(getOnePortfolio(portfolioId))
    }, [dispatch, portfolioId])

    useEffect(() => {
        fetch(`/api/portfolios/${portfolioId}/assets`)
        .then((response) => {
            if (response.ok){
                return response.json()
            }
            throw response
        })
        .then((data) => {
            setAssets(data.Assets)
        })
    }, [dispatch, portfolioId])

    if (!thisPortfolio.id){
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
        <div>
            <h1>{thisPortfolio.name}</h1>
            <EditPortfolioModal />
            <div>
                <div>
                    {errors && (
                        <ul>
                            {/* {errors} */}
                            {Object.values(errors).map((error, idx) => <li key={idx} className="newexpense-error-list">{error}</li>)}
                        </ul>
                    )}
                </div>
                <button onClick={() => dispatch(deleteThisPortfolio)}>Delete Portfolio</button>
                <span>*cannot delete portfolios with existing transactions</span>
            </div>
            <div>
                <h3>Account Holdings</h3>
                {Object.values(assets).map((asset) => {
                    return (
                        <div key={`/assets/${asset.name}`}>
                            <div>{asset.name} ({asset.symbol})</div>
                            <div>Quantity: {asset.quantity} Avg Cost:{asset.avg_price}</div>
                        </div>
                    )
                })}
            </div>
            <div>
                <h3>Transactions</h3>
                {Object.values(portfolioTransactions).map((transaction) => {
                    return (
                        <div key={`/transactions/${transaction.id}`}>
                            <NavLink to={`/coins/${transaction.Coin.id}`}>{transaction.Coin.symbol}</NavLink>
                            <div>Action: {transaction.action} Quantity: {transaction.quantity}, Avg Price: {transaction.avg_price}</div>
                        </div>
                    )
                })}
            </div>
        </div>

    )
}
