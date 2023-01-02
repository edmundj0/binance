const CREATE_NEW_TRANSACTION = "/transactions/new"


//action creators
const postTransaction = (newTransaction) => ({
    type: CREATE_NEW_TRANSACTION,
    newTransaction
})



//thunks

export const createNewTransaction = (info) => async (dispatch) => {
    const response = await fetch('/api/transactions/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
    })

    if (response.ok) {
        const newTransaction = await response.json()
        dispatch(postTransaction(newTransaction))
        return newTransaction
    }
    else {
        const data = await response.json()
        if (data.errors) {
            return data
        }
    }
}


//reducer
const initialState = { oneTransaction: {}, allUserTransactions: {} }

const transactionsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case CREATE_NEW_TRANSACTION:
            newState = {
                ...state,
                oneTransaction: { ...state.oneTransaction },
                allUserTransactions: { ...state.allUserTransactions }
            }
            newState.oneTransaction = action.newTransaction
            return newState
        default:
            return state
    }
}

export default transactionsReducer;
