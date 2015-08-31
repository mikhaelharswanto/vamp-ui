var React = require('react');
var classNames = require('classnames');

var Pagination = React.createClass({
 
  // Etc
  contextTypes: {
    router: React.PropTypes.func
  },

  // Component lifecycle
  componentDidMount: function(){
    console.log(this.context.router.getCurrentParams());
    console.log('hoi');
  },

  // Render
  render: function() {

    // Set dynamic classes
    var paginationClasses = classNames({
      'hidden': !this.props.pagination
    });

    return(
      <div className='pagination'> 
        <a href="http://localhost:3000/#/blueprints/2">next</a>
      </div>
  )}
});
 
module.exports = Pagination;