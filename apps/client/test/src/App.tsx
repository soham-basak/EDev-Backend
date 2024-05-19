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
            method: 'POST',
            body: JSON.stringify({
              blogId: 'randomId',
              commentText: 'test text ReportBody',
            }),
          });
          const data = await res.json();
          console.log(data);
        }}
      >
        Create comment
      </button>
    </div>
  );
};

export default App;
