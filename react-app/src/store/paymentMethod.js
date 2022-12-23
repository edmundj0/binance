const CREATE_NEW_PAYMENT_METHOD = "/payment-methods/CREATE_NEW"

//action creators
const postPaymentMethod = (newPaymentMethod) => ({
    type: CREATE_NEW_PAYMENT_METHOD,
    newPaymentMethod
})

//thunks
export const createNewPaymentMethod = (info) => async (dispatch) => {
    const response = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(info)
    })

    if(response.ok) {
        const newPaymentMethod = await response.json()
        dispatch(postPaymentMethod(newPaymentMethod))
        return newPaymentMethod
    }
    else {
        const data = await response.json()
        if(data.errors){
            return data
        }
    }
}

//reducer
const initialState = {onePaymentMethod: {}, allPaymentMethods: {}}

const paymentMethodsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case CREATE_NEW_PAYMENT_METHOD:
            newState = {
                ...state,
                onePaymentMethod: {...state.onePaymentMethod},
                allPaymentMethods: {...state.allPaymentMethods}
            }
            newState.onePaymentMethod = action.newPaymentMethod
            return newState
        default:
            return state
    }
}

export default paymentMethodsReducer;
