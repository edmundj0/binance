const GET_ALL_PORTFOLIOS = "portfolios/GET_ALL_PORTFOLIOS";
const GET_ONE_PORTFOLIO = "portfolios/GET_ONE_PORTFOLIO";

//action creators
const loadAllPortfolios = (allPortfolios) => ({
    type: GET_ALL_PORTFOLIOS,
    allPortfolios
})

const loadOnePortfolio = (onePortfolio) => ({
    type: GET_ONE_PORTFOLIO,
    onePortfolio
})

//thunks
export const getAllPortfolios = () => async (dispatch) => {
    const response = await fetch('/api/portfolios/current')
    console.log('YOOOOOOOO')
    if (response.ok) {
        const res = await response.json()
        dispatch(loadAllPortfolios(res))
    }
}

export const getOnePortfolio = (portfolioId) => async (dispatch) => {
    const response = await fetch(`/api/portfolios/${portfolioId}`)
    if(response.ok) {
        const res = await response.json()
        dispatch(loadOnePortfolio(res))
    }
}


//reducer
const initialState = {onePortfolio: {}, allUserPortfolios: {}}

const portfoliosReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_ALL_PORTFOLIOS:
            newState = {
                ...state,
                onePortfolio: {...state.onePortfolio},
                allUserPortfolios: {...state.allUserPortfolios}
            }
            action.allPortfolios["Portfolios"].forEach(portfolio => {
                newState.allUserPortfolios[portfolio.id] = portfolio
            })
            return newState
        case GET_ONE_PORTFOLIO:
            newState = {
                ...state,
                onePortfolio: {...state.onePortfolio},
                allUserPortfolios: {...state.allUserPortfolios}
            }
            newState.onePortfolio = action.onePortfolio
            return newState
        default:
            return state
    }
}

export default portfoliosReducer;
