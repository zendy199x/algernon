// tutorial11.jsx

const data = [
  {author: "Pete Hunt", text: "This is one comment"},
  {author: "Jordan Walke", text: "This is *another* comment"}
];

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

function CommentBox(props) {
  return (
    <div className="commentBox">
      Hello, world! I am a CommentBox.
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('content')).render(
  <CommentBox url="comments.json" />
);
