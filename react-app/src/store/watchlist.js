const GET_ALL_WATCHLISTS = "watchlists/GET_ALL_WATCHLISTS";
const GET_ONE_WATCHLIST = "watchlists/GET_ONE_WATCHLIST";

//action creators
const loadAllWatchlists = (allWatchlists) => ({
    type: GET_ALL_WATCHLISTS,
    allWatchlists
})

const loadOneWatchlist = (oneWatchlist) => ({
    type: GET_ONE_WATCHLIST,
    oneWatchlist
})


//thunks
export const getAllWatchlists = () => async (dispatch) => {
    const response = await fetch('/api/watchlists/current')
    if(response.ok){
        const res = await response.json()
        dispatch(loadAllWatchlists(res))
    }
}


export const getOneWatchlist = (watchlistId) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/${watchlistId}`)
    if(response.ok) {
        const res = await response.json()
        dispatch(loadOneWatchlist(res))
    }
}

//reducer
const initialState = {oneWatchlist: {}, allUserWatchlists: {}}

const watchlistsReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case GET_ALL_WATCHLISTS:
            newState = {
                ...state,
                oneWatchlist: {...state.oneWatchlist},
                allUserWatchlists: {...state.allUserWatchlists}
            }
            action.allWatchlists["Watchlists"].forEach(watchlist => {
                newState.allUserWatchlists[watchlist.id] = watchlist
            })
            return newState
        case GET_ONE_WATCHLIST:
            newState = {
                ...state,
                oneWatchlist: {...state.oneWatchlist},
                allUserWatchlists: {...state.allUserWatchlists}
            }
            newState.oneWatchlist = action.oneWatchlist
            return newState
        default:
            return state
    }
}

export default watchlistsReducer;
