import React from 'react';
import PropTypes from 'prop-types';

class Comment extends React.Component {
  formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  render() {
    const { formatDateTime } = this;
    const { content, createdAt, user } = this.props;

    return (
      <div className="card mb-2">
        <div className="card-body">
          <h5 className="card-title">{user}</h5>
          <p className="card-text">{content}</p>
          <p className="card-text float-right">
            <small className="text-muted">{formatDateTime(createdAt)}</small>
          </p>
        </div>
      </div>
    );
  }
}

Comment.propTypes = {
  content: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired
};

export default Comment;
