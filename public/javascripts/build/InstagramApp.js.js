console.log('init instagram component');

var React = require('react');

// Method to retrieve state from Stores
function getImagesState() {
  return {
    images: this.props.images
  };
}

// Define main controller view
var InstagramApp = React.createClass({displayName: "InstagramApp",
  
  // Get initial state from stores
  getInitialState: function() {
    return getImagesState();
  },
  
  // Add change listeners to stores
  componentDidMount: function() {
    ProductStore.addChangeListener(this._onChange);
    CartStore.addChangeListener(this._onChange);
  },
  
  // Remove change listeners from stores
  componentWillUnmount: function() {
    ProductStore.removeChangeListener(this._onChange);
    CartStore.removeChangeListener(this._onChange)
  },
  
  render: function() {
    return(
      React.createElement("div", {className: "instagramApp"}, 
        React.createElement(InstagramPics, {
          urls: this.state.urls})
      )
    );
  },
  
  // Method to setState based upon Store changes
  _onChange: function() {
    this.setState(getImagesState());
  }
  
});

var InstagramPics = React.createClass({displayName: "InstagramPics",
  render: function() {
    var picNodes = this.props.urls.map(function (url) {
      return (
        React.createElement(InstagramPic, {
          url: url})
      );
    });
    return (
      React.createElement("div", {className: "instagramPics"}, 
        picNodes
      )
    );
  }
});

var InstagramPic = React.createClass({displayName: "InstagramPic",
  render: function() {
    return (
      React.createElement("div", {className: "instagramPic"}, 
        React.createElement("img", {src: this.props.url})
      )
    )
  }
});
React.render(
  React.createElement(InstagramApp, {images: "#{images}"}),
  document.getElementById('imagesContainer')
);

module.exports = InstagramApp;