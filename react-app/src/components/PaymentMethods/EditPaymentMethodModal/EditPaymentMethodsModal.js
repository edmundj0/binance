import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { editOnePaymentMethod, getAllPaymentMethods, getOnePaymentMethod } from "../../../store/paymentMethod";


export default function EditPaymentMethod({ setShowModal, method}) {
    const dispatch = useDispatch()
    const [type, setType] = useState(0)
    const [accountNumber, setAccountNumber] = useState("")
    const [routingNumber, setRoutingNumber] = useState("")
    const [note, setNote] = useState("")
    const [errors, setErrors] = useState([])

    useEffect(() => {
        dispatch(getOnePaymentMethod(method.id))
    }, [dispatch, method.id])

    useEffect(() => {
        if (method) {
            setType(method.type)
            setAccountNumber(method.account_number)
            setRoutingNumber(method.routing_number)
            setNote(method.note)
        }
    }, [method])

    const info = {
        type,
        account_number: accountNumber,
        routing_number: routingNumber,
        note
    }


    const onSubmit = async (e) => {
        e.preventDefault()

        let updatedPaymentMethod = await dispatch(editOnePaymentMethod(info, method.id))
            if (updatedPaymentMethod?.errors) {
                setErrors(updatedPaymentMethod.errors)
            }
            else {
                setShowModal(false)
            }

        dispatch(getAllPaymentMethods())
    }

    return (
        <div>
            <div>Update Your Payment Method</div>
            <ul>
                {Object.values(errors).map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <form onSubmit={onSubmit}>

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
                    type="text"
                    onChange={(e) => setNote(e.target.value)}
                    value={note}
                    placeholder="Note"
                    className="form-input"></input>

                <button type="submit" className="form-submit-button">Save Changes</button>
            </form>
        </div>


    )
}
