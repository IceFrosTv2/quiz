import { CustomHttp } from "../services/custom-http.js";
import { Auth } from "../services/auth.js";
import config from "../../config/config.js";

export class Form {

    constructor (page) {
        this.agreeElement = null;
        this.page = page;

        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if ( accessToken ) {
            location.href = '#/choice';
            return;
        }

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                valid: false,
            },
        ];

        if ( this.page === 'signup' ) {
            this.fields.unshift({
                    name: 'name',
                    id: 'name',
                    element: null,
                    regex: /^[a-zA-Z]+$/,
                    // regex: /^[А-Я][а-я]+\s*$/,
                    valid: false,
                },
                {
                    name: 'lastName',
                    id: 'last-name',
                    element: null,
                    regex: /^[a-zA-Z]+$/,
                    valid: false,
                });

            this.agreeElement = document.getElementById('agree');
            this.agreeElement.onchange = function () {
                that.validateForm();
            };
        }

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this)
            };
        });

        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm()
        }
    }

    validateField (field, element) {
        if ( !element.value || !element.value.match(field.regex) ) {
            element.parentNode.style.borderColor = 'red'
            field.valid = false;
        } else {
            element.parentNode.removeAttribute('style');
            field.valid = true;
        }
        this.validateForm();
    }

    validateForm () {
        const validForm = this.fields.every(item => item.valid);
        const isValid =
            this.agreeElement ? this.agreeElement.checked && validForm : validForm;
        if ( isValid ) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return isValid;
    }

    getFieldValue (name) {
        return this.fields.find(item => item.name === name)?.element.value;
    }

    async processForm () {
        if ( this.validateForm() ) {
            const email = this.getFieldValue('email');
            const password = this.getFieldValue('password');

            if ( this.page === 'signup' ) {
                try {
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: this.getFieldValue('name'),
                        lastName: this.getFieldValue('lastName'),
                        email: email,
                        password: password,
                    });
                    if ( result ) {
                        if ( result.error || !result.user ) {
                            throw new Error(result.message);
                        }
                    }
                } catch (error) {
                    return console.log(error)
                }
            }

            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                });
                if ( result ) {
                    if ( result.error || !result.accessToken || !result.refreshToken
                        || !result.fullName || !result.userId ) {
                        throw new Error(result.message);
                    }

                    Auth.setTokens(result.accessToken, result.refreshToken);
                    Auth.setUserInfo({
                        fullName: result.fullName,
                        userId: result.userId,
                        email: email,
                    });
                    location.href = '#/choice';
                }
            } catch (error) {
                console.log(error)
            }

        }
    }
}
