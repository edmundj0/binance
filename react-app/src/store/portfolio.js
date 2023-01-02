const GET_ALL_PORTFOLIOS = "portfolios/GET_ALL_PORTFOLIOS";
const GET_ONE_PORTFOLIO = "portfolios/GET_ONE_PORTFOLIO";
const CREATE_NEW_PORTFOLIO = "portfolios/CREATE_NEW_PORTFOLIO"
const EDIT_ONE_PORTFOLIO = "portfolios/EDIT_ONE_PORTFOLIO"
const DELETE_ONE_PORTFOLIO = "portfolios/DELETE_ONE_PORTFOLIO"
const CLEAR_PORTFOLIOS = "portfolios/CLEAR"

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

const editPortfolio = (edited) => ({
    type: EDIT_ONE_PORTFOLIO,
    edited
})

const delPortfolio = (portfolioId) => ({
    type: DELETE_ONE_PORTFOLIO,
    portfolioId
})

export const clearPortfolios = () => ({
    type: CLEAR_PORTFOLIOS
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

export const editOnePortfolio = (info, portfolioId) => async (dispatch) => {
    const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(info)
    })
    if(response.ok){
        const edited = await response.json()
        dispatch(editPortfolio(edited))
        return edited
    }else{
        const data = await response.json()
        if(data.errors){
            return data
        }
        // else{
        //     return {"errors": "Something wrong happened. Please refresh your page and try again."}
        // }
    }
}

export const deletePortfolio = (portfolioId) => async (dispatch) => {
    const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'DELETE'
    })
    if(response.ok){
        dispatch(delPortfolio(portfolioId))
        return response
    }else {
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
        case EDIT_ONE_PORTFOLIO:
            newState = {
                ...state,
                onePortfolio: {...state.onePortfolio},
                allUserPortfolios: {...state.allUserPortfolios}
            }
            newState.onePortfolio = action.edited
            return newState
        case DELETE_ONE_PORTFOLIO:
            newState = {
                ...state,
                onePortfolio: {...state.onePortfolio},
                allUserPortfolios: {...state.allUserPortfolios}
            }
            newState.onePortfolio = {}
            delete newState.allUserPortfolios[action.portfolioId]
            return newState
        case CLEAR_PORTFOLIOS:
            newState = {
                ...state,
                onePortfolio: {},
                allUserPortfolios: {}
            }
            return newState
        default:
            return state
    }
}

export default portfoliosReducer;
