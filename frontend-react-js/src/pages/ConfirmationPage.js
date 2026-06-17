import './ConfirmationPage.css';
import React from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from '../components/svg/logo.svg';


import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

export default function ConfirmationPage() {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [errors, setErrors] = React.useState('');
  const [codeSent, setCodeSent] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

 
  React.useEffect(() => {
  const queryUsername = searchParams.get('username');
  const queryEmail = searchParams.get('email');
  if (queryUsername) setUsername(queryUsername);
  if (queryEmail) setEmail(queryEmail);
  }, [searchParams]);

  React.useEffect(() => {
  if (cooldown > 0) {
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }
  }, [cooldown]);
  
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors('');
    setSuccess(false);

    console.log('Attempting to confirm email:', email);
    console.log('Confirming for username:', username);
    console.log('Code entered:', code);

    try {
      if (!email || !code) {
        setErrors("Please enter both email and confirmation code");
        return;
      }

      const result = await confirmSignUp({
        username:username, 
        confirmationCode: code,
      });

      console.log("Confirm result:", result);

      if (result.isSignUpComplete) {
        setSuccess(true);
        navigate('/signin');
      } else {
        setErrors("Confirmation incomplete. Please try again.");
      }
    } catch (error) {
      console.error("Confirmation error:", error);
      setErrors(error.message || "Failed to confirm sign up");
    }
  };


  const resendCode = async (event) => {
    event.preventDefault();
    setErrors('');
    setCodeSent(false);

    try {
        if (!username) {
          setErrors("Missing username — please sign up again or check your link.");
          return;
        }

        await resendSignUpCode({ username });
        setCodeSent(true);
        setCooldown(60);
        setTimeout(() => setCodeSent(false), 60000);
        console.log("Resent confirmation code to", email);
      } catch (error) {
        console.error("Resend error:", error);
        setErrors(error.message || "Failed to resend code");
      }
    };

  return (
    <article className="confirm-article">
      <div className='recover-info'>
        <Logo className='logo' />
      </div>

      <div className='recover-wrapper'>
        <form className='confirm_form' onSubmit={onSubmit}>
          <h2>Confirm your Email</h2>

          <div className='fields'>
            <div className='field text_field email'>
              <label>Email</label>
              <input
                type="email"
                value={email}
                readOnly
                required
              />
            </div>

            <div className='field text_field code'>
              <label>Confirmation Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
          </div>

          {errors && <div className='errors'>{errors}</div>}
          {success && <div className='success'>Email confirmed successfully! You can now sign in.</div>}

          <div className='submit'>
            <button type='submit'>Confirm Email</button>
          </div>
        </form>
      </div>
        <div className="resend-section">
          {cooldown > 0 ? (
            <>
              {codeSent && (
                <div className="sent-message">
                  A new activation code has been sent to your email
                </div>
              )}
              <div className="cooldown-message">
                You can resend the code in {cooldown}s
              </div>
            </>
          ) : (
            <button className="resend" onClick={resendCode}>
              Resend Activation Code
            </button>
          )}
        </div>
    </article>
  );
}