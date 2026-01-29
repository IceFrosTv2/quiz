import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "../services/custom-http.js";
import config from "../../config/config.js";
import { Auth } from "../services/auth.js";

export class Test {

    constructor () {

        this.progressBarElement = null;
        this.passButtonElement = null;
        this.prevButtonElement = null;
        this.nextButtonElement = null;
        this.questionTitleElement = null;
        this.optionsElement = null;
        this.quiz = null;
        this.currentQuestionIndex = 1;
        this.userResult = [];
        // Вызов списка вопросов
        this.routeParams = UrlManager.getQueryParams();
        this.init();
    }

    async init () {
        if ( this.routeParams.id ) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id);
                if ( result ) {
                    if ( result.error ) {
                        throw new Error(result.error);
                    }
                    this.quiz = result;
                    this.startQuiz();
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    // Вёрстка вопросов, ответов с сервера и таймера
    startQuiz () {
        this.progressBarElement = document.getElementById('progress-bar');
        this.questionTitleElement = document.getElementById('test__question-title');
        this.optionsElement = document.getElementById('test__question-options');
        this.nextButtonElement = document.getElementById('next');
        this.nextButtonElement.onclick = this.move.bind(this, 'next');
        this.passButtonElement = document.getElementById('pass');
        this.passButtonElement.onclick = this.move.bind(this, 'pass');
        document.getElementById('pre-title').innerText = this.quiz.name;

        this.prevButtonElement = document.getElementById('prev');
        this.prevButtonElement.onclick = this.move.bind(this, 'prev');

        this.prepareProgressBar();
        this.showQuestion();

        const timerElement = document.getElementById('timer');
        let seconds = 59;
        this.interval = setInterval(function () {
            seconds--;
            timerElement.innerText = seconds;
            if ( seconds === 0 ) {
                clearInterval(this.interval);
                this.complete();
            }
        }.bind(this), 1000)
    }

    // Визуализация прогресс-бара
    prepareProgressBar () {
        for ( let i = 0; i < this.quiz.questions.length; i++ ) {
            const itemElement = document.createElement('div');
            itemElement.className = 'test__progress-bar-item' + (i === 0 ? ' active' : '');

            const itemCircleElement = document.createElement('div');
            itemCircleElement.className = 'test__progress-bar-item-circle';

            const itemTextElement = document.createElement('div');
            itemTextElement.className = 'test__progress-bar-item-text';
            itemTextElement.innerText = `Вопрос ${i + 1}`;

            itemElement.appendChild(itemCircleElement);
            itemElement.appendChild(itemTextElement);

            this.progressBarElement.appendChild(itemElement);
        }
    }

    // Создание вопросов и ответов и адаптации кнопок
    showQuestion () {
        const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];
        this.questionTitleElement.innerHTML =
            `<span>Вопрос ${this.currentQuestionIndex}:</span> 
                ${activeQuestion.question}`;

        this.optionsElement.innerHTML = '';
        const that = this;
        const chosenOption = this.userResult.find(item => {
            return item.question_id === activeQuestion.id
        });
        activeQuestion.answers.forEach(answer => {
            const optionElement = document.createElement('div');
            optionElement.className = 'test__question-option';

            const inputId = `answer-${answer.id}`;
            const inputElement = document.createElement('input');
            inputElement.className = 'option-answer';
            inputElement.setAttribute('id', inputId);
            inputElement.setAttribute('type', 'radio');
            inputElement.setAttribute('name', 'answer');
            inputElement.setAttribute('value', answer.id);
            if ( chosenOption && chosenOption.chosenAnswerId === answer.id ) {
                inputElement.setAttribute('checked', 'true');
            }

            inputElement.onchange = function () {
                that.chooseAnswer();
            }

            const labelElement = document.createElement('label');
            labelElement.setAttribute('for', inputId);
            labelElement.innerText = answer.answer;

            optionElement.appendChild(inputElement);
            optionElement.appendChild(labelElement);

            this.optionsElement.appendChild(optionElement);
        });
        if ( chosenOption && chosenOption.chosenAnswerId ) {
            this.nextButtonElement.removeAttribute('disabled');
        } else {
            this.nextButtonElement.setAttribute('disabled', true);
        }
        if ( this.currentQuestionIndex > 1 ) {
            this.prevButtonElement.removeAttribute('disabled');
        } else {
            this.prevButtonElement.setAttribute('disabled', true);
        }

        if ( this.currentQuestionIndex === this.quiz.questions.length ) {
            this.nextButtonElement.innerText = 'Завершить тест';
            // this.nextButtonElement.onclick = this.finish;
        } else {
            this.nextButtonElement.innerText = 'Далее';
            //     this.nextButtonElement.onclick = this.move.bind(this, 'next');
        }
    }

    chooseAnswer () {
        this.nextButtonElement.removeAttribute('disabled');
    }

    // Адаптивные кнопки
    move (action) {
        const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];
        const chosenAnswer = Array.from(document.getElementsByClassName('option-answer'))
            .find((element) => element.checked);

        let chosenAnswerId = null;
        if ( chosenAnswer && chosenAnswer.value ) {
            chosenAnswerId = Number(chosenAnswer.value);
        }

        const existingResult = this.userResult.find(item => {
            return item.question_id === activeQuestion.id
        });
        if ( existingResult ) {
            existingResult.chosenAnswerId = chosenAnswerId;
        } else {
            this.userResult.push({
                question_id: activeQuestion.id,
                chosenAnswerId: chosenAnswerId,
            });
        }

        if ( action === 'next' || action === 'pass' ) {
            this.currentQuestionIndex++;
        } else {
            this.currentQuestionIndex--;
        }

        if ( this.currentQuestionIndex > this.quiz.questions.length ) {
            clearInterval(this.interval);
            this.complete();
            return;
        }

        Array.from(this.progressBarElement.children).forEach((item, index) => {
            const currentItemIndex = index + 1;
            item.classList.remove('complete');
            item.classList.remove('active');

            if ( currentItemIndex === this.currentQuestionIndex ) {
                item.classList.add('active');
            } else if ( currentItemIndex < this.currentQuestionIndex ) {
                item.classList.add('complete');
            }
        });

        this.showQuestion();
    }

    // Отправка ответов на сервер и получение результатов с переходом на следующую страницу
    async complete () {
        const userInfo = Auth.getUserInfo();
        if ( !userInfo ) {
            location.href = '#/login'
        }

        try {
            const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/pass', 'POST', {
                userId: userInfo.userId,
                results: this.userResult,
            })

            if ( result ) {
                if ( result.error ) {
                    throw new Error(result.error)
                }
                location.href = `#/result?id=${this.routeParams.id}`;
            }

        } catch (error) {
            console.log(error)
        }
    }
}
