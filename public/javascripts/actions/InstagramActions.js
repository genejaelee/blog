var AppDispatcher = require('../dispatcher/AppDispatcher');
var InstagramConstants = require('../constants/InstagramConstants');

// Define actions object
var InstagramActions = {
  // Receive initial product data
  getMedia: function(data) {
    AppDispatcher.handleAction({
      actionType: InstagramConstants.GET_MEDIA,
      data: data
    });
  },
  
  // Set currently selected product variation
  selectProduct: function(index) {
    AppDispatcher.handleAction({
      actionType: FluxCartConstants.SELECT_PRODUCT,
      data: index
    });
  },
  
  // Add item to cart
  addToCart: function(sku, update) {
    AppDispatcher.handleAction({
      actionType: FluxCartConstants.CART_ADD,
      sku: sku,
      update: update
    });
  },
  
  // Remove item from cart
  removeFromCart: function(sku) {
    AppDispatcher.handleAction({
      actionType: FluxCartConstants.CART_REMOVE,
      sku: sku
    });
  },
  
  updateCartVisible: function(cartVisible) {
    AppDispatcher.handleAction({
      actionType: FluxCartConstants.CART_VISIBLE,
      cartVisible: cartVisible
    });
  }
  
  // END
}

module.exports = FluxCartActions;