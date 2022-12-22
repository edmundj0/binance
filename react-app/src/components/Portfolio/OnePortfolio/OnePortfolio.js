import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { deletePortfolio, getOnePortfolio } from "../../../store/portfolio";
import EditPortfolioModal from "../EditPortfolioModal";

export default function OnePortfolio() {
    const dispatch = useDispatch()
    const { portfolioId } = useParams();
    const history = useHistory()
    const [errors, setErrors] = useState([])

    const thisPortfolio = useSelector(state => state.portfolios.onePortfolio)


    useEffect(() => {
        dispatch(getOnePortfolio(portfolioId))
    }, [dispatch, portfolioId])

    if (!thisPortfolio.id){
        return null
    }

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
        </div>

    )
}
