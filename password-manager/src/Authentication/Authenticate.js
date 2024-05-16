const { createClient } = require("@supabase/supabase-js");

// Function to create Supabase client instance
function createSupaClient() {
    const supabase_url = "https://dtwmtlfnskzbtsgndetr.supabase.co";
    const anon_key =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d210bGZuc2t6YnRzZ25kZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4ODQxMTMsImV4cCI6MjAxNzQ2MDExM30.qoYr-kxeXb4I3rRe-dzqaC__SWiAUt4g1YSsES01mxk";
    const supabaseClient = createClient(supabase_url, anon_key);

    // Return the supabase client instance
    return supabaseClient;
}

// Function to sign in a user
async function signIn(supabase, email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error("Error signing in:", error.message);
        return { error };
    } else {
        console.log("Sign in successful. User data:", data);
        return { data };
    }
}

// Function to register a new user
async function signUp(supabase, email, password) {
    const emailValidationResults = validateEmail(email);
    const passwordValidationResults = validatePassword(password);

    if (!emailValidationResults.isEmailValid) {
        console.error(
            "Email Validation errors:",
            emailValidationResults.errors
        );
        return { error: { message: "Email is invalid." } };
    }

    if (!passwordValidationResults.isPasswordValid) {
        console.error(
            "Password Validation errors:",
            passwordValidationResults.errors
        );
        return { error: { message: "Password is invalid." } };
    }

    // Sign up to supabase service
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            console.error("Error signing up:", error.message);
            return { error };
        }

        console.log("Sign up successful. User data:", data);
        return { data };

    } catch (error) {
        console.error("Error signing up:", error.message);
        return { error };
    }
}

// Function to sign out the current user
async function signOut(supabase) {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Error signing out:", error.message);
    } else {
        console.log("Sign out successful.");
    }
}

// Function to validate the email format
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    const isEmailValid = emailPattern.test(email);

    return {
        isEmailValid,
        errors: {
            email: isEmailValid ? null : "Invalid email format",
        },
    };
}

// Function to validate the password format
function validatePassword(password) {
    var isMinLength = false;
    if (password.length >= 8) {
        isMinLength = true;
    }

    const uppercasePattern = /[A-Z]/;
    const lowercasePattern = /[a-z]/;
    const specialPattern = /[!@#$%^&*(),.?":{}|<>]/;
    const numberPattern = /\d/;

    const hasUppercase = uppercasePattern.test(password);
    const hasLowercase = lowercasePattern.test(password);
    const hasSpecial = specialPattern.test(password);
    const hasNumber = numberPattern.test(password);

    const isPasswordValid =
        isMinLength && hasUppercase && hasLowercase && hasSpecial && hasNumber;

    return {
        isPasswordValid,
        errors: {
            password: isPasswordValid
                ? null
                : "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        },
    };
}

// Function that gets the user's string from supabase
async function getUserString(supabase) {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const userString = user ? user.id : null;
    console.log("Sending user data...");
    return userString;
}

// Function that gets the user's integer ID
// This is the main function to use externally
async function getUserParentID(supabase) {
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from("totp")
            .select()
            .eq("user_id_string", user.id);

        if (error) {
            console.error(
                "Error occurred while fetching user parent ID:",
                error
            );
            return null; // or handle the error as required
        } else {
            console.log("Retrieved.");

            if (data && data.length > 0) {
                return data[0].id;
            } else {
                console.log(
                    "No valid data found for the user in the 'totp' table."
                );
                return null; // or handle the absence of valid data as required
            }
        }
    } catch (error) {
        console.error("Error occurred while fetching user parent ID:", error);
        return null; // or handle the error as required
    }
}

// Function to store TOTP and user inside the TOTP database in Supabase
async function storeTOTPAndUser(supabase, totpCode, userString) {
    const { error1, data1, count } = await supabase
        .from("totp")
        .select("*", { count: "exact" });

    const idToPlace = count + 1;

    const { error } = await supabase
        .from("totp")
        .insert({ id: idToPlace, totp_code: totpCode, user_id_string: userString });

    if (error) {
        console.log("ERRROR: ", error);
    } else {
        console.log("Success");
    }
}

export {
    createSupaClient,
    signUp,
    signIn,
    signOut,
    getUserString,
    getUserParentID,
    storeTOTPAndUser,
};
