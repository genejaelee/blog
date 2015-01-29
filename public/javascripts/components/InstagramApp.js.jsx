console.log('init instagram component');

// Define main controller view
var InstagramApp = React.createClass({
  
  // Get initial state from stores
  getInitialState: function() {
    return({
      'urls': this.props.params
    });
  },
  
  // Add change listeners to stores
  componentDidMount: function() {
  },
  
  // Remove change listeners from stores
  componentWillUnmount: function() {
  },
  
  render: function() {
    return(
      <div className="instagramApp">
        <InstagramPics
          urls={this.state.urls} />
      </div>
    );
  }
    
});

var InstagramPics = React.createClass({
  getInitialState: function() {
    return ({
      'urls': this.props.urls 
    });
  },
  
  render: function() {
    var picNodes = this.state.urls.map(function (url) {
      return (
        <InstagramPic
          key={url.id}
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
  getInitialState: function(){
    return ({
      'url': this.props.url
    });
  },
  
  handleClick: function() {
    this.setState({ 'url': null })
  },
  
  render: function() {
    return (
      <div 
        className="instagramPic"
        onClick={this.handleClick}>
        <img src={this.state.url}/>
      </div>
    )
  }
});

React.render(
  <InstagramApp params={params} />,
  document.getElementById('imagesContainer')
);

module.exports = InstagramApp;