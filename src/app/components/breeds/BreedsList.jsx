var React = require('react/addons');
var TransitionGroup = React.addons.CSSTransitionGroup;
var PureRenderMixin = React.addons.PureRenderMixin;
var SetIntervalMixin = require("../../mixins/SetIntervalMixin.js");
var _ = require('underscore');
var classNames = require('classnames');
var ToolBar = require('../toolbar/ToolBar.jsx');
var LoadStates = require("../../constants/LoadStates.js");
var BreedListItem = require('./BreedListItem.jsx');
var BreedActions = require('../../actions/BreedActions');
var BreedStore = require('../../stores/BreedStore');

var BreedsList = React.createClass({
  
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [SetIntervalMixin],

  getInitialState: function() {
    return {
      filterText: '',
      viewType:'general-list',
      breedCreated: false,
      currentBreed: {},
      currentBreedcount: 0,
      requestingBreed: false,
      breedName: '',
      crudType: '',
      pending: false
    };
  },
  componentDidMount: function(){
    if(this.context.router.getCurrentParams().id)
      this.handleDetail(this.context.router.getCurrentParams().id);

    BreedActions.getAllBreeds();
    this.setInterval(this.pollBackend, 4000);
  },
  componentWillReceiveProps: function(nextProps){

    if(this.state.pending){
      var newBreed = BreedStore.getCurrentBreed(),
          nextBreedCount = _.size(nextProps.allBreeds); 

      if(this.state.crudType == 'update' && this.state.currentBreed !== newBreed){
        this.setState({ pending: false, breedCreated: true, currentBreed: {}, crudType:'' });
        BreedStore.clearCurrentBreed();
      } 

      if(this.state.crudType == 'create' && this.state.currentBreedcount < nextBreedCount){
        this.setState({ pending: false, breedCreated: true, currentBreed: {}, crudType:'' });
        BreedStore.clearCurrentBreed();
      }
    } else {
      this.setState({ breedCreated: false });  
    }

    if(this.state.requestingBreed){
      _currentBreed = BreedStore.getCurrentBreed();
      this.setState({ 
        currentBreed: _currentBreed,
        requestingBreed: _.isEmpty(_currentBreed) 
      });
    }
  },
  componentWillUnmount: function() {
    BreedActions.getAllBreeds();
  },  
  
  handleAdd: function(newBreed) {
    this.setState({ breedCreated: false, pending: true, crudType:'create', currentBreedcount: _.size(this.props.allBreeds) });
    BreedActions.createBreed(newBreed);
  },
  handleUpdate: function(breed) {
    this.setState({ breedCreated: false, pending: true, crudType:'update' });
    BreedActions.updateBreed(breed, this.state.breedName, 'application/x-yaml');
  },
  handleUserInput: function(filterText) {
    this.setState({
      filterText: filterText,
    });
  },
  handleViewSwitch: function(viewType) {
    this.setState({
      viewType: viewType,
    });
  },
  handleDetail: function(breedName){
    BreedStore.clearCurrentBreed();
    BreedActions.getBreed(breedName, 'application/x-yaml');
    this.setState({ requestingBreed: true, breedName: breedName});
  },
  clearCurrentBreed: function(){
    this.setState({ currentBreed: {}, breedName: '' });
  },

  render: function() {

    // Set vars
    var allBreeds = this.props.allBreeds,
        breeds = [],
        errorsToBeShown = this.props.errors['UNREACHABLE'] ? true : false,
        errorMessage = errorsToBeShown ? this.props.errors['UNREACHABLE'].message : '';
    
    // Prepare Breedslist
    var sortedKeys = _.sortBy(_.keys(allBreeds));
    _.each(sortedKeys, function(key) {
      var breed = allBreeds[key];
      var filterTerm = this.state.filterText.toLowerCase() || false;
      if ( ( breed.name.toLowerCase().indexOf(filterTerm) === -1 && breed.deployable.toLowerCase().indexOf(filterTerm) === -1 && filterTerm) ) {
        return;
      }
      breeds.push(<BreedListItem key={key} breed={breed} handleDetail={this.handleDetail} />);
    }, this);

    // Prepare dynamic classes
    var loadingClassSet = classNames({
      "hidden": this.props.loadState !== LoadStates.STATE_LOADING
    });
    var emptyClassSet = classNames({
      "empty-list": true,
      "container-status-message": true,
      "hidden": breeds.length > 0 || errorsToBeShown
    });
    var errorMessageClassSet = classNames({
      "error-status-message": true,
      "container-status-message": true,
      "hidden": !errorsToBeShown
    });
    var listHeaderClasses = classNames({
      "list-header": true,
      "hidden": breeds.length <= 0
    });
    var listClasses = classNames( this.state.viewType, {
      'dimmed': this.props.errors['UNREACHABLE']
    });

    return(
      <div className='list-container'>
        <ToolBar 
          onUserInput={this.handleUserInput}
          handleViewSwitch={this.handleViewSwitch}
          handleAdd={this.handleAdd}
          handleUpdate={this.handleUpdate}          
          addArtefactType='breed'
          requestResolved={this.state.breedCreated} 
          loadState={this.props.loadState}
          detailArtefact={this.state.currentBreed} 
          clearDetailArtefact={this.clearCurrentBreed} />
        <span className={emptyClassSet}>No breeds found.</span>
        <span className={errorMessageClassSet}>{errorMessage}</span>        
        <TransitionGroup 
          id='breeds-list'         
          component="ul" 
          transitionName="fadeIn" 
          transitionAppear={true}
          transitionLeave={true}
          className={listClasses}>
          <li className={listHeaderClasses}>
            <div className="list-section section-half">
              <h4>Breed</h4>
            </div>
            <div className="list-section section-sixth">
              <h4>Ports</h4>
            </div>
            <div className="list-section section-sixth">
              <h4>Dependencies</h4>
            </div>
            <div className="list-section section-sixth">
              <h4>Constants</h4>
            </div>
          </li>
          {breeds}
        </TransitionGroup>
      </div>
  )},
  
  pollBackend: function() {
    BreedActions.getAllBreeds();
  }
});
 
module.exports = BreedsList;