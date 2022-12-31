import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import { deletePaymentMethod, getAllPaymentMethods } from "../../store/paymentMethod"
import { getAllPortfolios } from "../../store/portfolio"
import CreatePaymentMethodModal from "../PaymentMethods/CreatePaymentMethodModal"
import EditPaymentMethodModal from "../PaymentMethods/EditPaymentMethodModal"
import CreatePortfolioModal from "../Portfolio/CreatePortfolioModal"

export default function Dashboard() {
    const dispatch = useDispatch()

    let allPortfolios = useSelector(state => state.portfolios.allUserPortfolios)
    console.log(allPortfolios, 'allPortfolios')
    let allPaymentMethods = useSelector(state => state.paymentMethods.allPaymentMethods)


    useEffect(() => {
        dispatch(getAllPortfolios())
    }, [dispatch])

    useEffect(() => {
        dispatch(getAllPaymentMethods())
    }, [dispatch])

    return (
        <div>
            <div>All Portfolios (Accounts)
                <CreatePortfolioModal />
                {Object.values(allPortfolios).map((portfolio) => {
                    return (
                        <div key={`portfolio ${portfolio.id}`}>
                            <NavLink to={`/portfolios/${portfolio.id}`} key={`portfolios ${portfolio.id}`} style={{ textDecoration: 'none' }}>
                                <div>{portfolio.name}</div>
                                <div>{portfolio.buying_power}</div>
                            </NavLink>
                        </div>
                    )
                })}
            </div>
            <div>Your Payment Methods
                {Object.values(allPaymentMethods).map((method) => {
                    return (
                        <div key={`method ${method.id}`}>
                                <div>{method.note}</div>
                                <div>{method.account_number}</div>
                                <EditPaymentMethodModal method={method}/>
                                <button onClick={() => dispatch(deletePaymentMethod(method.id))}>Delete</button>
                        </div>
                    )
                })}
                <CreatePaymentMethodModal />
            </div>

        </div>
    )
}
