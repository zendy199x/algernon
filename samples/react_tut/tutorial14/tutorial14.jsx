// tutorial14.jsx

function CommentBox(props) {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    function loadCommentsFromServer() {
      fetch(props.url)
        .then(response => response.json())
        .then(data => setData(data))
        .catch(err => console.error(props.url, err.toString()));
    }
    loadCommentsFromServer();
    const interval = setInterval(loadCommentsFromServer, props.pollInterval);
    return () => clearInterval(interval);
  }, [props.url, props.pollInterval]);

  return (
    <div className="commentBox">
      <h1>Comments</h1>
      <CommentList data={data} />
      <CommentForm />
    </div>
  );
}

function CommentList(props) {
  const commentNodes = props.data.map((comment, index) => (
    <Comment key={index} author={comment.author}>
      {comment.text}
    </Comment>
  ));
  return (
    <div className="commentList">
      {commentNodes}
    </div>
  );
}

function Comment(props) {
  const rawMarkup = marked.parse(props.children.toString());
  return (
    <div className="comment">
      <h2 className="commentAuthor">
        {props.author}
      </h2>
      <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
    </div>
  );
}

function CommentForm() {
  return (
    <div className="commentForm">
      Hello, world! I am a CommentForm.
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('content')).render(
  <CommentBox url="comments.json" pollInterval={2000} />
);
