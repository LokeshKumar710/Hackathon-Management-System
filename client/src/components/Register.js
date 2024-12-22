import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputIcon from '@material-ui/icons/Input';
import { registerUser } from '../actions/actionCreators/userActions';
import Auth from './Auth';
import backgroundImage from '../assests/5650.jpg';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { requestRegister, successRegister, registerError } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = `Register | Hack On`;
  }, []);

  useEffect(() => {
    if (!requestRegister) {
      if (successRegister) {
        setError('Successfully Registered ✔');
        setSuccess(true);
        localStorage.setItem('auth-token', '');
        setTimeout(() => (window.location.href = '/'), 1000);
      } else if (registerError) {
        setError(registerError);
        setSuccess(false);
      }
    }
  }, [requestRegister, successRegister, registerError]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== passwordCheck) {
      setError('Passwords do not match!');
      setSuccess(false);
      return;
    }

    const newUser = { username, password, passwordCheck };
    dispatch(registerUser(newUser));
    setUsername('');
    setPassword('');
    setPasswordCheck('');
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      
      }}
    >
      <Auth
        btnText="Login"
        path="/"
        authName="Register"
        icon={<InputIcon fontSize="small" />}
        error={error}
        clearError={() => setError('')}
        submitHandler={submitHandler}
        username={username}
        nameChangeHandler={(e) => setUsername(e.target.value)}
        password={password}
        passwordChangeHandler={(e) => setPassword(e.target.value)}
        passwordCheck={passwordCheck}
        passwordCheckChangeHandler={(e) => setPasswordCheck(e.target.value)}
        register
        success={success}
      />
    </div>
  );
}
