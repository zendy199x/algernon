// tutorial17.jsx

function CommentBox(props) {
  const [data, setData] = React.useState([]);

  function handleCommentSubmit(comment) {
    // TODO: submit to the server and refresh the list
  }

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
      <CommentForm onCommentSubmit={handleCommentSubmit} />
    </div>
  );
}

function CommentForm(props) {
  const authorRef = React.useRef(null);
  const textRef = React.useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const author = authorRef.current.value.trim();
    const text = textRef.current.value.trim();
    if (!text || !author) {
      return;
    }
    // TODO: send request to the server
    authorRef.current.value = '';
    textRef.current.value = '';
  }

  return (
    <form className="commentForm" onSubmit={handleSubmit}>
      <input type="text" placeholder="Your name" ref={authorRef} />
      <input type="text" placeholder="Say something..." ref={textRef} />
      <input type="submit" value="Post" />
    </form>
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

ReactDOM.createRoot(document.getElementById('content')).render(
  <CommentBox url="comments.json" pollInterval={2000} />
);
