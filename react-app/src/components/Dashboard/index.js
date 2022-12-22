import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
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
                            <div>
                                {portfolio.name}
                            </div>
                        </div>
                    )
                })}
            </div>

        </div>
    )
}
