import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { find } from 'lodash';

import { fetchEventComments, subscribeToEventComments, unsubscribeFromEventComments, commentOnEvent } from '../actions';
import Comment from './comment';

class Item extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: ''
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
    this.handleMoreComments = this.handleMoreComments.bind(this);
  }

  componentDidMount() {
    this.props.fetchEventComments();
    this.props.subscribeToComments();
  }

  componentWillUnmount() {
    this.props.unsubscribeFromComments();
  }

  handleFieldChange(event) {
    const target = event.target;
    const { name, value } = target;
    this.setState({
      [name]: value
    });
  }

  handleAddComment(event) {
    event.preventDefault();

    const { addComment } = this.props;
    const { comment } = this.state;

    addComment(comment);
    this.setState({
      comment: ''
    });
  }

  handleEnterKey(event) {
    const ENTER_KEYCODE = 13;
    if (event.which === ENTER_KEYCODE) {
      this.handleAddComment.call(this, event);
    }
  }

  handleMoreComments(event) {
    event.preventDefault();
    this.props.fetchEventComments(this.props.nextToken);
  }

  render() {
    const { handleFieldChange, handleAddComment, handleMoreComments, handleEnterKey } = this;
    const { event, comments, nextToken } = this.props;
    const { comment } = this.state;
    const { name, where, when, description, owner } = event;

    return (
      <div className="container">
        <header>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mt-4">
              <li className="breadcrumb-item"><Link to="/">Events</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{name}</li>
            </ol>
          </nav>
          <div className="pb-2 mt-4 mb-2">
            <h1>{name}</h1>
            <small>created by {owner}</small>
          </div>
        </header>
        <main>
          <dl className="row">
            <dt className="col-sm-2">Where</dt>
            <dd className="col-sm-10">{where}</dd>
            <dt className="col-sm-2">When</dt>
            <dd className="col-sm-10">{when}</dd>
          </dl>
          <p className="lead">{description}</p>
          <form onSubmit={handleAddComment}>
            <div className="form-group">
              <label>Comments</label>
              <textarea name="comment" className="form-control" onChange={handleFieldChange} onKeyPress={handleEnterKey} value={comment}></textarea>
            </div>
            <div className="form-group clearfix">
              <button className="btn btn-primary float-right">Add comment</button>
            </div>
          </form>
          <div>
            {comments && comments.map(comment => <Comment key={comment.commentId} {...comment} />)}
          </div>
          <div className="d-flex justify-content-center mb-2">
            {nextToken && <button className="btn btn-link" onClick={handleMoreComments}>More</button>}
          </div>
        </main>
      </div>
    );
  }
}

Item.propTypes = {
  match: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
  fetchEventComments: PropTypes.func.isRequired,
  subscribeToComments: PropTypes.func.isRequired,
  unsubscribeFromComments: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  nextToken: PropTypes.string,
  currentUser: PropTypes.object
};

Item.defaultProps = {
  event: {},
  comments: []
};

function mapStateToProps(state, nextProps) {
  const { match } = nextProps;
  const id = match.params.id;
  const events = state.events && state.events.items || [];
  const event = find(events, { id });
  const comments = state.comments[id] && state.comments[id].items || [];
  const nextToken = state.comments[id] && state.comments[id].nextToken;

  return {
    event,
    comments,
    nextToken
  };
}

function mapDispatchToProps(dispatch, nextProps) {
  const { match, currentUser } = nextProps;
  const eventId = match.params.id;
  const username = currentUser && currentUser.username;

  return {
    fetchEventComments: (nextToken) => dispatch(fetchEventComments(eventId, nextToken)),
    subscribeToComments: () => dispatch(subscribeToEventComments(eventId)),
    unsubscribeFromComments: () => unsubscribeFromEventComments(eventId),
    addComment: (content) => dispatch(commentOnEvent(eventId, content, username))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Item);
