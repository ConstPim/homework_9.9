window.onload = function () {

    let fullName = document.getElementById('fullName');
    let userName = document.getElementById('userName');
    let password = document.getElementById('password');
    let repeatPassword = document.getElementById('repeatPassword');
    let checkbox = document.getElementById('checkbox');
    let buttonOk = document.getElementById('closePopup');
    let link = document.getElementById('link');
    let buttonSignUp = document.getElementById('button');
    let labelInputs = document.querySelectorAll('.label input');
    let popup = document.getElementById('popup');
    let email = document.getElementById('email');
    let inputsError = document.querySelectorAll('.error');
    let labels = document.getElementsByClassName('label');
    let title = document.getElementById('form-title');


    //Очистка полей формы от сообщений об ошибке
    function clearError() {

        labelInputs.forEach(input => {
            input.classList.remove('border-error');
            // input.style.border = '';
        });
        inputsError.forEach(span => {
            span.innerText = '';
        });
    }

    function emptyInput(valueElement) {
        valueElement.nextElementSibling.textContent = `Заполните поле ${valueElement.parentElement.innerText}!`;
        valueElement.classList.add('border-error');
        // return true;
    }

    //Проверка полей формы
    function clickButtonSignUp() {
        let hasError = false;

        clearError();

        if (!fullName.value) {
            emptyInput(fullName);
            hasError = true;
        } else {
            let condition = /^[a-z\s]+$/i;
            if (!condition.test(fullName.value)) {
                fullName.nextElementSibling.textContent = `Поле ${fullName.parentElement.innerText} может содержать только буквы и пробелы!`;
                fullName.classList.add('border-error');
                hasError = true;
            }
        }

        if (!userName.value) {
            emptyInput(userName);
            hasError = true;
        } else {
            let condition = /^[a-z0-9_-]+$/i;
            if (!condition.test(userName.value)) {
                userName.nextElementSibling.textContent = `Поле ${userName.parentElement.innerText} может содержать только буквы, цифры, символ подчеркивания и тире!`;
                userName.classList.add('border-error');
                hasError = true;
            }
        }

        if (!email.value) {
            emptyInput(email);
            hasError = true;
        } else {
            let condition = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
            if (!condition.test(email.value)) {
                email.nextElementSibling.textContent = `Поле ${email.parentElement.innerText} заполнено некорректно!`;
                email.classList.add('border-error');
                hasError = true;
            }
        }

        if (!password.value) {
            emptyInput(password);
            hasError = true;
        } else {
            let condition = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]{8,}$/;
            if (!condition.test(password.value)) {
                password.nextElementSibling.textContent = `Поле ${password.parentElement.innerText} должно содержать минимум 8 символов,
                 хотя бы одна букву в верхнем регистре, хотя бы одну цифру, хотя бы один спецсимвол!`;
                password.classList.add('border-error');
                hasError = true;
            }
        }

        if (!repeatPassword.value) {
            emptyInput(repeatPassword);
            hasError = true;
        } else {
            if (password.value !== repeatPassword.value) {
                repeatPassword.nextElementSibling.textContent = `Поле ${repeatPassword.parentElement.innerText}
                 должен совпадать с полем ${password.parentElement.innerText}!`;
                repeatPassword.classList.add('border-error');
                hasError = true;
            }
        }

        if (!checkbox.checked) {
            checkbox.nextElementSibling.textContent = `Вам нужно выбрать ${checkbox.parentElement.innerText}!`;
            hasError = true;
        }

        if (!hasError) {

            //Сохранение данных о клиенте в Local storage
            let clients = [];

            let newUser = {
                fullName: fullName.value,
                userName: userName.value,
                email: email.value,
                password: password.value
            };
            let users = localStorage.getItem('users');

            if (users) {
                clients = JSON.parse(users);
            }
            let contact = clients.find(con => con.email === email.value);

            //Проверка наличие уже зарегистрированного клиента по email
            if (contact) {
                email.nextElementSibling.textContent = `Клиент с таким email уже зарегистрирован!`;
                email.classList.add('border-error');

            } else {
                clients.push(newUser);
                localStorage.setItem('users', JSON.stringify(clients));

                let popup = document.getElementById('popup');

                // открытие попапа
                popup.classList.add('active');

                // закрытие попапа
                buttonOk.onclick = function () {
                    popup.classList.remove('active');
                }
            }



        }

    }

    buttonSignUp.addEventListener('click', clickButtonSignUp);


    //Создание страницы входа
    function goToLoginPage() {
        clearError();
        for (let i = 0; i < labelInputs.length; i++) {
            labelInputs[i].value = '';
        }
        popup.classList.remove('active');
        title.innerText = 'Log in to the system';
        fullName.parentElement.remove();
        email.parentElement.remove();
        repeatPassword.parentElement.remove();
        checkbox.parentElement.remove();
        buttonSignUp.innerText = 'Sign In';
        link.textContent = 'Registration';
        link.removeEventListener('click', goToLoginPage);
        link.addEventListener('click', () => {
            location.reload();
        });
        buttonSignUp.removeEventListener('click', clickButtonSignUp);
        buttonSignUp.addEventListener('click', clickButtonSignIn);
    }

    buttonOk.addEventListener('click', goToLoginPage);
    link.addEventListener('click', goToLoginPage);

    //Проверка полей на странице входа
    function clickButtonSignIn() {

        let hasError = false;

        clearError();

        if (!userName.value) {
            emptyInput(userName);
            hasError = true;
        }

        if (!password.value) {
            emptyInput(password);
            hasError = true;
        }


        if (!hasError) {
            //Проверка клиента: зарегистрирован или нет
            let clients = JSON.parse(localStorage.getItem('users')) || [];
            if (clients) {
                let user = clients.find(us => us.userName === userName.value);
                if (!user) {
                    userName.nextElementSibling.textContent = `Такой пользователь не зарегистрирован!`;
                    userName.classList.add('border-error');
                } else if (user.password !== password.value) {
                    password.nextElementSibling.textContent = `Неверный пароль!`;
                    password.classList.add('border-error');
                } else {
                    goToPersonalAccount (user.fullName);
                }
            }
        }

    }

    //Создание страницы Личный кабинет
    function goToPersonalAccount(name) {
        title.innerText = `Welcome, ${name}!`;
        buttonSignUp.innerText = 'Exit';
        buttonSignUp.removeEventListener('click', clickButtonSignIn);
        buttonSignUp.addEventListener('click', () => {
            location.reload();
        });
        link.parentElement.remove();
        userName.parentElement.remove();
        password.parentElement.remove();
        document.getElementsByClassName('form-text')[0].remove();

    }


}