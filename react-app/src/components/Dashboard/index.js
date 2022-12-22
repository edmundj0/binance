import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import { getAllPortfolios } from "../../store/portfolio"
import CreatePortfolioModal from "../Portfolio/CreatePortfolioModal"

export default function Dashboard() {
    const dispatch = useDispatch()

    let allPortfolios = useSelector(state => state.portfolios.allUserPortfolios)
    console.log(allPortfolios, 'allPortfolios')


    useEffect(() => {
        dispatch(getAllPortfolios())
    }, [dispatch])

    return (
        <div>
            <div>All Portfolios (Accounts)
                <CreatePortfolioModal />
                {Object.values(allPortfolios).map((portfolio) => {
                    return (
                        <div key={`portfolio ${portfolio.id}`}>
                            <NavLink to={`/portfolios/${portfolio.id}`} key={`portfolios ${portfolio.id}`} style={{textDecoration: 'none'}}>
                            <div>{portfolio.name}</div>
                            <div>{portfolio.buying_power}</div>
                            </NavLink>
                        </div>
                    )
                })}
            </div>

        </div>
    )
}
