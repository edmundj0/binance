const GET_ALL_PAYMENT_METHODS = "/payment-methods/GET_ALL_PAYMENT_METHODS"
const GET_ONE_PAYMENT_METHOD = "/payment-methods/GET_ONE_PAYMENT_METHOD"
const CREATE_NEW_PAYMENT_METHOD = "/payment-methods/CREATE_NEW"
const EDIT_PAYMENT_METHOD = "/payment-methods/EDIT_ONE"
const DELETE_PAYMENT_METHOD = "/payment-methods/DELETE_ONE"

//action creators
const loadAllPaymentMethods = (allPaymentMethods) => ({
    type: GET_ALL_PAYMENT_METHODS,
    allPaymentMethods
})

const loadOnePaymentMethod = (onePaymentMethod) => ({
    type: GET_ONE_PAYMENT_METHOD,
    onePaymentMethod
})

const postPaymentMethod = (newPaymentMethod) => ({
    type: CREATE_NEW_PAYMENT_METHOD,
    newPaymentMethod
})

const editPaymentMethod = (edited) => ({
    type: EDIT_PAYMENT_METHOD,
    edited
})

const delPaymentMethod = (methodId) => ({
    type: DELETE_PAYMENT_METHOD,
    methodId
})

//thunks
export const getAllPaymentMethods = () => async (dispatch) => {
    const response = await fetch('/api/payment-methods/current')
    if (response.ok) {
        const res = await response.json()
        dispatch(loadAllPaymentMethods(res))
    }
}

export const getOnePaymentMethod = (methodId) => async (dispatch) => {
    const response = await fetch(`/api/payment-methods/${methodId}`)
    if (response.ok) {
        const res = await response.json()
        dispatch(loadOnePaymentMethod(res))
    }
}

export const createNewPaymentMethod = (info) => async (dispatch) => {
    const response = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
    })

    if (response.ok) {
        const newPaymentMethod = await response.json()
        dispatch(postPaymentMethod(newPaymentMethod))
        return newPaymentMethod
    }
    else {
        const data = await response.json()
        if (data.errors) {
            return data
        }
    }
}

export const editOnePaymentMethod = (info, methodId) => async (dispatch) => {
    const response = await fetch(`/api/payment-methods/${methodId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
    })
    if (response.ok) {
        const edited = await response.json()
        dispatch(editPaymentMethod(edited))
        return edited
    }
    else {
        const data = await response.json()
        if (data.errors) {
            return data
        }
        else {
            return data
        }
    }
}

export const deletePaymentMethod = (methodId) => async (dispatch) => {
    const response = await fetch(`/api/payment-methods/${methodId}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        dispatch(delPaymentMethod(methodId))
    }
}

//reducer
const initialState = { onePaymentMethod: {}, allPaymentMethods: {} }

const paymentMethodsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case CREATE_NEW_PAYMENT_METHOD:
            newState = {
                ...state,
                onePaymentMethod: { ...state.onePaymentMethod },
                allPaymentMethods: { ...state.allPaymentMethods }
            }
            newState.onePaymentMethod = action.newPaymentMethod
            return newState
        case GET_ALL_PAYMENT_METHODS:
            newState = {
                ...state,
                onePaymentMethod: { ...state.onePaymentMethod },
                allPaymentMethods: { ...state.allPaymentMethods }
            }
            action.allPaymentMethods["Payment Methods"].forEach(method => {
                newState.allPaymentMethods[method.id] = method
            })
            return newState
        case GET_ONE_PAYMENT_METHOD:
            newState = {
                ...state,
                onePaymentMethod: { ...state.onePaymentMethod },
                allPaymentMethods: { ...state.allPaymentMethods }
            }
            newState.onePaymentMethod = action.onePaymentMethod
            return newState
        case EDIT_PAYMENT_METHOD:
            newState = {
                ...state,
                onePaymentMethod: { ...state.onePaymentMethod },
                allPaymentMethods: { ...state.allPaymentMethods }
            }
            newState.onePaymentMethod = action.edited
            return newState
        case DELETE_PAYMENT_METHOD:
            newState = {
                ...state,
                onePaymentMethod: { ...state.onePaymentMethod },
                allPaymentMethods: { ...state.allPaymentMethods }
            }
            newState.onePaymentMethod = {}
            delete newState.allPaymentMethods[action.methodId]
            return newState
        default:
            return state
    }
}

export default paymentMethodsReducer;
