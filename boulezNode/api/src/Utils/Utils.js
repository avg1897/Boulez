exports.validatePassword = password => {
    if(password.length < 8) {
        throw new Error('Error: Password must be at least 8 characters');
    } else if(password.search(/[a-z]/) < 0) {
        throw new Error('Error: Password must contain at least one lowercase letter');
    } else if(password.search(/[A-Z]/) < 0) {
        throw new Error('Error: Password must contain at least one uppercase letter');
    } else if(password.search(/[0-9]/) < 0) {
        throw new Error('Error: Password must contain at least one number');
    } else {
        return true;
    }
}