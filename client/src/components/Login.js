import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import HowToRegIcon from '@material-ui/icons/HowToReg'
import { loginUser } from '../actions/actionCreators/userActions'
import Auth from './Auth';
import backgroundImage from '../assests/5650.jpg';

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { token, user, successLogin, requestLogin, loginError } = useSelector(
    (state) => state.user,
  )
  const [error, setError] = useState()
  const [success, setSuccess] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    document.title = `Login | Hack On`
  }, [])

  useEffect(() => {
    if (user.username !== undefined) history.push(`/${user.username}/boards`)
  }, [history, user])

  useEffect(() => {
    if (!requestLogin) {
      if (token && successLogin) {
        setError('Logged In successfully ✔')
        setSuccess(true)
        localStorage.setItem('auth-token', token)
        // history.push(`/${user.username}/boards`)
      } else if (!successLogin && !token) {
        setError(loginError)
        setSuccess(false)
      }
    }
  }, [token, user, successLogin, requestLogin, loginError, history])

  const submitHandler = (e) => {
    e.preventDefault()
    const loginReq = { username, password }
    dispatch(loginUser(loginReq))
    setUsername('')
    setPassword('')
  }

  return (
    <>
      <div style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        minHeight: '100vh' 
      }}>
        <Auth
          btnText="Register"
          path="/register"
          authName="Login"
          icon={<HowToRegIcon fontSize="small" />}
          error={error}
          clearError={() => setError(undefined)}
          submitHandler={submitHandler}
          username={username}
          nameChangeHandler={(e) => {
            e.preventDefault()
            setUsername(e.target.value)
          }}
          password={password}
          passwordChangeHandler={(e) => {
            e.preventDefault()
            setPassword(e.target.value)
          }}
          success={success}
        />
      </div>
    </>
  )
  
  
}
