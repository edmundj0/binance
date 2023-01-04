import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewPortfolio, getAllPortfolios } from "../../../store/portfolio";
import "./CreatePortfolioModal.css"


export default function CreatePortfolio({ setShowModal }) {
    const dispatch = useDispatch()
    const [accountType, setAccountType] = useState(0)
    const [name, setName] = useState("")
    const [errors, setErrors] = useState([])

    let currentUser = useSelector(state => state.session.user)

    const info = {
        account_type: accountType,
        name,
        user_id: currentUser.id,
        buying_power: 0
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        if (accountType === 0 || accountType === "Select Account Type") {
            setErrors(["Please select a group"])
        }
        else {

            let newPortfolio = await dispatch(createNewPortfolio(info))

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
        <div className="modal-entire-container">
            <div className="modal-header-text">Create New Portfolio</div>
            <div>
                {errors && (
                    <ul className="error-text">
                        {/* {errors} */}
                        {Object.values(errors).map((error, idx) => <li key={idx} className="newexpense-error-list">{error}</li>)}
                    </ul>
                )}
            </div>
            <form onSubmit={onSubmit} className="modal-form-entire">

                <div className="form-input-text">Name</div>
                <input required
                    type="text"
                    className="form-input"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder="Name of Portfolio"></input>

                <div className="form-input-text">Account Type</div>
                <select required
                    type="text"
                    className="form-input"
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
