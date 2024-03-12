const { createClient } = require('@supabase/supabase-js');
// const { testFunctionTOTP } = require('../totp/TOTPGenerator.js');

// const supabase_url = 'https://dtwmtlfnskzbtsgndetr.supabase.co';
// const anon_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d210bGZuc2t6YnRzZ25kZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4ODQxMTMsImV4cCI6MjAxNzQ2MDExM30.qoYr-kxeXb4I3rRe-dzqaC__SWiAUt4g1YSsES01mxk';

// const supabase = createClient(supabase_url, anon_key);

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createSupaClient(){
    const supabase_url = 'https://dtwmtlfnskzbtsgndetr.supabase.co';
    const anon_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d210bGZuc2t6YnRzZ25kZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4ODQxMTMsImV4cCI6MjAxNzQ2MDExM30.qoYr-kxeXb4I3rRe-dzqaC__SWiAUt4g1YSsES01mxk';

    const supabaseClient = createClient(supabase_url, anon_key);
    
    return supabaseClient;
}
function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function signIn(supabase) {
    const { email, password } = await getUserCredentials();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Error signing in:', error.message);
      } else {
        console.log('Sign in successful. User data:', data);
      }
      
}

async function signUp(supabase) {
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
        userIDString = await getUserID(supabase);
        await storeTOTPAndUser(supabase, 12345, userIDString);
        console.log('Sign up successful. User data:', data);
      }
    } else {
      // Display validation errors and do not attempt registration
      console.error('Email Validation errors:', emailValidationResults.errors);
      console.error('Password Validation errors:', passwordValidationResults.errors);
    }
  
}

async function storeTOTPAndUser(supabase, totpCode, userIDStringToStore) {

    const userID = await getUserID(supabase)

    const {error1, data1, count } = await supabase
        .from('totp')
        .select('*', {count: 'exact'})

    const idToPlace = count + 1

    const { error } = await supabase
        .from('totp')
        .insert({ id: idToPlace, totp_code: totpCode, user_id_string: userIDStringToStore })

    if (error){
        console.log("ERRROR: ", error)
    }
    else{
        console.log("Success")
    }
}

async function getTOTPForUser(supabase, userParentIDToGet){
    const { data, error } = await supabase
        .from('totp')
        .select()
        .eq('id', userParentIDToGet)
    
    if (error){
        console.log("ERROR: ", error);
    } else{
        console.log("Retrieved.")
    }
    return data[0].totp_code;
}

async function signOut(supabase){
    const { error } = await supabase.auth.signOut()

    if (error){
        console.error('Error signing out:', error.message);
    } else{
        console.log('Sign out successful.');
    }
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

async function updateEmail(supabase){
    const email = await promptUser('New email: ');

    const { data: { data, error } } = await supabase.auth.updateUser({
        email: email
    });

    if (error) {
        console.error('Error changing email: ', error.message);
    } else {
        console.log('Email sent. Check email to confirm change.');
    }
}

async function updatePassword(supabase){
    const newPassword = await promptUser('New password: ');

    const passwordValidationResults = validatePassword(newPassword);

    if (passwordValidationResults.isPasswordValid) {
        // Proceed with registration
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword
        });
    
        if (error) {
          console.error('Error changing password: ', error.message);
        } else {
          console.log('Password changed.');
        }
      } else {
        console.error('Password Validation errors:', passwordValidationResults.errors);
      }
}

async function getUserParentID(supabase){
    // Getting the current user's string id
    const { data: { user } } = await supabase.auth.getUser();

    // Getting the current user's primary key id
    const { data, error } = await supabase
        .from('totp')
        .select()
        .eq('user_id_string', user.id)
    
    if (error){
        console.log("ERROR: ", error);
    } else{
        console.log("Retrieved.")
    }
    return data[0].id;
}

async function main(){
    supabase = await createSupaClient();
    // await signUp(supabase);

    await signIn(supabase);
    userId = await getUserParentID(supabase)
    console.log(userId)
    // totp = await getTOTPForUser(supabase, userParentID)
    // console.log(totp)
    // await signIn(supabase);
    // userId = await getUserID(supabase);
    // console.log(`The userId is: ${userId}`);
    // await updateEmail(supabase);
    // await updatePassword(supabase);
    // await signIn(supabase);
    // await signOut(supabase);
    rl.close();
    process.exit();
}

// Testing
main();