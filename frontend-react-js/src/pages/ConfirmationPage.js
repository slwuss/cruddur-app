import './ConfirmationPage.css';
import React from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from '../components/svg/logo.svg';


import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

export default function ConfirmationPage() {
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [errors, setErrors] = React.useState('');
  const [codeSent, setCodeSent] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

 
  React.useEffect(() => {
    const queryEmail = searchParams.get('email');
    if (queryEmail) setEmail(queryEmail);
  }, [searchParams]);

  
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors('');
    setSuccess(false);

    try {
      if (!email || !code) {
        setErrors("Please enter both email and confirmation code");
        return;
      }

      const result = await confirmSignUp({
        username: email, 
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
      if (!email) {
        setErrors("Please enter your email to resend code");
        return;
      }

      await resendSignUpCode({ username: email });
      setCodeSent(true);
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
                onChange={(e) => setEmail(e.target.value)}
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

        <div className="resend-section">
          {codeSent ? (
            <div className="sent-message">✅ A new activation code has been sent to your email</div>
          ) : (
            <button className="resend" onClick={resendCode}>
              Resend Activation Code
            </button>
          )}
        </div>
      </div>
    </article>
  );
}