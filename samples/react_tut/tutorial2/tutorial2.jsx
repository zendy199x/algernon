// tutorial2.jsx

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

ReactDOM.createRoot(document.getElementById('content1')).render(
  <CommentList />
);
ReactDOM.createRoot(document.getElementById('content2')).render(
  <CommentForm />
);
