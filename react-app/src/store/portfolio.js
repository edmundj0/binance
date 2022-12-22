const GET_ALL_PORTFOLIOS = "portfolios/GET_ALL_PORTFOLIOS";
const GET_ONE_PORTFOLIO = "portfolios/GET_ONE_PORTFOLIO";
const CREATE_NEW_PORTFOLIO = "portfolios/CREATE_NEW_PORTFOLIO"

//action creators
const loadAllPortfolios = (allPortfolios) => ({
    type: GET_ALL_PORTFOLIOS,
    allPortfolios
})

const loadOnePortfolio = (onePortfolio) => ({
    type: GET_ONE_PORTFOLIO,
    onePortfolio
})

const postPortfolio = (newPortfolio) => ({
    type: CREATE_NEW_PORTFOLIO,
    newPortfolio
})

//thunks
export const getAllPortfolios = () => async (dispatch) => {
    const response = await fetch('/api/portfolios/current')
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

export const createNewPortfolio = (info) => async (dispatch) => {
    const response = await fetch('/api/portfolios', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(info)
    })

    if(response.ok) {
        const newPortfolio = await response.json()
        dispatch(postPortfolio(newPortfolio))
        return newPortfolio
    }
    else {
        const data = await response.json()
        if(data.errors){
            return data
        }
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
        case CREATE_NEW_PORTFOLIO:
            newState = {
                ...state,
                onePortfolio: {...state.onePortfolio},
                allUserPortfolios: {...state.allUserPortfolios}
            }
            newState.onePortfolio = action.newPortfolio
            return newState
        default:
            return state
    }
}

export default portfoliosReducer;
