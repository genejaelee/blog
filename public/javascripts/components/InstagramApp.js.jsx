console.log('init instagram component');

var React = require('react');

// Method to retrieve state from Stores
function getImagesState() {
  return {
    images: this.props.images
  };
}

// Define main controller view
var InstagramApp = React.createClass({
  
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
      <div className="instagramApp">
        <InstagramPics 
          urls={this.state.urls} />
      </div>
    );
  },
  
  // Method to setState based upon Store changes
  _onChange: function() {
    this.setState(getImagesState());
  }
  
});

var InstagramPics = React.createClass({
  render: function() {
    var picNodes = this.props.urls.map(function (url) {
      return (
        <InstagramPic
          url={url} />
      );
    });
    return (
      <div className="instagramPics">
        {picNodes}
      </div>
    );
  }
});

var InstagramPic = React.createClass({
  render: function() {
    return (
      <div className="instagramPic">
        <img src={this.props.url}/>
      </div>
    )
  }
});
React.render(
  <InstagramApp images="#{images}" />,
  document.getElementById('imagesContainer')
);

module.exports = InstagramApp;