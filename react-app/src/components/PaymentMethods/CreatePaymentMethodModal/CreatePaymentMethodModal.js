import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewPortfolio, getAllPortfolios } from "../../../store/portfolio";


export default function CreatePaymentMethod({ setShowModal }) {
    const dispatch = useDispatch()
    const [type, setType] = useState(0)
    const [accountNumber, setAccountNumber] = useState("")
    const [routingNumber, setRoutingNumber] = useState("")
    const [note, setNote] = useState("")

    let currentUser = useSelector(state => state.session.user)

    const info = {
        type,
        account_number: accountNumber,
        routing_number: routingNumber,
        note
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        if (accountType === 0 || accountType === "Select Payment Type") {
            setErrors(["Please select a payment type"])
        }
        else {

            let newPortfolio = await dispatch(createNewPaymentMethod(info))

            if (newPortfolio.errors) {
                await setErrors(newPortfolio.errors)
            }
            else {
                setShowModal(false)
            }
        }

        dispatch(getAllPortfolios())
    }



    return (
        <div className="modal-expense-entire">
            <div className="modal-expense-header">Create New Portfolio</div>
            <div>
                {errors && (
                    <ul>
                        {/* {errors} */}
                        {Object.values(errors).map((error, idx) => <li key={idx} className="newexpense-error-list">{error}</li>)}
                    </ul>
                )}
            </div>
            <form onSubmit={onSubmit} className="expense-form">

                <div className="form-input">Name</div>
                <input required
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder="Name of Portfolio"></input>

                <div className="form-input">Account Type</div>
                <select required
                    type="text"
                    onChange={(e) => setAccountType(e.target.value)}
                    value={accountType}>

                    <option style={{ color: "gray" }}>Select Account Type</option>
                    <option>Investing</option>
                    <option>Margin</option>
                    <option>Ira</option>
                </select>

                <div></div>
                <button type="submit" className="form-submit-button">Create New Portfolio (Account)</button>
            </form>
        </div>
    )
}
