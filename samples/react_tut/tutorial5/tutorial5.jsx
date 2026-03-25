// tutorial5.jsx

function CommentList() {
  return (
    <div className="commentList">
      <Comment author="Pete Hunt">This is one comment</Comment>
      <Comment author="Jordan Walke">This is *another* comment</Comment>
    </div>
  );
}

function Comment(props) {
  return (
    <div className="comment">
      <h2 className="commentAuthor">
        {props.author}
      </h2>
      {props.children}
    </div>
  );
}

function CommentBox() {
  return (
    <div className="commentBox">
      <h1>Comments</h1>
      <CommentList />
      <CommentForm />
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
  <CommentBox />
);
