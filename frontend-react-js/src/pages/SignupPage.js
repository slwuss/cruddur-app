import './SignupPage.css';
import React from "react";
import { ReactComponent as Logo } from '../components/svg/logo.svg';
import { Link, useNavigate } from "react-router-dom";
import { signUp } from 'aws-amplify/auth';

export default function SignupPage() {
  const navigate = useNavigate();

 
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors('');

    try {
      const { userId, nextStep, isSignUpComplete } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            name,
            email,
            preferred_username: username,
          },
          autoSignIn: true,
        },
      });

      console.log('Signup success:', { userId, nextStep, isSignUpComplete });
      navigate(`/confirm?username=${username}&email=${email}`);
    } catch (error) {
      console.error('Signup error:', error);
      setErrors(error.message || 'Signup failed');
    }
  };

  return (
    <article className='signup-article'>
      <div className='signup-info'>
        <Logo className='logo' />
      </div>
      <div className='signup-wrapper'>
        <form className='signup_form' onSubmit={onSubmit}>
          <h2>Sign up to create a Cruddur account</h2>

          <div className='fields'>
            <div className='field text_field name'>
              <label>Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className='field text_field email'>
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div className='field text_field username'>
              <label>Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
            </div>

            <div className='field text_field password'>
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>

          {errors && <div className='errors'>{errors}</div>}

          <div className='submit'>
            <button type='submit'>Sign Up</button>
          </div>
        </form>

        <div className="already-have-an-account">
          <span>Already have an account?</span>
          <Link to="/signin">Sign in!</Link>
        </div>
      </div>
    </article>
  );
}