import { UrlManager } from "../utils/url-manager.js";

export class Choice {

    constructor () {
        this.quizzes = [];
        this.routeParams = UrlManager.getQueryParams();
        UrlManager.checkUserData(this.routeParams);

        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://testologia.ru/get-quizzes', false);
        xhr.send();

        if ( xhr.status === 200 && xhr.responseText ) {
            try {
                this.quizzes = JSON.parse(xhr.responseText)
            } catch (e) {
                location.href = '#';
            }
            this.processQuizzes();
        } else {
            location.href = '#/';
        }
    }

    processQuizzes () {
        const choiceOptionsElement = document.getElementById('choice__options');
        if ( this.quizzes && this.quizzes.length ) {
            this.quizzes.forEach((quiz) => {
                const that = this;
                const choiceOptionElement = document.createElement('div');
                choiceOptionElement.className = 'choice__option';
                choiceOptionElement.setAttribute('data-id', quiz.id);
                choiceOptionElement.onclick = function () {
                    that.chooseQuiz(this);
                }

                const choiceOptionTextElement = document.createElement('div');
                choiceOptionTextElement.className = 'choice__option-text';
                choiceOptionTextElement.innerText = quiz.name;

                const choiceOptionArrowElement = document.createElement('div');
                choiceOptionArrowElement.className = 'choice__option-arrow';

                const choiceOptionImageElement = document.createElement('img');
                choiceOptionImageElement.setAttribute('src', '/images/arrow.svg');
                choiceOptionImageElement.setAttribute('alt', 'arrow');

                choiceOptionArrowElement.appendChild(choiceOptionImageElement);
                choiceOptionElement.appendChild(choiceOptionTextElement);
                choiceOptionElement.appendChild(choiceOptionArrowElement);

                choiceOptionsElement.appendChild(choiceOptionElement);
            })
        }
    }

    chooseQuiz (element) {
        const dataId = element.getAttribute('data-id');
        if ( dataId ) {
            location.href = `#/test?name=${this.routeParams.name}&lastName=${this.routeParams.lastName}&email=${this.routeParams.email}&id=${dataId}`;
        }
    }
}
