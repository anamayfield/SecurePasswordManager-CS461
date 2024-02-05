const { createClient } = require('@supabase/supabase-js');
const { testFunctionTOTP } = require('../totp/TOTPGenerator.js');

const supabase_url = 'https://dtwmtlfnskzbtsgndetr.supabase.co';
const anon_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d210bGZuc2t6YnRzZ25kZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4ODQxMTMsImV4cCI6MjAxNzQ2MDExM30.qoYr-kxeXb4I3rRe-dzqaC__SWiAUt4g1YSsES01mxk';

const supabase = createClient(supabase_url, anon_key);

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function signIn() {
    const { email, password } = await getUserCredentials();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    testFunctionTOTP();

    if (error) {
        console.error('Error signing in:', error.message);
      } else {
        console.log('Sign in successful. User data:', data);
      }
    rl.close();
}

async function signUp() {
    const { email, password } = await getUserCredentials();
  
    // Validate email and password
    const emailValidationResults = validateEmail(email);
    const passwordValidationResults = validatePassword(password);
  
    if (emailValidationResults.isEmailValid && passwordValidationResults.isPasswordValid) {
      // Proceed with registration
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (error) {
        console.error('Error signing up:', error.message);
      } else {
        console.log('Sign up successful. User data:', data);
      }
    } else {
      // Display validation errors and do not attempt registration
      console.error('Email Validation errors:', emailValidationResults.errors);
      console.error('Password Validation errors:', passwordValidationResults.errors);
    }
  
    rl.close();
  }

async function getUserCredentials() {
  const email = await promptUser('Enter your email: ');
  const password = await promptUser('Enter your password: ');

  console.log('Email:', email);
  console.log('Password:', password);

  return { email, password };
}

function validateEmail(email){
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    const isEmailValid = emailPattern.test(email);

    return {
        isEmailValid,
        errors: 
        {
          email: isEmailValid ? null : 'Invalid email format',
        },
      };
}

function validatePassword(password){
    const passwordMinLength = 8;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const isPasswordValid = passwordPattern.test(password) && password.length >= passwordMinLength;

    return {
        isPasswordValid,
        errors: {
          password: isPasswordValid ? null : 'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      },
      };
}

// signUp();
signIn();