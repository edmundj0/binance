import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { editOnePortfolio, getAllPortfolios } from "../../store/portfolio";
import { createNewTransaction } from "../../store/transaction";
import "./TradeCoin.css"


export default function TradeCoin({ thisCoin, price }) {
    const dispatch = useDispatch()
    const history = useHistory()
    const [tradeAction, setTradeAction] = useState("buy")
    const [portfolioId, setPortfolioId] = useState(0)
    const [currentPortfolio, setCurrentPortfolio] = useState("")
    const [portfolioAssetQuantity, setPortfolioAssetQuantity] = useState(0)
    const [dollarsOrQuantity, setDollarsOrQuantity] = useState("dollars")
    const [amount, setAmount] = useState("")
    const [errors, setErrors] = useState([])
    let userPortfolios = useSelector(state => state.portfolios)
    let userPortfoliosArr = Object.values(userPortfolios?.allUserPortfolios)


    useEffect(() => {
        dispatch(getAllPortfolios())
        // console.log('getting portfolios')
    }, [dispatch])

    //commenting out b/c of bug where wrong avbl coin balance is displayed, due to value of thisCoin
    // useEffect(() => {
    //     //could cause portfolioId to be undefined
    //     //sets select dropdown with default portfolio if user coming from that portfolio
    //     if (userPortfolios.onePortfolio) {
    //         setPortfolioId(userPortfolios.onePortfolio.id)
    //     }
    // }, [userPortfolios])

    useEffect(() => {
        if (portfolioId) {
            let selectedPortfolio = userPortfoliosArr.find(portfolio => portfolio.id === Number(portfolioId))
            setCurrentPortfolio(selectedPortfolio)

            //find quantity of coin in currentPortfolio, if not found default to zero
            if (portfolioId !== "Select a Portfolio") {
                fetch(`/api/portfolios/${portfolioId}/assets`)
                    .then((response) => {
                        if (response.ok) {
                            return response.json()
                        }
                        throw response
                    })
                    .then((data) => {
                        let asset = data.Assets.find(asset => asset.symbol === thisCoin.symbol)
                        asset ? setPortfolioAssetQuantity(asset.quantity) : setPortfolioAssetQuantity(0)
                    })
            }
        }
    }, [portfolioId])

    const info = {
        portfolio_id: portfolioId,
        coin_id: thisCoin.id,
        quantity: dollarsOrQuantity === "dollars" ? Number(amount / price).toFixed(7) : Number(amount),
        avg_price: price,
        action: tradeAction
    }

    let portfolioInfo = {} //will error out if currentPortfolio doesn't exist, so need if statement
    if (currentPortfolio) {
        portfolioInfo = {
            account_type: currentPortfolio.account_type,
            name: currentPortfolio.name,
            buying_power: info.action === "buy" ? currentPortfolio.buying_power - (info.quantity * info.avg_price) : currentPortfolio.buying_power + (info.quantity * info.avg_price)
        }
    }

    // console.log(info.action, 'info action', typeof info.quantity)
    // console.log(typeof portfolioAssetQuantity, 'portfolioAssetQuantity')
    const onSubmit = async (e) => {
        e.preventDefault()

        if (isNaN(price) === true) {
            setErrors(["Price of coin couldn't be determined at this time. Please try again later."])
        } else if (portfolioId === undefined || portfolioId === "Select a Portfolio" || portfolioId === 0) {
            setErrors(["Please select a portfolio"])
        } else if (!info.quantity || info.quantity === "" || info.quantity <= 0) {
            setErrors(["Please enter an amount or an amount greater than 0"])
        } else if (currentPortfolio.buying_power < info.quantity * info.avg_price && info.action === "buy") {
            setErrors(["Insufficient USD Balance"])
        } else if (info.action === "sell" && info.quantity > portfolioAssetQuantity) {
            setErrors([`Insufficient ${thisCoin.symbol} balance`])
        }
        else {
            let newTransaction = await dispatch(createNewTransaction(info))

            if (newTransaction.errors) {
                await setErrors(newTransaction.errors)
            }
            else {
                //reduce buying power of portfolio
                let editedPortfolio = await dispatch(editOnePortfolio(portfolioInfo, portfolioId))

                if (editedPortfolio.errors) {
                    await setErrors(editedPortfolio.errors)
                }

                dispatch(getAllPortfolios()) //update buying power

                history.push(`/portfolios/${portfolioId}`)
            }
        }

    }

    return (
        <div className="trade-coin-entire-container">
            <div className="place-order-text">Place Order {thisCoin.symbol}</div>

            <div>
                {errors && (
                    <ul className="error-text">
                        {Object.values(errors).map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                )}
            </div>

            <button onClick={() => setTradeAction("buy")} className={tradeAction === "buy" ? 'buy-button-active buysell-button' : 'buy-button-not-active buysell-button'}>BUY</button>
            <button onClick={() => setTradeAction("sell")} className={tradeAction === "buy" ? 'sell-button-not-active buysell-button' : 'sell-button-active buysell-button'}>SELL</button>
            <form onSubmit={onSubmit}>

                <div className="trade-coin-header-text">Choose Portfolio</div>
                    <select required
                        name="portfolio"
                        type="text"
                        onChange={(e) => setPortfolioId(e.target.value)}
                        value={portfolioId}
                        className="select-trade-coin">

                        <option style={{ color: "gray" }}>Select a Portfolio</option>
                        {userPortfoliosArr && userPortfoliosArr.map(portfolio =>
                            <option value={portfolio.id} key={portfolio.id}>{portfolio.name}</option>)}
                    </select>
                {currentPortfolio && (tradeAction === "buy" ? <div className="avbl-text-choosePortfolio">Avbl: {currentPortfolio.buying_power}USD</div> : <div className="avbl-text-choosePortfolio">Avbl: {portfolioAssetQuantity}{thisCoin.symbol}</div>)}

                <div className="trade-coin-header-text">{tradeAction === "buy" ? `Buy In` : `Sell In`}</div>
                <select required
                    name="dollarsOrAmount"
                    type="text"
                    onChange={(e) => setDollarsOrQuantity(e.target.value)}
                    value={dollarsOrQuantity}
                    className="select-trade-coin">

                    <option value="dollars">Dollars</option>
                    <option value="quantity">Quantity</option>
                </select>

                <div className="trade-coin-header-text">Amount</div>
                <input required
                    type="text"
                    value={dollarsOrQuantity === "dollars" ? `$${amount}` : `${amount}`}
                    placeholder={`0${thisCoin.symbol}`}
                    className="input-trade-coin"
                    onChange={(e) => {
                        if (dollarsOrQuantity === "dollars" && isNaN(e.target.value.slice(1)) === false) { //only set amount if user inputs number
                            //if user inputs a number with > 2 decimal places, truncate anything after 3rd decimal place
                            //cleaner in html than using type="number"
                            //known formating issue: xx.xx0000 would be valid
                            if (Number(e.target.value.slice(1)) > Math.trunc(Number(e.target.value.slice(1)) * 100) / 100) {
                                setAmount(Math.trunc(Number(e.target.value.slice(1)) * 100) / 100)
                            }
                            else {
                                setAmount(e.target.value.slice(1))
                            }
                        }

                        else if (dollarsOrQuantity === "quantity" && isNaN(e.target.value) === false) {
                            if (Number(e.target.value) > Math.trunc(Number(e.target.value) * 10000) / 10000) {
                                setAmount(Math.trunc(Number(e.target.value) * 10000) / 10000)
                            }
                            else {
                                setAmount(e.target.value)
                            }
                        }

                    }}
                ></input>

                <div className="estimated-text-amount">{dollarsOrQuantity === "dollars" ? `Est. ${Number(amount / price).toFixed(7)} ${thisCoin.symbol}` : `Est. $${Number(amount * price).toFixed(2)}`}</div>

                <button type="submit" className={tradeAction === 'buy' ? 'submit-buy-button trade-submit-button' : 'submit-sell-button trade-submit-button'}>{tradeAction === 'buy' ? <span>Submit Buy Order</span> : <span>Submit Sell Order</span>}</button>



            </form>
        </div>
    )


}
