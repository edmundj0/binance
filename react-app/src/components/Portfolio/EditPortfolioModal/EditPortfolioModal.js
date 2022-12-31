import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { editOnePortfolio } from "../../../store/portfolio";


export default function EditPortfolio({ setShowModal }) {
    const dispatch = useDispatch()
    const [accountType, setAccountType] = useState("")
    const [name, setName] = useState("")
    const [errors, setErrors] = useState([])

    const { portfolioId } = useParams()
    let currentUser = useSelector(state => state.session.user)
    let thisPortfolio = useSelector(state => state.portfolios.onePortfolio)

    useEffect(() => {
        if (thisPortfolio) {
            setAccountType(thisPortfolio.account_type)
            setName(thisPortfolio.name)
        }
    }, [thisPortfolio])

    const info = {
        account_type: accountType,
        name,
        user_id: currentUser.id
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        if (accountType === 0 || accountType === "Select Account Type") {
            setErrors(["Please select a group"])
        }
        else {

            let editedPortfolio = await dispatch(editOnePortfolio(info, thisPortfolio.id))

            if (editedPortfolio.errors) {
                await setErrors(editedPortfolio.errors)
            }
            else {
                setShowModal(false)
            }
        }

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
                    name="accountType"
                    type="text"
                    onChange={(e) => setAccountType(e.target.value)}
                    value={accountType}>

                    <option style={{ color: "gray" }} value='' disabled>Select Account Type</option>
                    <option value="Investing">Investing</option>
                    <option value="Margin">Margin</option>
                    <option value="Ira">Ira</option>
                </select>

                <div></div>
                <button type="submit" className="form-submit-button">Save Changes</button>
            </form>
        </div>
    )
}
