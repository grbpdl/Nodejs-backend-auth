function validateEmail(email) {
    // Check if the email is empty
    if (!email) {
      return "Email address is required.";
    }
  
    // Regular expression for validating email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    // Check if the email contains the "@" symbol
    if (!email.includes("@")) {
      return "Email must contain '@' symbol.";
    }
  
    // Check if there is a valid domain part after "@"
    const domainPart = email.split("@")[1];
    if (!domainPart || !domainPart.includes(".")) {
      return "Email must contain a valid domain.";
    }
  
    // Check if the local part of the email (before "@") contains invalid characters
    const localPart = email.split("@")[0];
    const invalidLocalRegex = /[^a-zA-Z0-9._%+-]/;
    if (invalidLocalRegex.test(localPart)) {
      return " Email contains invalid characters.";
    }
  
    // Check if the email matches the general email format
    if (!emailRegex.test(email)) {
      return "Email format is invalid.";
    }
  
    // If the email is valid, return null
    return null;
  }

  function validatePassword(password) {
    // Check if the password is empty
    if (!password) {
      return "Password is required.";
    }
  
    // Minimum length requirement (e.g., 8 characters)
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
  
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
  
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
  
    // Check for at least one digit
    if (!/\d/.test(password)) {
      return "Password must contain at least one number.";
    }
  
    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character.";
    }
  
    // If the password is valid, return null
    return null;
  }
  
  
  module.exports={validateEmail,validatePassword}