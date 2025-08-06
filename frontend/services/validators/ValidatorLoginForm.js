class ValidatorLoginForm {
    validate(form) {
        let errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(form.email == null || !form.email.trim()) {
            errors.email = "email required";
        }
        else if(!regex.test(form.email)) {
            errors.email = "invalid email";
        }

        if(form.password == null || !form.password.trim()) {
            errors.password = "password required";
        }

        if(Object.keys(errors).length === 0)
            errors = null

        return errors;
    }
}

export default ValidatorLoginForm;