const App = () => {
  return (
    <div>
      <button
        onClick={async () => {
          const res = await fetch('/api/auth/login/google', {
            method: 'POST',
          });
          const data = await res.json();
          if (data?.url) {
            window.location.href = data.url;
          }
        }}
      >
        signin with google
      </button>
      <button
        onClick={async () => {
          const res = await fetch('/api/auth/login/github', {
            method: 'POST',
          });
          const data = await res.json();
          if (data?.url) {
            window.location.href = data.url;
          }
        }}
      >
        signin with github
      </button>
      <button
        onClick={async () => {
          const res = await fetch('/api/auth/logout', {
            method: 'POST',
          });
          const data = await res.json();
          console.log(data);
        }}
      >
        logout
      </button>
      <button
        onClick={async () => {
          const res = await fetch('/api/auth/user', {
            method: 'GET',
          });
          const data = await res.json();
          console.log(data);
        }}
      >
        get session
      </button>

      <button
        onClick={async () => {
          const res = await fetch('/comment/create', {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              commentText: 'test text ReportBody',
            }),
          });
          const data = await res.json();
          console.log(data);
        }}
      >
        Create comment
      </button>
      <button
        onClick={async () => {
          const res = await fetch('/comment/comments/randomId2');
          const data = await res.json();
          console.log(data);
        }}
      >
        get comment
      </button>
      <button
        onClick={async () => {
          const res = await fetch('/comment/update', {
            method: 'POST',
            body: JSON.stringify({
              commentId: '664a1a9f2ef4791acc9d6a31',
              commentText: 'updated bara',
            }),
          });
          const data = await res.json();
          console.log(data);
        }}
      >
        update comment
      </button>
      <button
        onClick={async () => {
          const res = await fetch('/comment/delete', {
            method: 'DELETE',
            body: JSON.stringify({
              commentId: '664a1a9f2ef4791acc9d6a31',
            }),
          });
          const data = await res.json();
          console.log(data);
        }}
      >
        delete comment
      </button>
      {/* vote */}
      <button
        onClick={async () => {
          const res = await fetch('/vote/upvote', {
            method: 'POST',
            body: JSON.stringify({
              blogId: 'baler blog',
            }),
          });
          const data = await res.json();
          console.log(data);
        }}
      >
        upvote
      </button>
      <button
        onClick={async () => {
          const res = await fetch('/vote/downvote', {
            method: 'POST',
            body: JSON.stringify({
              blogId: 'baler blog',
            }),
          });
          const data = await res.json();
          console.log(data);
        }}
      >
        downvote
      </button>
      <button
        onClick={async () => {
          const res = await fetch('/vote/votes/baler blog');
          const data = await res.json();
          console.log(data);
        }}
      >
        get votes
      </button>
      <button
        onClick={async () => {
          const res = await fetch('/vote/removevote', {
            method: 'POST',
            body: JSON.stringify({
              blogId: 'baler blog',
            }),
          });
          const data = await res.json();
          console.log(data);
        }}
      >
        removevote
      </button>
    </div>
  );
};

export default App;
