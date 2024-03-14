const { createClient } = require('@supabase/supabase-js');

function createSupaClient(){
    const supabase_url = 'https://dtwmtlfnskzbtsgndetr.supabase.co';
    const anon_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d210bGZuc2t6YnRzZ25kZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4ODQxMTMsImV4cCI6MjAxNzQ2MDExM30.qoYr-kxeXb4I3rRe-dzqaC__SWiAUt4g1YSsES01mxk';
    const supabaseClient = createClient(supabase_url, anon_key);
    return supabaseClient;
}

async function signIn(supabase, email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Error signing in:', error.message);
        return { error };
      } else {
        console.log('Sign in successful. User data:', data);
        return { data };
      }
}

async function signUp(supabase, email, password) {
  const emailValidationResults = validateEmail(email);
  const passwordValidationResults = validatePassword(password);

  if (emailValidationResults.isEmailValid && passwordValidationResults.isPasswordValid) {
      try {
          const { data, error } = await supabase.auth.signUp({
              email,
              password,
          });

          if (error) {
              console.error('Error signing up:', error.message);
              return { error };
          }

          console.log('Sign up successful. User data:', data);
          return { data };
      } catch (error) {
          console.error('Error signing up:', error.message);
          return { error };
      }
  } else {
      console.error('Email Validation errors:', emailValidationResults.errors);
      console.error('Password Validation errors:', passwordValidationResults.errors);
      return { error: { message: 'Validation errors. Registration aborted.' } };
  }
}

async function signOut(supabase){
    const { error } = await supabase.auth.signOut()
    console.log("INSHIDHGISHJLFSKLJF")

    if (error){
        console.error('Error signing out:', error.message);
    } else{
        console.log('Sign out successful.');
    }
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

async function getUserID(supabase){
    const { data: { user } } = await supabase.auth.getUser()

    const userId = user ? user.id : null
    console.log('Sending user data...');
    return userId;
}

async function getUserParentID(supabase) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('totp')
            .select()
            .eq('user_id_string', user.id);

        if (error) {
            console.error("Error occurred while fetching user parent ID:", error);
            return null; // or handle the error as required
        } else {
            console.log("Retrieved.");

            if (data && data.length > 0) {
                return data[0].id;
            } else {
                console.log("No valid data found for the user in the 'totp' table.");
                return null; // or handle the absence of valid data as required
            }
        }
    } catch (error) {
        console.error("Error occurred while fetching user parent ID:", error);
        return null; // or handle the error as required
    }
}

async function storeTOTPAndUser(supabase, totpCode, userId) {
    // const { data: { user } } = await supabase.auth.getUser();

    const {error1, data1, count } = await supabase
        .from('totp')
        .select('*', {count: 'exact'})

    const idToPlace = count + 1

    const { error } = await supabase
        .from('totp')
        .insert({ id: idToPlace, totp_code: totpCode, user_id_string: userId })

    if (error){
        console.log("ERRROR: ", error)
    }
    else{
        console.log("Success")
    }
}

export { createSupaClient, signUp, signIn, signOut, getUserID, getUserParentID, storeTOTPAndUser };