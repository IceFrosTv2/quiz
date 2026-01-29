import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "../services/custom-http.js";
import config from "../../config/config.js";
import { Auth } from "../services/auth.js";

export class CheckResults {

    constructor () {
        this.quiz = null;
        this.userInfo = Auth.getUserInfo();

        // Смотрим текущую ссылку и ищем в ней параметр ID, а также получаем его в переменную
        this.routeParams = UrlManager.getQueryParams();

        this.init();
    }

    async init () {

        try {
            const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + this.userInfo.userId);
            if ( result ) {
                if ( result.error ) {
                    throw new Error(result.error);
                }
                this.quiz = result.test;
                this.renderQuestions();
                const returnButton = document.getElementById('return-to-result');
                returnButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    location.href = `#/result?id=${this.routeParams.id}`;
                });
            }
        } catch (error) {
            location.href = `#/result?id=${this.routeParams.id}`;
            return console.log(error)
        }
    }

    // Создаём DOM элементы
    renderQuestions () {

        // Выводим название теста
        const testNameElement = document.getElementById('pre-title-name');
        testNameElement.innerText = this.quiz.name;

        if ( this.userInfo && this.userInfo.fullName && this.userInfo.email ) {
            const userNameElement = document.getElementById('nameAndEmail');
            userNameElement.innerText = this.userInfo.fullName + ', ' + this.userInfo.email;
        }

        const questionsElement = document.getElementById('check__questions');

        // Проходим циклом по каждому вопросу
        this.quiz.questions.forEach((question, index) => {

            const questionElement = document.createElement('div');
            questionElement.className = 'check__question';

            const questionTitleElement = document.createElement('div');
            questionTitleElement.className = 'check__question-title';
            questionTitleElement.innerHTML = `<span>Вопрос ${index + 1}:</span>
                ${question.question}`;

            const questionAnswersElement = document.createElement('div');
            questionAnswersElement.className = 'check__question-options';

            // Проверяем, выбрал ли пользователь какой-то ответ
            const hasUserAnswer = question.answers.some(item => item.hasOwnProperty('correct'));

            // Показываем, что пользователь пропустил вопрос
            if ( !hasUserAnswer ) {
                const skippedElement = document.createElement('div');
                skippedElement.className = 'check__question-skipped';
                skippedElement.textContent = 'Вопрос пропущен';
                questionAnswersElement.prepend(skippedElement);
            }

            // Проходим циклом по каждому ответу, добавляя его в DOM
            question.answers.forEach(answer => {
                const answerElement = document.createElement('div');
                answerElement.className = 'check__question-option';

                const inputElement = document.createElement('input');
                inputElement.setAttribute('type', 'radio');
                inputElement.disabled = true;

                const labelElement = document.createElement('label');
                labelElement.innerText = answer.answer;

                // Красим ответ в цвет, в зависимости от правильности.
                // Если объект содержит свойство correct, то проверяем значение
                if ( answer.hasOwnProperty('correct') ) {
                    inputElement.checked = true;
                    if ( answer.correct ) {
                        answerElement.classList.add('correct');
                    } else {
                        answerElement.classList.add('incorrect');
                    }
                }

                answerElement.appendChild(inputElement);
                answerElement.appendChild(labelElement);
                questionAnswersElement.appendChild(answerElement);
            });

            questionElement.appendChild(questionTitleElement);
            questionElement.appendChild(questionAnswersElement);
            questionsElement.appendChild(questionElement);
        })
    }
}
