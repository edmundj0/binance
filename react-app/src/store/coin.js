const GET_ALL_COINS = "coins/GET_ALL_COINS";
const GET_ONE_COIN = "coins/GET_ONE_COIN";

//action creators
const loadAllCoins = (allCoins) => ({
    type: GET_ALL_COINS,
    allCoins
})

const loadOneCoin = (oneCoin) => ({
    type: GET_ONE_COIN,
    oneCoin
})


//thunks
export const getAllCoins = () => async (dispatch) => {
    const response = await fetch('/api/coins/all')
    if(response.ok){
        const res = await response.json()
        dispatch(loadAllCoins(res))
    }
}

export const getOneCoin = (coinId) => async (dispatch) => {
    const response = await fetch(`/api/coins/${coinId}`)
    if(response.ok){
        const res = await response.json()
        dispatch(loadOneCoin(res))
    }
}


//reducer
const initialState = {oneCoin: {}, allCoins: {}}

const coinsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_ALL_COINS:
            newState = {
                ...state,
                oneCoin: {...state.oneCoin},
                allCoins: {...state.allCoins}
            }
            action.allCoins["Coins"].forEach(coin => {
                newState.allCoins[coin.id] = coin
            })
            return newState
        case GET_ONE_COIN:
            newState = {
                ...state,
                oneCoin: {...state.oneCoin},
                allCoins: {...state.allCoins}
            }
            newState.oneCoin = action.oneCoin
            return newState
        default:
            return state
    }

}

export default coinsReducer;
