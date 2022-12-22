const GET_ALL_COINS = "coins/GET_ALL_COINS";

//action creators
const loadAllCoins(allCoins) => ({
    type: GET_ALL_COINS,
    allCoins
})


//thunks
export const getAllCoins = () => async (dispatch) => {
    const response = await fetch('/api/coins/all')
    if(response.ok){
        const res = await response.json()
        dispatch(loadAllCoins(res))
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
            action.allCoins.forEach(coin => {
                newState.allCoins[coin.id] = coin
            })
            return newState
        default:
            return state

    }

}

export default coinsReducer;
