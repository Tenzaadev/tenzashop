export const initialCartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0
}

export const generateCartId = (id, size, color) => {
  return `${id}-${size}-${color}`
}

export const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const newId = generateCartId(action.payload.id, action.payload.size, action.payload.color)
      const existingIndex = state.items.findIndex(item => generateCartId(item.id, item.size, item.color) === newId)
      let newItems
      if (existingIndex >= 0) {
        newItems = [...state.items]
        newItems[existingIndex] = { ...newItems[existingIndex], quantity: newItems[existingIndex].quantity + 1 }
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }]
      }
      return {
        ...state,
        items: newItems,
        totalQuantity: newItems.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
      }
    }
    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => generateCartId(item.id, item.size, item.color) !== action.payload)
      return {
        ...state,
        items: newItems,
        totalQuantity: newItems.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
      }
    }
    case 'INCREMENT_QUANTITY': {
      const newItems = state.items.map(item => {
        if (generateCartId(item.id, item.size, item.color) === action.payload) {
          return { ...item, quantity: item.quantity + 1 }
        }
        return item
      })
      return {
        ...state,
        items: newItems,
        totalQuantity: newItems.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
      }
    }
    case 'DECREMENT_QUANTITY': {
      const newItems = state.items.map(item => {
        if (generateCartId(item.id, item.size, item.color) === action.payload) {
          return { ...item, quantity: Math.max(1, item.quantity - 1) }
        }
        return item
      })
      return {
        ...state,
        items: newItems,
        totalQuantity: newItems.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
      }
    }
    case 'CLEAR_CART': {
      return { ...state, items: [], totalQuantity: 0, totalPrice: 0 }
    }
    case 'HYDRATE_CART': {
      return action.payload || state
    }
    default:
      return state
  }
}