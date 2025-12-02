import '../css/Profile.css';

export default function Profile() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    user = null;
  }

  const name = user?.name || 'John Doe';
  const email = user?.email || 'john.doe@example.com';

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <h1>Profile</h1>
        <div className="profile-row">
          <span className="label">Name:</span>
          <span className="value">{name}</span>
        </div>
        <div className="profile-row">
          <span className="label">Email:</span>
          <span className="value">{email}</span>
        </div>
        <p className="hint">This is a dummy profile page without backend integration.</p>
      </div>
    </div>
  );
}
