/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.js"
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _router_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./router.js */ \"./src/router.js\");\n\nclass App {\n  constructor() {\n    this.router = new _router_js__WEBPACK_IMPORTED_MODULE_0__.Router();\n    window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));\n    window.addEventListener('popstate', this.handleRouteChanging.bind(this));\n  }\n  handleRouteChanging() {\n    this.router.openRoute();\n  }\n}\nnew App();\n\n//# sourceURL=webpack://l13-l15/./src/app.js?\n}");

/***/ },

/***/ "./src/components/check-results.js"
/*!*****************************************!*\
  !*** ./src/components/check-results.js ***!
  \*****************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CheckResults: () => (/* binding */ CheckResults)\n/* harmony export */ });\n/* harmony import */ var _utils_url_manager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/url-manager.js */ \"./src/utils/url-manager.js\");\n\nclass CheckResults {\n  constructor() {\n    this.userResultArray = null;\n    this.quiz = null;\n    this.correctAnswers = null;\n\n    // Смотрим текущую ссылку и ищем в ней параметр ID, а также получаем его в переменную\n    this.routeParams = _utils_url_manager_js__WEBPACK_IMPORTED_MODULE_0__.UrlManager.getQueryParams();\n\n    // // Получение данных из localStorage\n    const userResult = JSON.parse(localStorage.getItem('userResult'));\n\n    // Делаем запросы на сервер и получаем список вопросов с ответами\n    if (this.routeParams.id && userResult) {\n      const xhr = new XMLHttpRequest();\n      xhr.open('GET', `https://testologia.ru/get-quiz?id=${this.routeParams.id}`, false);\n      xhr.send();\n      if (xhr.status === 200 && xhr.responseText) {\n        try {\n          this.quiz = JSON.parse(xhr.responseText);\n\n          // Сохраняем данные в свойства объекта\n          this.userResultArray = userResult;\n          this.renderQuestions();\n          const returnButton = document.getElementById('return-to-result');\n          returnButton.addEventListener('click', function (e) {\n            e.preventDefault();\n            location.href = `#/result?id=${this.routeParams.id}&score=${this.routeParams.score}&total=${this.routeParams.total}`;\n          }.bind(this));\n        } catch (e) {\n          location.href = '#/';\n          return false;\n        }\n      } else {\n        location.href = '#/';\n      }\n    } else {\n      location.href = '#/';\n    }\n  }\n\n  // Получаем список корректных ответов на вопросы\n  loadCorrectAnswers() {\n    // Создаём новый запрос\n    const xhr = new XMLHttpRequest();\n    // Выбираем метод отправки и куда будем отправлять\n    xhr.open('GET', `https://testologia.ru/get-quiz-right?id=${this.routeParams.id}`, false);\n    // Отправляем запрос\n    xhr.send();\n\n    // Если запрос прошёл успешно и имеет какой-то ответ, иначе главная\n    if (xhr.status === 200 && xhr.responseText) {\n      try {\n        // Если можем нормально спарсить ответ, то добавляем его в переменную, иначе главная\n        this.correctAnswers = JSON.parse(xhr.responseText);\n      } catch (e) {\n        location.href = '#/';\n        return false;\n      }\n    } else {\n      location.href = '#/';\n    }\n  }\n\n  // Создаём DOM элементы\n  renderQuestions() {\n    this.loadCorrectAnswers();\n\n    // Выводим название теста\n    const testNameElement = document.getElementById('pre-title-name');\n    testNameElement.innerText = this.quiz.name;\n    const questionsElement = document.getElementById('check__questions');\n\n    // Проходим циклом по каждому вопросу\n    this.quiz.questions.forEach((question, index) => {\n      // Проверяем, что массив содержит значение вопроса, и сверяем с вопросом из цикла\n      const userAnswer = this.userResultArray.find(item => item.question_id === question.id);\n      const questionElement = document.createElement('div');\n      questionElement.className = 'check__question';\n      const questionTitleElement = document.createElement('div');\n      questionTitleElement.className = 'check__question-title';\n      questionTitleElement.innerHTML = `<span>Вопрос ${index + 1}:</span>\n                ${question.question}`;\n      const questionAnswersElement = document.createElement('div');\n      questionAnswersElement.className = 'check__question-options';\n\n      // Проходим циклом по каждому ответу, добавляя его в DOM\n      question.answers.forEach(answer => {\n        const answerElement = document.createElement('div');\n        answerElement.className = 'check__question-option';\n        const inputElement = document.createElement('input');\n        inputElement.setAttribute('type', 'radio');\n        inputElement.disabled = true;\n        inputElement.id = `answer-${answer.id}`;\n        inputElement.name = `answer-${question.id}`;\n        const labelElement = document.createElement('label');\n        labelElement.setAttribute('for', `answer-${answer.id}`);\n        labelElement.innerText = answer.answer;\n\n        // Показать правильный ответ зеленой рамкой\n        if (this.correctAnswers.includes(answer.id)) {\n          answerElement.classList.add('correct-answer');\n        }\n\n        // Проверяем, содержит ли объект \"вопрос-ответ\" сам ответ пользователя\n        if (userAnswer && userAnswer.chosenAnswerId === answer.id) {\n          // Отмечаем выбранный ответ\n          inputElement.checked = true;\n\n          // Проверяем правильный ли ответ и красим его\n          if (this.correctAnswers.includes(answer.id)) {\n            answerElement.classList.add('correct');\n          } else {\n            answerElement.classList.add('incorrect');\n          }\n        }\n        answerElement.appendChild(inputElement);\n        answerElement.appendChild(labelElement);\n        questionAnswersElement.appendChild(answerElement);\n      });\n      if (!userAnswer.chosenAnswerId) {\n        // Показываем, что пользователь пропустил вопрос\n        const skippedElement = document.createElement('div');\n        skippedElement.className = 'check__question-skipped';\n        skippedElement.textContent = 'Вопрос пропущен';\n        questionAnswersElement.prepend(skippedElement);\n      }\n      questionElement.appendChild(questionTitleElement);\n      questionElement.appendChild(questionAnswersElement);\n      questionsElement.appendChild(questionElement);\n    });\n  }\n}\n\n//# sourceURL=webpack://l13-l15/./src/components/check-results.js?\n}");

/***/ },

/***/ "./src/components/choice.js"
/*!**********************************!*\
  !*** ./src/components/choice.js ***!
  \**********************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Choice: () => (/* binding */ Choice)\n/* harmony export */ });\n/* harmony import */ var _utils_url_manager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/url-manager.js */ \"./src/utils/url-manager.js\");\n\nclass Choice {\n  constructor() {\n    this.quizzes = [];\n    this.routeParams = _utils_url_manager_js__WEBPACK_IMPORTED_MODULE_0__.UrlManager.getQueryParams();\n    _utils_url_manager_js__WEBPACK_IMPORTED_MODULE_0__.UrlManager.checkUserData(this.routeParams);\n    const xhr = new XMLHttpRequest();\n    xhr.open('GET', 'https://testologia.ru/get-quizzes', false);\n    xhr.send();\n    if (xhr.status === 200 && xhr.responseText) {\n      try {\n        this.quizzes = JSON.parse(xhr.responseText);\n      } catch (e) {\n        location.href = '#';\n      }\n      this.processQuizzes();\n    } else {\n      location.href = '#/';\n    }\n  }\n  processQuizzes() {\n    const choiceOptionsElement = document.getElementById('choice__options');\n    if (this.quizzes && this.quizzes.length) {\n      this.quizzes.forEach(quiz => {\n        const that = this;\n        const choiceOptionElement = document.createElement('div');\n        choiceOptionElement.className = 'choice__option';\n        choiceOptionElement.setAttribute('data-id', quiz.id);\n        choiceOptionElement.onclick = function () {\n          that.chooseQuiz(this);\n        };\n        const choiceOptionTextElement = document.createElement('div');\n        choiceOptionTextElement.className = 'choice__option-text';\n        choiceOptionTextElement.innerText = quiz.name;\n        const choiceOptionArrowElement = document.createElement('div');\n        choiceOptionArrowElement.className = 'choice__option-arrow';\n        const choiceOptionImageElement = document.createElement('img');\n        choiceOptionImageElement.setAttribute('src', '/images/arrow.svg');\n        choiceOptionImageElement.setAttribute('alt', 'arrow');\n        choiceOptionArrowElement.appendChild(choiceOptionImageElement);\n        choiceOptionElement.appendChild(choiceOptionTextElement);\n        choiceOptionElement.appendChild(choiceOptionArrowElement);\n        choiceOptionsElement.appendChild(choiceOptionElement);\n      });\n    }\n  }\n  chooseQuiz(element) {\n    const dataId = element.getAttribute('data-id');\n    if (dataId) {\n      location.href = `#/test?name=${this.routeParams.name}&lastName=${this.routeParams.lastName}&email=${this.routeParams.email}&id=${dataId}`;\n    }\n  }\n}\n\n//# sourceURL=webpack://l13-l15/./src/components/choice.js?\n}");

/***/ },

/***/ "./src/components/form.js"
/*!********************************!*\
  !*** ./src/components/form.js ***!
  \********************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Form: () => (/* binding */ Form)\n/* harmony export */ });\nclass Form {\n  constructor() {\n    this.agreeElement = null;\n    this.fields = [{\n      name: 'name',\n      id: 'name',\n      element: null,\n      regex: /^[a-zA-Z]+$/,\n      // regex: /^[А-Я][а-я]+\\s*$/,\n      valid: false\n    }, {\n      name: 'lastName',\n      id: 'last-name',\n      element: null,\n      regex: /^[a-zA-Z]+$/,\n      valid: false\n    }, {\n      name: 'email',\n      id: 'email',\n      element: null,\n      regex: /^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$/i,\n      valid: false\n    }];\n    const that = this;\n    this.fields.forEach(item => {\n      item.element = document.getElementById(item.id);\n      item.element.onchange = function () {\n        that.validateField.call(that, item, this);\n      };\n    });\n    this.processElement = document.getElementById('process');\n    this.processElement.onclick = function () {\n      that.processForm();\n    };\n    this.agreeElement = document.getElementById('agree');\n    this.agreeElement.onchange = function () {\n      that.validateForm();\n    };\n  }\n  validateField(field, element) {\n    if (!element.value || !element.value.match(field.regex)) {\n      element.parentNode.style.borderColor = 'red';\n      field.valid = false;\n    } else {\n      element.parentNode.removeAttribute('style');\n      field.valid = true;\n    }\n    this.validateForm();\n  }\n  validateForm() {\n    const validForm = this.fields.every(item => item.valid);\n    const isValid = this.agreeElement.checked && validForm;\n    if (isValid) {\n      this.processElement.removeAttribute('disabled');\n    } else {\n      this.processElement.setAttribute('disabled', 'disabled');\n    }\n    return isValid;\n  }\n  processForm() {\n    if (this.validateForm()) {\n      let paramString = '';\n      this.fields.forEach(item => {\n        paramString += (!paramString ? \"?\" : \"&\") + item.name + '=' + item.element.value;\n      });\n      location.href = '#/choice' + paramString;\n    }\n  }\n}\n\n//# sourceURL=webpack://l13-l15/./src/components/form.js?\n}");

/***/ },

/***/ "./src/components/result.js"
/*!**********************************!*\
  !*** ./src/components/result.js ***!
  \**********************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Result: () => (/* binding */ Result)\n/* harmony export */ });\n/* harmony import */ var _utils_url_manager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/url-manager.js */ \"./src/utils/url-manager.js\");\n\nclass Result {\n  constructor() {\n    this.routeParams = _utils_url_manager_js__WEBPACK_IMPORTED_MODULE_0__.UrlManager.getQueryParams();\n    document.getElementById('result__score').innerText = this.routeParams.score + \"/\" + this.routeParams.total;\n    const checkAnswerList = document.getElementById('answer-list');\n    checkAnswerList.onclick = e => {\n      e.preventDefault();\n      location.href = `#/check-results?id=${this.routeParams.id}&score=${this.routeParams.score}&total=${this.routeParams.total}`;\n    };\n  }\n}\n\n//# sourceURL=webpack://l13-l15/./src/components/result.js?\n}");

/***/ },

/***/ "./src/components/test.js"
/*!********************************!*\
  !*** ./src/components/test.js ***!
  \********************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Test: () => (/* binding */ Test)\n/* harmony export */ });\n/* harmony import */ var _utils_url_manager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/url-manager.js */ \"./src/utils/url-manager.js\");\n\nclass Test {\n  constructor() {\n    this.progressBarElement = null;\n    this.passButtonElement = null;\n    this.prevButtonElement = null;\n    this.nextButtonElement = null;\n    this.questionTitleElement = null;\n    this.optionsElement = null;\n    this.quiz = null;\n    this.currentQuestionIndex = 1;\n    this.userResult = [];\n    // Вызов списка вопросов\n    this.routeParams = _utils_url_manager_js__WEBPACK_IMPORTED_MODULE_0__.UrlManager.getQueryParams();\n    _utils_url_manager_js__WEBPACK_IMPORTED_MODULE_0__.UrlManager.checkUserData(this.routeParams);\n    if (this.routeParams.id) {\n      const xhr = new XMLHttpRequest();\n      xhr.open('GET', `https://testologia.ru/get-quiz?id=${this.routeParams.id}`, false);\n      xhr.send();\n      if (xhr.status === 200 && xhr.responseText) {\n        try {\n          this.quiz = JSON.parse(xhr.responseText);\n        } catch (e) {\n          location.href = '#/';\n        }\n        this.startQuiz();\n      } else {\n        location.href = '#/';\n      }\n    } else {\n      location.href = '#/';\n    }\n  }\n\n  // Вёрстка вопросов, ответов с сервера и таймера\n  startQuiz() {\n    this.progressBarElement = document.getElementById('progress-bar');\n    this.questionTitleElement = document.getElementById('test__question-title');\n    this.optionsElement = document.getElementById('test__question-options');\n    this.nextButtonElement = document.getElementById('next');\n    this.nextButtonElement.onclick = this.move.bind(this, 'next');\n    this.passButtonElement = document.getElementById('pass');\n    this.passButtonElement.onclick = this.move.bind(this, 'pass');\n    document.getElementById('pre-title').innerText = this.quiz.name;\n    this.prevButtonElement = document.getElementById('prev');\n    this.prevButtonElement.onclick = this.move.bind(this, 'prev');\n    this.prepareProgressBar();\n    this.showQuestion();\n    const timerElement = document.getElementById('timer');\n    let seconds = 59;\n    const interval = setInterval(function () {\n      seconds--;\n      timerElement.innerText = seconds;\n      if (seconds === 0) {\n        clearInterval(interval);\n        this.complete();\n      }\n    }.bind(this), 1000);\n  }\n\n  // Визуализация прогресс-бара\n  prepareProgressBar() {\n    for (let i = 0; i < this.quiz.questions.length; i++) {\n      const itemElement = document.createElement('div');\n      itemElement.className = 'test__progress-bar-item' + (i === 0 ? ' active' : '');\n      const itemCircleElement = document.createElement('div');\n      itemCircleElement.className = 'test__progress-bar-item-circle';\n      const itemTextElement = document.createElement('div');\n      itemTextElement.className = 'test__progress-bar-item-text';\n      itemTextElement.innerText = `Вопрос ${i + 1}`;\n      itemElement.appendChild(itemCircleElement);\n      itemElement.appendChild(itemTextElement);\n      this.progressBarElement.appendChild(itemElement);\n    }\n  }\n\n  // Создание вопросов и ответов и адаптации кнопок\n  showQuestion() {\n    const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];\n    this.questionTitleElement.innerHTML = `<span>Вопрос ${this.currentQuestionIndex}:</span> \n                ${activeQuestion.question}`;\n    this.optionsElement.innerHTML = '';\n    const that = this;\n    const chosenOption = this.userResult.find(item => {\n      return item.question_id === activeQuestion.id;\n    });\n    activeQuestion.answers.forEach(answer => {\n      const optionElement = document.createElement('div');\n      optionElement.className = 'test__question-option';\n      const inputId = `answer-${answer.id}`;\n      const inputElement = document.createElement('input');\n      inputElement.className = 'option-answer';\n      inputElement.setAttribute('id', inputId);\n      inputElement.setAttribute('type', 'radio');\n      inputElement.setAttribute('name', 'answer');\n      inputElement.setAttribute('value', answer.id);\n      if (chosenOption && chosenOption.chosenAnswerId === answer.id) {\n        inputElement.setAttribute('checked', 'true');\n      }\n      inputElement.onchange = function () {\n        that.chooseAnswer();\n      };\n      const labelElement = document.createElement('label');\n      labelElement.setAttribute('for', inputId);\n      labelElement.innerText = answer.answer;\n      optionElement.appendChild(inputElement);\n      optionElement.appendChild(labelElement);\n      this.optionsElement.appendChild(optionElement);\n    });\n    if (chosenOption && chosenOption.chosenAnswerId) {\n      this.nextButtonElement.removeAttribute('disabled');\n    } else {\n      this.nextButtonElement.setAttribute('disabled', true);\n    }\n    if (this.currentQuestionIndex > 1) {\n      this.prevButtonElement.removeAttribute('disabled');\n    } else {\n      this.prevButtonElement.setAttribute('disabled', true);\n    }\n    if (this.currentQuestionIndex === this.quiz.questions.length) {\n      this.nextButtonElement.innerText = 'Завершить тест';\n      // this.nextButtonElement.onclick = this.finish;\n    } else {\n      this.nextButtonElement.innerText = 'Далее';\n      //     this.nextButtonElement.onclick = this.move.bind(this, 'next');\n    }\n  }\n  chooseAnswer() {\n    this.nextButtonElement.removeAttribute('disabled');\n  }\n\n  // Адаптивные кнопки\n  move(action) {\n    const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];\n    const chosenAnswer = Array.from(document.getElementsByClassName('option-answer')).find(element => element.checked);\n    let chosenAnswerId = null;\n    if (chosenAnswer && chosenAnswer.value) {\n      chosenAnswerId = Number(chosenAnswer.value);\n    }\n    const existingResult = this.userResult.find(item => {\n      return item.question_id === activeQuestion.id;\n    });\n    if (existingResult) {\n      existingResult.chosenAnswerId = chosenAnswerId;\n    } else {\n      this.userResult.push({\n        question_id: activeQuestion.id,\n        chosenAnswerId: chosenAnswerId\n      });\n    }\n    if (action === 'next' || action === 'pass') {\n      this.currentQuestionIndex++;\n    } else {\n      this.currentQuestionIndex--;\n    }\n    if (this.currentQuestionIndex > this.quiz.questions.length) {\n      this.complete();\n      return;\n    }\n    Array.from(this.progressBarElement.children).forEach((item, index) => {\n      const currentItemIndex = index + 1;\n      item.classList.remove('complete');\n      item.classList.remove('active');\n      if (currentItemIndex === this.currentQuestionIndex) {\n        item.classList.add('active');\n      } else if (currentItemIndex < this.currentQuestionIndex) {\n        item.classList.add('complete');\n      }\n    });\n    this.showQuestion();\n  }\n\n  // Отправка ответов на сервер и получение результатов с переходом на следующую страницу\n  complete() {\n    const xhr = new XMLHttpRequest();\n    xhr.open('POST', `https://testologia.ru/pass-quiz?id=${this.routeParams.id}`, false);\n    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');\n    xhr.send(JSON.stringify({\n      name: this.routeParams.name,\n      lastName: this.routeParams.lastName,\n      email: this.routeParams.email,\n      results: this.userResult\n    }));\n    if (xhr.status === 200 && xhr.responseText) {\n      let result = null;\n      try {\n        result = JSON.parse(xhr.responseText);\n      } catch (e) {\n        location.href = '#/';\n      }\n      if (result) {\n        location.href = `#/result?id=${this.routeParams.id}&score=${result.score}&total=${result.total}`;\n      }\n    } else {\n      location.href = '#/';\n    }\n    localStorage.setItem('userResult', JSON.stringify(this.userResult));\n  }\n}\n\n//# sourceURL=webpack://l13-l15/./src/components/test.js?\n}");

/***/ },

/***/ "./src/router.js"
/*!***********************!*\
  !*** ./src/router.js ***!
  \***********************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Router: () => (/* binding */ Router)\n/* harmony export */ });\n/* harmony import */ var _components_form_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/form.js */ \"./src/components/form.js\");\n/* harmony import */ var _components_choice_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/choice.js */ \"./src/components/choice.js\");\n/* harmony import */ var _components_test_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/test.js */ \"./src/components/test.js\");\n/* harmony import */ var _components_result_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/result.js */ \"./src/components/result.js\");\n/* harmony import */ var _components_check_results_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/check-results.js */ \"./src/components/check-results.js\");\n\n\n\n\n\nclass Router {\n  constructor() {\n    this.routes = [{\n      route: '#/',\n      title: 'Главная',\n      template: 'templates/index.html',\n      styles: '/styles/index.css',\n      load: () => {}\n    }, {\n      route: '#/form',\n      title: 'Регистрация',\n      template: 'templates/form.html',\n      styles: '/styles/form.css',\n      load: () => {\n        new _components_form_js__WEBPACK_IMPORTED_MODULE_0__.Form();\n      }\n    }, {\n      route: '#/choice',\n      title: 'Выбор теста',\n      template: 'templates/choice.html',\n      styles: '/styles/choice.css',\n      load: () => {\n        new _components_choice_js__WEBPACK_IMPORTED_MODULE_1__.Choice();\n      }\n    }, {\n      route: '#/test',\n      title: 'Прохождение теста',\n      template: 'templates/test.html',\n      styles: '/styles/test.css',\n      load: () => {\n        new _components_test_js__WEBPACK_IMPORTED_MODULE_2__.Test();\n      }\n    }, {\n      route: '#/result',\n      title: 'Результаты',\n      template: 'templates/result.html',\n      styles: '/styles/result.css',\n      load: () => {\n        new _components_result_js__WEBPACK_IMPORTED_MODULE_3__.Result();\n      }\n    }, {\n      route: '#/check-results',\n      title: 'Проверить результаты',\n      template: 'templates/check-results.html',\n      styles: '/styles/check-results.css',\n      load: () => {\n        new _components_check_results_js__WEBPACK_IMPORTED_MODULE_4__.CheckResults();\n      }\n    }];\n  }\n  async openRoute() {\n    const currentHash = location.hash || '#/';\n    const newRoute = this.routes.find(item => {\n      return item.route === currentHash.split('?')[0];\n    });\n    if (!newRoute) {\n      location.href = '#/';\n      return false;\n    }\n    document.getElementById('content').innerHTML = await fetch(newRoute.template).then(response => response.text());\n    document.getElementById('styles').setAttribute('href', newRoute.styles);\n    document.getElementById('page-title').innerText = newRoute.title;\n    newRoute.load();\n  }\n}\n\n//# sourceURL=webpack://l13-l15/./src/router.js?\n}");

/***/ },

/***/ "./src/utils/url-manager.js"
/*!**********************************!*\
  !*** ./src/utils/url-manager.js ***!
  \**********************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   UrlManager: () => (/* binding */ UrlManager)\n/* harmony export */ });\nclass UrlManager {\n  static getQueryParams() {\n    const qs = document.location.hash.split('+').join(' ');\n    let params = {},\n      tokens,\n      re = /[?&]([^=]+)=([^&]*)/g;\n    while (tokens = re.exec(qs)) {\n      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);\n    }\n    return params;\n  }\n  static checkUserData(params) {\n    if (!params.name || !params.lastName || !params.email) {\n      location.href = '#/';\n      return false;\n    }\n  }\n}\n\n//# sourceURL=webpack://l13-l15/./src/utils/url-manager.js?\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app.js");
/******/ 	
/******/ })()
;