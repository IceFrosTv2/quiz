import { Form } from "./components/form.js";
import { Choice } from "./components/choice.js";
import { Test } from "./components/test.js";
import { Result } from "./components/result.js";
import { CheckResults } from "./components/check-results.js";

export class Router {
    constructor () {

        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/index.html',
                styles: '/styles/index.css',
                load: () => {
                }
            },
            {
                route: '#/form',
                title: 'Регистрация',
                template: 'templates/form.html',
                styles: '/styles/form.css',
                load: () => {
                    new Form();
                }
            },
            {
                route: '#/choice',
                title: 'Выбор теста',
                template: 'templates/choice.html',
                styles: '/styles/choice.css',
                load: () => {
                    new Choice();
                }
            },
            {
                route: '#/test',
                title: 'Прохождение теста',
                template: 'templates/test.html',
                styles: '/styles/test.css',
                load: () => {
                    new Test();
                }
            },
            {
                route: '#/result',
                title: 'Результаты',
                template: 'templates/result.html',
                styles: '/styles/result.css',
                load: () => {
                    new Result();
                }
            },
            {
                route: '#/check-results',
                title: 'Проверить результаты',
                template: 'templates/check-results.html',
                styles: '/styles/check-results.css',
                load: () => {
                    new CheckResults();
                }
            },
        ]
    }

    async openRoute () {
        const currentHash = location.hash || '#/';
        const newRoute = this.routes.find(item => {
            return item.route === currentHash.split('?')[0];
        });

        if ( !newRoute ) {
            location.href = '#/';
            return false;
        }

        document.getElementById('content').innerHTML =
            await fetch(newRoute.template)
                .then(response => response.text());

        document.getElementById('styles').setAttribute('href', newRoute.styles);
        document.getElementById('page-title').innerText = newRoute.title;
        newRoute.load();
    }

}
