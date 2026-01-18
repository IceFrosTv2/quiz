import { UrlManager } from "../utils/url-manager.js";

export class Result {

    constructor () {
        this.routeParams = UrlManager.getQueryParams();

        document.getElementById('result__score').innerText = this.routeParams.score + "/" + this.routeParams.total;

        const checkAnswerList = document.getElementById('answer-list')
        checkAnswerList.onclick =  (e) => {
            e.preventDefault();
            location.href = `#/check-results?id=${this.routeParams.id}&score=${this.routeParams.score}&total=${this.routeParams.total}`
        }
    }
}
