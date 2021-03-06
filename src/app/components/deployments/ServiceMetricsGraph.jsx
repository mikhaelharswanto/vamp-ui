var React = require('react');
var LineChart = require('react-chartjs').Line;
var DeploymentActions = require('../../actions/DeploymentActions');

var ServiceMetricsGraph = React.createClass({

  timer: {},

  getInitialState: function(){
    return {
      requestPerSec: '-',
      responseTime: '-',
    }
  },
  componentWillReceiveProps: function(nextProps){
    this.stopTimer();
    this.setState({
      requestPerSec: nextProps.requestPerSec,
      responseTime: nextProps.responseTime,     
    });
    this.setTimer();
  },

  // Helper methods
  setTimer: function() {
    var self = this;
    this.timer = setTimeout(function(){
      self.setState({
        requestPerSec: '-',
        responseTime: '-',
      });
    }, 10000);
  },
  stopTimer: function(){
    clearTimeout(this.timer);
  },

  render: function() {

    return(
      <div className='service-metrics-container'>
        <h4>Reqs / sec</h4>
        <h3>{this.state.requestPerSec}</h3>
        <h4>Resp. time</h4>
        <h3>{this.state.responseTime} <small className='muted normal-weight'>ms</small></h3>
      </div>
    )}
  }
);
 
module.exports = ServiceMetricsGraph;