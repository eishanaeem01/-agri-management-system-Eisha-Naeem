import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/thunks/loginUser';
import { clearAuthError } from '../../store/actions/authActions';
import { validateLogin } from '../../utils/validators';

// Username and password form - dispatches the login thunk, session is persisted by the middleware
export default function LoginForm() {
  const dispatch = useDispatch();
  const { error, status } = useSelector((s) => s.auth);
  const [f, setF] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});

  const change = (k) => (e) => {
    setF({ ...f, [k]: e.target.value });
    if (error) dispatch(clearAuthError());
  };
  const submit = (ev) => {
    ev.preventDefault();
    const v = validateLogin(f);
    setErrors(v);
    if (Object.keys(v).length) return;
    dispatch(loginUser(f));
  };
  const fill = (username, password) => {
    setF({ username, password });
    setErrors({});
  };

  return (
    <form onSubmit={submit} noValidate>
      {error && <div className="alert alert-danger py-2 small" role="alert"><i className="bi bi-exclamation-circle me-2" />{error}</div>}
      <div className="mb-3">
        <label className="form-label" htmlFor="login-user">Username</label>
        <input id="login-user" className={`form-control ${errors.username ? 'is-invalid' : ''}`} autoComplete="username" value={f.username} onChange={change('username')} />
        <div className="invalid-feedback">{errors.username}</div>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="login-pass">Password</label>
        <input id="login-pass" type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} autoComplete="current-password" value={f.password} onChange={change('password')} />
        <div className="invalid-feedback">{errors.password}</div>
      </div>
      <button type="submit" className="btn btn-success w-100" disabled={status === 'loading'}>Sign in</button>
      <div className="demo-box mt-3 small">
        <div className="fw-semibold mb-1">Demo accounts</div>
        <button type="button" className="btn btn-sm btn-outline-success me-2" onClick={() => fill('admin', 'admin123')}>Admin: admin / admin123</button>
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => fill('manager', 'manager123')}>Manager: manager / manager123</button>
      </div>
    </form>
  );
}
