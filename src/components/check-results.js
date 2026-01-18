import { UrlManager } from "../utils/url-manager.js";

export class CheckResults {

    constructor () {
        this.userResultArray = null;
        this.quiz = null;
        this.correctAnswers = null;

        // Смотрим текущую ссылку и ищем в ней параметр ID, а также получаем его в переменную
        this.routeParams = UrlManager.getQueryParams();

        // // Получение данных из localStorage
        const userResult = JSON.parse(localStorage.getItem('userResult'));

        // Делаем запросы на сервер и получаем список вопросов с ответами
        if ( this.routeParams.id && userResult ) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `https://testologia.ru/get-quiz?id=${this.routeParams.id}`, false);
            xhr.send();
            if ( xhr.status === 200 && xhr.responseText ) {
                try {
                    this.quiz = JSON.parse(xhr.responseText);

                    // Сохраняем данные в свойства объекта
                    this.userResultArray = userResult;

                    this.renderQuestions();

                    const returnButton = document.getElementById('return-to-result');
                    returnButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        location.href = `#/result?id=${ this.routeParams.id}&score=${ this.routeParams.score}&total=${ this.routeParams.total}`;
                    }.bind(this));
                } catch (e) {
                    location.href = '#/';
                    return false;
                }
            } else {
                location.href = '#/';
            }
        } else {
            location.href = '#/';
        }
    }

    // Получаем список корректных ответов на вопросы
    loadCorrectAnswers () {
        // Создаём новый запрос
        const xhr = new XMLHttpRequest();
        // Выбираем метод отправки и куда будем отправлять
        xhr.open('GET', `https://testologia.ru/get-quiz-right?id=${ this.routeParams.id}`, false);
        // Отправляем запрос
        xhr.send();

        // Если запрос прошёл успешно и имеет какой-то ответ, иначе главная
        if ( xhr.status === 200 && xhr.responseText ) {
            try {
                // Если можем нормально спарсить ответ, то добавляем его в переменную, иначе главная
                this.correctAnswers = JSON.parse(xhr.responseText);
            } catch (e) {
                location.href = '#/';
                return false;
            }
        } else {
            location.href = '#/';
        }
    }

    // Создаём DOM элементы
    renderQuestions () {
        this.loadCorrectAnswers();

        // Выводим название теста
        const testNameElement = document.getElementById('pre-title-name');
        testNameElement.innerText = this.quiz.name;

        const questionsElement = document.getElementById('check__questions');

        // Проходим циклом по каждому вопросу
        this.quiz.questions.forEach((question, index) => {
            // Проверяем, что массив содержит значение вопроса, и сверяем с вопросом из цикла
            const userAnswer = this.userResultArray.find(item => item.question_id === question.id)

            const questionElement = document.createElement('div');
            questionElement.className = 'check__question';

            const questionTitleElement = document.createElement('div');
            questionTitleElement.className = 'check__question-title';
            questionTitleElement.innerHTML = `<span>Вопрос ${index + 1}:</span>
                ${question.question}`;

            const questionAnswersElement = document.createElement('div');
            questionAnswersElement.className = 'check__question-options';

            // Проходим циклом по каждому ответу, добавляя его в DOM
            question.answers.forEach(answer => {
                const answerElement = document.createElement('div');
                answerElement.className = 'check__question-option';

                const inputElement = document.createElement('input');
                inputElement.setAttribute('type', 'radio');
                inputElement.disabled = true;
                inputElement.id = `answer-${answer.id}`;
                inputElement.name = `answer-${question.id}`;

                const labelElement = document.createElement('label');
                labelElement.setAttribute('for', `answer-${answer.id}`);
                labelElement.innerText = answer.answer;

                // Показать правильный ответ зеленой рамкой
                if ( this.correctAnswers.includes(answer.id) ) {
                    answerElement.classList.add('correct-answer');
                }

                // Проверяем, содержит ли объект "вопрос-ответ" сам ответ пользователя
                if ( userAnswer && userAnswer.chosenAnswerId === answer.id ) {
                    // Отмечаем выбранный ответ
                    inputElement.checked = true;

                    // Проверяем правильный ли ответ и красим его
                    if ( this.correctAnswers.includes(answer.id) ) {
                        answerElement.classList.add('correct');
                    } else {
                        answerElement.classList.add('incorrect');
                    }
                }


                answerElement.appendChild(inputElement);
                answerElement.appendChild(labelElement);
                questionAnswersElement.appendChild(answerElement);
            });

            if ( !userAnswer.chosenAnswerId ) {
                // Показываем, что пользователь пропустил вопрос
                const skippedElement = document.createElement('div');
                skippedElement.className = 'check__question-skipped';
                skippedElement.textContent = 'Вопрос пропущен';
                questionAnswersElement.prepend(skippedElement);
            }
            questionElement.appendChild(questionTitleElement);
            questionElement.appendChild(questionAnswersElement);
            questionsElement.appendChild(questionElement);
        })
    }
}
