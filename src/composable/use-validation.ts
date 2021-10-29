export default function useValidation() {

    // we don't need to validate all the email. We just want to check if it's an email.
    // the validation part will be done over on the firebase part.
    const validateEmail = (value: string) => {
        return ['@', '.'].every(part => value.includes(part));
    }

    return {
        validateEmail
    }
}
