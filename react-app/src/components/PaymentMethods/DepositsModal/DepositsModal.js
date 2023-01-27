import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllPaymentMethods } from "../../../store/paymentMethod";
import { editOnePortfolio, getAllPortfolios } from "../../../store/portfolio";


export default function Deposits({ setShowModal }) {
    const dispatch = useDispatch()
    const [usdAmount, setUsdAmount] = useState(0)
    const [errors, setErrors] = useState([])

    const [portfolioId, setPortfolioId] = useState(0)
    const [paymentMethodId, setPaymentMethodId] = useState(0)
    const [currentPortfolio, setCurrentPortfolio] = useState("")

    let userPortfolios = useSelector(state => state.portfolios)
    let userPortfoliosArr = Object.values(userPortfolios?.allUserPortfolios)

    let userPaymentMethods = useSelector(state => state.paymentMethods)
    let userPaymentMethodsArr = Object.values(userPaymentMethods?.allPaymentMethods)

    useEffect(() => {
        dispatch(getAllPortfolios())
    }, [dispatch])

    useEffect(() => {
        dispatch(getAllPaymentMethods())
    }, [dispatch])

    useEffect(() => {
        if (portfolioId) {
            let selectedPortfolio = userPortfoliosArr.find(portfolio => portfolio.id === Number(portfolioId))
            setCurrentPortfolio(selectedPortfolio)
        }
    }, [portfolioId])

    let portfolioInfo = {}
    if (currentPortfolio) {
        portfolioInfo = {
            account_type: currentPortfolio.account_type,
            name: currentPortfolio.name,
            buying_power: currentPortfolio.buying_power + Number(usdAmount)
        }
    }


    const onSubmit = async (e) => {
        e.preventDefault()

        let err = []

        if (portfolioId === 0 || portfolioId === "Select a Portfolio") {
            err.push("Please select a portfolio")
        }

        if (paymentMethodId === 0 || paymentMethodId === "Select a Payment Method") {
            err.push("Please select a payment method")
        }

        //doesn't cause state change due to array
        await setErrors(err)

        //guard so dispatch won't fire. errors state won't reflect errors from this cycle yet
        if (err.length) {
            return
        }

        let editedPortfolio = await dispatch(editOnePortfolio(portfolioInfo, portfolioId))

        if (editedPortfolio.errors) {
            await setErrors(editedPortfolio.errors)
        } else {
            setShowModal(false)
        }

        dispatch(getAllPortfolios()) //update buying power

    }

    return (
        <div className="modal-entire-container">
            <div className="modal-header-text">Deposit</div>
            <ul className="error-text">
                {Object.values(errors).map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <form onSubmit={onSubmit} className="modal-form-entire">

                <div className="form-input-text">From (choose payment method)</div>
                <select required
                    name="payment method"
                    type="text"
                    className="form-input"
                    onChange={(e) => setPaymentMethodId(e.target.value)}
                    value={paymentMethodId}>

                    <option style={{ color: "gray" }}>Select a Payment Method</option>
                    {userPaymentMethodsArr && userPaymentMethodsArr.map(method =>
                        <option value={method.id} key={method.id}>{`${method.note} • ${method.type} x${method.account_number.slice(-4)}`}</option>)}
                </select>

                <div className="form-input-text">To (choose portfolio)</div>
                <select required
                    name="portfolio"
                    type="text"
                    className="form-input"
                    onChange={(e) => setPortfolioId(e.target.value)}
                    value={portfolioId}>

                    <option style={{ color: "gray" }}>Select a Portfolio</option>
                    {userPortfoliosArr && userPortfoliosArr.map(portfolio =>
                        <option value={portfolio.id} key={portfolio.id}>{portfolio.name}</option>)}
                </select>

                <div className="form-input-text">Transfer Amount (USD)</div>
                <input required
                    type="number" min="1" max="1000000" step="1"
                    onChange={(e) => setUsdAmount(e.target.value)}
                    value={usdAmount}
                    placeholder="Amount (USD)"
                    className="form-input"></input>

                <button type="submit" className="form-submit-button">Deposit Money</button>
            </form>
        </div>


    )
}
