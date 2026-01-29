import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "../services/custom-http.js";
import config from "../../config/config.js";
import { Auth } from "../services/auth.js";

export class Choice {

    constructor () {
        this.quizzes = [];
        this.routeParams = UrlManager.getQueryParams();
        this.testResults = null;
        this.init();
    }

    async init () {
        try {
            const result = await CustomHttp.request(config.host + '/tests');
            if ( result ) {
                if ( result.error ) {
                    throw new Error(result.error);
                }
                this.quizzes = result;
            }
        } catch (error) {
            return console.log(error)
        }

        const userInfo = Auth.getUserInfo();
        if ( userInfo ) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/results?userId=' + userInfo.userId);
                if ( result ) {
                    if ( result.error ) {
                        throw new Error(result.error);
                    }
                    this.testResults = result;
                }
            } catch (error) {
                return console.log(error)
            }
        }

        this.processQuizzes();
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

                const result = this.testResults.find(item => item.testId === quiz.id)
                if ( result ) {
                    const choiceOptionResultElement = document.createElement('a');
                    choiceOptionResultElement.className = 'choice__option-result';
                    choiceOptionResultElement.setAttribute('href', `#/result?id=${result.testId}`);
                    choiceOptionResultElement.innerHTML = `<div>Результат</div> <div>${result.score}/${result.total}</div>`;

                    choiceOptionElement.appendChild(choiceOptionResultElement);

                }

                const choiceOptionImageElement = document.createElement('img');
                choiceOptionImageElement.setAttribute('src', 'images/arrow.svg');
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
            location.href = `#/test?id=${dataId}`;
        }
    }
}
