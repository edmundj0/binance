const GET_ALL_WATCHLISTS = "watchlists/GET_ALL_WATCHLISTS";
const GET_ONE_WATCHLIST = "watchlists/GET_ONE_WATCHLIST";
const CREATE_NEW_WATCHLIST = "watchlists/CREATE_NEW_WATCHLIST"
const EDIT_ONE_WATCHLIST = "watchlists/EDIT_ONE_WATCHLIST"
const DELETE_ONE_WATCHLIST = "watchlists/DELETE_ONE_WATCHLIST"
const CLEAR_WATCHLISTS = "watchlists/CLEAR_WATCHLISTS"

//action creators
const loadAllWatchlists = (allWatchlists) => ({
    type: GET_ALL_WATCHLISTS,
    allWatchlists
})

const loadOneWatchlist = (oneWatchlist) => ({
    type: GET_ONE_WATCHLIST,
    oneWatchlist
})

const postWatchlist = (newWatchlist) => ({
    type: CREATE_NEW_WATCHLIST,
    newWatchlist
})

const editWatchlist = (edited) => ({
    type: EDIT_ONE_WATCHLIST,
    edited
})

const delWatchlist = (watchlistId) => ({
    type: DELETE_ONE_WATCHLIST,
    watchlistId
})


export const clearWatchlists = () => ({
    type: CLEAR_WATCHLISTS
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

export const createNewWatchlist = (info) => async (dispatch) => {
    const response = await fetch('/api/watchlists', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(info)
    })

    if(response.ok) {
        const newWatchlist = await response.json()
        dispatch(postWatchlist(newWatchlist))
        return newWatchlist
    }
    else {
        const data = await response.json()
        if(data.errors){
            return data
        }
    }
}

export const editOneWatchlist = (info, watchlistId) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/${watchlistId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(info)
    })
    if(response.ok) {
        const edited = await response.json()
        dispatch(editWatchlist(edited))
        return edited
    }else {
        const data = await response.json()
        if(data.errors){
            return data
        }
    }
}

export const deleteWatchlist = (watchlistId) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/${watchlistId}`, {
        method: 'DELETE'
    })
    if(response.ok){
        dispatch(delWatchlist(watchlistId))
        return response
    }else {
        const data = await response.json()
        if(data.errors){
            return data
        }
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
        case CREATE_NEW_WATCHLIST:
            newState = {
                ...state,
                oneWatchlist: {...state.oneWatchlist},
                allUserWatchlists: {...state.allUserWatchlists}
            }
            newState.oneWatchlist = action.newWatchlist
            newState.allUserWatchlists[action.newWatchlist.id] = action.newWatchlist
            return newState
        case EDIT_ONE_WATCHLIST:
            newState = {
                ...state,
                oneWatchlist: {...state.oneWatchlist},
                allUserWatchlists: {...state.allUserWatchlists}
            }
            newState.oneWatchlist = action.edited
            newState.allUserWatchlists[action.edited.id] = action.edited
            return newState
        case DELETE_ONE_WATCHLIST:
            newState = {
                ...state,
                oneWatchlist: {...state.oneWatchlist},
                allUserWatchlists: {...state.allUserWatchlists}
            }
            newState.oneWatchlist = {}
            delete newState.allUserWatchlists[action.watchlistId]
            return newState
        case CLEAR_WATCHLISTS:
            newState = {
                ...state,
                oneWatchlist: {},
                allUserWatchlists: {}
            }
            return newState
        default:
            return state
    }
}

export default watchlistsReducer;
