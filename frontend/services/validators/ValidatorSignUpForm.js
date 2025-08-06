class ValidatorSignUpForm {
    validate(form) {
        let errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(form.username == null || !form.username.trim())
            errors.username = "user name required";

        if(form.email == null || !form.email.trim())
            errors.email = "email required";
        else if(!emailRegex.test(form.email))
            errors.email = "invalid email";

        if(form.password == null || !form.password.trim())
            errors.password = "password required";


        if(Object.keys(errors).length === 0)
            errors = null;

        return errors;
    }
}

export default ValidatorSignUpForm;