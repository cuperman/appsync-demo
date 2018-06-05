import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { find, orderBy } from 'lodash';

import { fetchEvent, subscribeToEventComments, commentOnEvent } from '../actions';

class Item extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: ''
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
  }

  componentWillMount() {
    this.props.fetchEvent();
    this.props.subscribeToComments();
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

  formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  render() {
    const { handleFieldChange, handleAddComment, formatDateTime } = this;
    const { event } = this.props;
    const { comment } = this.state;
    const { id, name, where, when, description, comments } = event;

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
              <textarea name="comment" className="form-control" onChange={handleFieldChange} value={comment}></textarea>
            </div>
            <div className="form-group clearfix">
              <button className="btn btn-primary float-right">Add comment</button>
            </div>
            <div className="form-group">
              {comments && orderBy(comments, ['createdAt'], ['desc']).map(comment => {
                const { commentId, content, createdAt } = comment;

                return (
                  <div key={commentId} className="card mb-2">
                    <div className="card-body">
                      <p className="card-text">{content}</p>
                      <p className="card-text float-right">
                      <small className="text-muted">{formatDateTime(createdAt)}</small>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </form>
        </main>
      </div>
    );
  }
}

Item.propTypes = {
  match: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
  fetchEvent: PropTypes.func.isRequired,
  subscribeToComments: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired
};

Item.defaultProps = {
  event: {}
};

function mapStateToProps(state, nextProps) {
  const { match } = nextProps;
  const id = match.params.id;

  return {
    event: find(state.events, { id })
  };
}

function mapDispatchToProps(dispatch, nextProps) {
  const { match } = nextProps;
  const eventId = match.params.id;

  return {
    fetchEvent: () => dispatch(fetchEvent(eventId)),
    subscribeToComments: () => dispatch(subscribeToEventComments(eventId)),
    addComment: (content) => dispatch(commentOnEvent(eventId, content))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Item);
