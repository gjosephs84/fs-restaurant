const validate = (entry, label) => {

    // Validation requirements for username
    const validUserName = (entry) => {
        console.log(`entry is ${JSON.stringify(entry)}`);
        console.log(`entry.length is ${entry.length}`);
        if (entry.length >= 6) {
            return true;
        } else {
            return false;
        }
    };

    // Validation requirements for email
    const validEmail = (entry) => {
        if (entry.includes('@') && entry.includes('.')) {
            return true;
        } else {
            return false;
        }
    };

    // Validation requirements for password
    const validPassword = (entry) => {
        if (entry.length >= 8) {
            return true;
        } else {
            return false;
        }
    };

    // initialize a variable to catch validation result
    let isValid;

    // initialize a variable to hold the message to display when
    // validation fails
    let message;

    // based on the label passed in, validate (or don't) and set
    // the message to be returned.
    switch (label) {
        case 'username' : 
            isValid = validUserName(entry);
            message = "Username must contain at least 6 characters";
            break;
        case 'email' :
            isValid = validEmail(entry);
            message = "Check your email address (must include @ and .)";
            break;
        case 'identifier' :
            isValid = validEmail(entry);
            message = "Check your email address (must include @ and .)";
            break;
        case 'password' :
            isValid = validPassword(entry);
            message = "Password must contain at least 8 characters"
            break;
        default :
            console.log("Something went wrong with validation");

    }

    // If validation is successful, return null, otherwise, send back
    // the message explaining what's wrong.
    if (isValid == true) {
        return null;
    } else {
        return message;
    };
};

export default validate;