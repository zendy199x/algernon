// tutorial3.jsx

function CommentBox() {
  return (
    <div className="commentBox">
      <h1>Comments</h1>
      <CommentList />
      <CommentForm />
    </div>
  );
}

function CommentList() {
  return (
    <div className="commentList">
      Hello, world! I am a CommentList.
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
