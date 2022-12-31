import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewPaymentMethod, getAllPaymentMethods } from "../../../store/paymentMethod";


export default function CreatePaymentMethod({ setShowModal }) {
    const dispatch = useDispatch()
    const [type, setType] = useState(0)
    const [accountNumber, setAccountNumber] = useState("")
    const [routingNumber, setRoutingNumber] = useState("")
    const [note, setNote] = useState("")
    const [errors, setErrors] = useState([])

    let currentUser = useSelector(state => state.session.user)

    const info = {
        type,
        account_number: accountNumber,
        routing_number: routingNumber,
        note
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        if (type === 0 || type === "Select Payment Type") {
            setErrors(["Please select a payment type"])
        }
        else {

            let newPaymentMethod = await dispatch(createNewPaymentMethod(info))

            if (newPaymentMethod.errors) {
                await setErrors(newPaymentMethod.errors)
            }
            else {
                setShowModal(false)
            }
        }

        dispatch(getAllPaymentMethods())
    }



    return (
        <div>
            <div>Add New Payment Method</div>
            <div>
                {errors && (
                    <ul>
                        {/* {errors} */}
                        {Object.values(errors).map((error, idx) => <li key={idx} className="newexpense-error-list">{error}</li>)}
                    </ul>
                )}
            </div>
            <form onSubmit={onSubmit}>

                <div className="form-input">Choose a payment type</div>
                <select required
                    type="text"
                    onChange={(e) => setType(e.target.value)}
                    value={type}
                    placeholder="Payment Type">

                    <option style={{color: "gray"}}>Select Payment Type</option>
                    <option>Personal Checking</option>
                    <option>Personal Savings</option>
                </select>

                <div className="form-input">Account Number</div>
                <input required
                    type="text"
                    onChange={(e) => setAccountNumber(e.target.value)}
                    value={accountNumber}
                    placeholder="Account Number"></input>

                <div className="form-input">Routing Number</div>
                <input required
                    type="text"
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    value={routingNumber}
                    placeholder="Routing Number"></input>

                <div className="form-input">Note</div>
                <input required
                    type="textarea"
                    onChange={(e) => setNote(e.target.value)}
                    value={note}
                    placeholder="Note"></input>


                <div></div>
                <button type="submit" className="form-submit-button">Add Payment Method</button>
            </form>
        </div>
    )
}
