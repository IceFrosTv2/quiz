import { Form } from "./components/form.js";
import { Choice } from "./components/choice.js";
import { Test } from "./components/test.js";
import { Result } from "./components/result.js";
import { CheckResults } from "./components/check-results.js";
import { Auth } from "./services/auth.js";

export class Router {
    constructor () {

        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('page-title');
        this.profileElement = document.getElementById('profile');
        this.profileFullNameElement = document.getElementById('profile__fullName');

        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/index.html',
                styles: 'styles/index.css',
                load: () => {
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: 'styles/form.css',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'templates/login.html',
                styles: 'styles/form.css',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/choice',
                title: 'Выбор теста',
                template: 'templates/choice.html',
                styles: 'styles/choice.css',
                load: () => {
                    new Choice();
                }
            },
            {
                route: '#/test',
                title: 'Прохождение теста',
                template: 'templates/test.html',
                styles: 'styles/test.css',
                load: () => {
                    new Test();
                }
            },
            {
                route: '#/result',
                title: 'Результаты',
                template: 'templates/result.html',
                styles: 'styles/result.css',
                load: () => {
                    new Result();
                }
            },
            {
                route: '#/check-results',
                title: 'Проверить результаты',
                template: 'templates/check-results.html',
                styles: 'styles/check-results.css',
                load: () => {
                    new CheckResults();
                }
            },
        ]
    }

    async openRoute () {
        const urlRoute = location.hash.split('?')[0];
        if ( urlRoute === '#/logout' ) {
            await Auth.logout();
            location.href = '#/login';
            return;
        }


        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });

        if ( !newRoute ) {
            location.href = '#/';
            return false;
        }

        this.contentElement.innerHTML =
            await fetch(newRoute.template)
                .then(response => response.text());

        this.stylesElement.setAttribute('href', newRoute.styles);
        this.titleElement.innerText = newRoute.title;

        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);

        if ( userInfo && accessToken ) {
            this.profileElement.style.display = 'flex';
            this.profileFullNameElement.innerText = userInfo.fullName;
        } else {
            this.profileElement.style.display = 'none';
        }

        newRoute.load();
    }

}
