/** @jsx React.DOM */

var converter = new Showdown.converter();
var ref = new Firebase('https://[replace-with-your-Frebase]/comments');

var Comment = React.createClass({
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="comment">
        <h2 className="commentAuthor">{this.props.author}</h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

var CommentBox = React.createClass({
  handleCommentSubmit: function(comment) {
    ref.push(comment);
  },
  getInitialState: function() {
    return {data: {}};
  },
  componentWillMount: function() {
    ref.on('child_added', function (newSnap, oldSnap) {
        if(newSnap.val()) {
            this.setState({
                data: newSnap.val()
            });
        }
      }, this);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  render: function() {
    var comment = this.props.data;
    var index = this.state.data.length;
    if(comment.author && comment.text) {
        this.state.data.push(<Comment key={index} author={comment.author}>{comment.text}</Comment>);
    }
    return <div className="commentList">{this.state.data}</div>;
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
    return false;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

React.renderComponent(
  <CommentBox />,
  document.getElementById('container')
);
