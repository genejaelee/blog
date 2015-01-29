(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
console.log('init instagram component');

// Define main controller view
var InstagramApp = React.createClass({displayName: "InstagramApp",
  
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
      React.createElement("div", {className: "instagramApp"}, 
        React.createElement(InstagramPics, {
          urls: this.state.urls})
      )
    );
  }
    
});

var InstagramPics = React.createClass({displayName: "InstagramPics",
  getInitialState: function() {
    return ({
      'urls': this.props.urls 
    });
  },
  
  render: function() {
    var picNodes = this.state.urls.map(function (url) {
      return (
        React.createElement(InstagramPic, {
          key: url.id, 
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
      React.createElement("div", {
        className: "instagramPic", 
        onClick: this.handleClick}, 
        React.createElement("img", {src: this.state.url})
      )
    )
  }
});

React.render(
  React.createElement(InstagramApp, {params: params}),
  document.getElementById('imagesContainer')
);

module.exports = InstagramApp;

},{}]},{},[1])