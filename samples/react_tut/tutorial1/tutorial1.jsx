// tutorial1.jsx

function CommentBox() {
  return (
    <div className="commentBox">
      Hello, world! I am a CommentBox.
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('content')).render(
  <CommentBox />
);
