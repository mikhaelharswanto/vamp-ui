var React = require('react');
var classNames = require('classnames');

var Pagination = React.createClass({
 
  // Etc
  contextTypes: {
    router: React.PropTypes.func
  },

  // Component lifecycle
  componentDidMount: function(){

  },

  // Render
  render: function() {

    // Set dynamic classes
    var paginationClasses = classNames({
      'hidden': !this.props.pagination
    });

    return(
      <div className='pagination'> 
        <button onClick={this.props.navNext}>next</button>
      </div>
  )}
});
 
module.exports = Pagination;