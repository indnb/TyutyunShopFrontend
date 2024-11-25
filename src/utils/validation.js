export const validateField = (name, value, formData = {}) => {
    let error = "";

    switch (name) {
        case "username":
            const usernameRegex = /^[A-Za-z][A-Za-z0-9]{2,19}$/;
            if (!usernameRegex.test(value)) {
                error = "Логін повинен починатися з літери, містити лише англійські літери та цифри, та бути не коротшим за 3 і не довшим за 20 символів.";
            }
            break;
        case "email":
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                error = "Некоректна електронна адреса.";
            }
            break;
        case "password":
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]{8,}$/;

            if (!passwordRegex.test(value)) {
                error = "Пароль повинен буду довшим за 8 та меншим за 20 символів, містити тільки латинські букви, одну велику літеру, одну цифру та один спеціальний символ.";
            } else if (value.length > 20) {
                error = "Пароль не повинен бути довшим за 20 символів.";
            }
            break;
        case "phone_number":
            const phoneRegex = /^\+380\d{9}$/;
            if (!phoneRegex.test(value)) {
                error = "Телефон повинен бути у форматі +380XXXXXXXXX.";
            }
            break;
        case "first_name":
        case "last_name":
            const nameRegex = /^[A-Za-zА-Яа-яЇїІіЄєҐґ]{2,}$/;
            if (!value.trim()) {
                error = "Це поле обов'язкове.";
            } else if (!nameRegex.test(value)) {
                error = "Ім'я або прізвище повинні містити лише літери та бути не коротшими за 2 символи.";
            } else if (value.length > 20) {
                error = "Ім'я або прізвище повинні бути не довшими за 20 символів.";
            }
            break;
        case "confirm_password":
            if (value !== formData.new_password) {
                error = "Паролі не співпадають.";
            }
            break;
        case "old_password":
            if (!value.trim()) {
                error = "Старий пароль є обов’язковим.";
            }
            break;
        default:
            break;
    }

    return error;
};
