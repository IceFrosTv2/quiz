(function () {
    const Result = {
        init() {
            const url = new URL(location.href);
            const testId = url.searchParams.get('id');
            const score = url.searchParams.get('score');
            const total = url.searchParams.get('total');

            document.getElementById('result__score').innerText = score + "/" + total;

            const checkAnswerList = document.getElementById('answer-list')
            checkAnswerList.onclick = function (e) {
                e.preventDefault();
                location.href = `check-results.html?id=${testId}&score=${score}&total=${total}`
            }
        },
    }

    Result.init();
}) ()
