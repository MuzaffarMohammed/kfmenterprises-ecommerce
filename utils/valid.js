export const valid = (name, email, password, cf_password) => {

    if(!name || !email || !password)
    return 'Please add all the fields.'

    if(!validateUserName(name))
    return "Only Alphabets, Numbers, and three special characters [ . @ _ ] are allowed in 'User Name'."

    if(!validateEmail(email))
    return 'Invalid email address.'

    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*_.,|/<>?;:'"+=-`~])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    if(!passwordRegex.test(password))  
    return "Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters in 'Password'."

    if(password !== cf_password)
    return 'Confirm password did not match.'
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const validateUserName = (user) =>{
    const userRegex = /^[a-zA-Z0-9@._ ]+$/;
    return userRegex.test(user);
}

export const resetPwdValidation = (password, cf_password) => {

    if( !password)
    return 'Please add all the fields.'


    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*_.,|/<>?;:'"+=-`~])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    if(!passwordRegex.test(password))  
    return "Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters in 'Password'."

    if(password !== cf_password)
    return 'Confirm password did not match.'
}

