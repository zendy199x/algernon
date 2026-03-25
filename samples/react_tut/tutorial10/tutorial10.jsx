// tutorial10.jsx

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

function CommentBox(props) {
  return (
    <div className="commentBox">
      <h1>Comments</h1>
      <CommentList data={props.data} />
      <CommentForm />
    </div>
  );
}

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

function CommentForm() {
  return (
    <div className="commentForm">
      Hello, world! I am a CommentForm.
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('content')).render(
  <CommentBox data={data} />
);
