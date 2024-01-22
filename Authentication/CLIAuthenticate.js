import { createClient } from '@supabase/supabase-js';

const supabase_url = 'https://dtwmtlfnskzbtsgndetr.supabase.co';
const anon_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d210bGZuc2t6YnRzZ25kZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4ODQxMTMsImV4cCI6MjAxNzQ2MDExM30.qoYr-kxeXb4I3rRe-dzqaC__SWiAUt4g1YSsES01mxk';

const supabase = createClient(supabase_url, anon_key);

import readline from 'readline';

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

async function signUp() {
    const { email, password } = await getUserCredentials();
  
    // Validate email and password
    const validationResults = validateEmailAndPassword(email, password);
  
    if (validationResults.isEmailValid && validationResults.isPasswordValid) {
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
      console.error('Validation errors:', validationResults.errors);
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

function validateEmailAndPassword(email, password) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  
    const passwordMinLength = 8;
  
    const isEmailValid = emailPattern.test(email);
    const isPasswordValid = password.length >= passwordMinLength;
  
    return {
      isEmailValid,
      isPasswordValid,
      errors: {
        email: isEmailValid ? null : 'Invalid email format',
        password: isPasswordValid ? null : 'Password must be at least 8 characters',
      },
    };
  }

signUp();