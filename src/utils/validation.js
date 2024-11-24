export const validateField = (name, value, formData = {}) => {
    let error = "";

    switch (name) {
        case "username":
            const usernameRegex = /^[A-Za-z]{3,}$/;
            if (!usernameRegex.test(value)) {
                error = "Логін повинен містити лише англійські літери та бути не коротшим за 3 символи.";
            }
            break;
        case "email":
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                error = "Некоректна електронна адреса.";
            }
            break;
        case "password":
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/;
            const commonPasswords = ["123456", "password", "qwerty", "12345678"];
            const onlyLettersRegex = /^[A-Za-z]+$/;
            const onlyNumbersRegex = /^\d+$/;
            const onlySymbolsRegex = /^[@$!%*?&#]+$/;

            if (!passwordRegex.test(value)) {
                error = "Пароль повинен містити від 8 до 20 символів, тільки латинські букви, хоча б одну велику літеру, одну цифру та один спеціальний символ.";
            } else if (commonPasswords.includes(value.toLowerCase())) {
                error = "Пароль надто простий. Оберіть більш надійний пароль.";
            } else if (/^(.)\1+$/.test(value)) {
                error = "Пароль не повинен складатися з повторюваних символів.";
            } else if (value.length > 20) {
                error = "Пароль не повинен бути довшим за 20 символів.";
            } else if (onlyLettersRegex.test(value)) {
                error = "Пароль не повинен складатися лише з літер.";
            } else if (onlyNumbersRegex.test(value)) {
                error = "Пароль не повинен складатися лише з цифр.";
            } else if (onlySymbolsRegex.test(value)) {
                error = "Пароль не повинен складатися лише з спеціальних символів.";
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
