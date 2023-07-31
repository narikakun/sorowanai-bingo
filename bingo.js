let nowBingoCard, gameBingoArray, nowR = 0, rouletteTimer, nowRoulette = false, loopCounter = 0;
const bingoCard = document.getElementById("bingoCard");
const rouletteCard = document.getElementById("rouletteCard");
const startButton = document.getElementById("start");
const controlText = document.getElementById("controlText");

const Kakuritu = 25;
function main () {
    nowBingoCard = createBingoCard();
    renderBingoCard(nowBingoCard);
    gameBingoArray = new Array(Kakuritu).fill(null).map((_, i) => i + 1);
    renderRouletteCard(gameBingoArray);
}

function renderBingoCard (card) {
    bingoCard.innerHTML = "";
    for (const cardElm1 of card) {
        let elmStr = "<tr>";
        for (const cardElm2 of cardElm1) {
            elmStr += `<th${cardElm2<0 || cardElm2 == 'Free'?' class="active"':''}>${String(cardElm2).replace("-","")}</th>`;
        }
        elmStr += "</tr>";
        bingoCard.innerHTML += elmStr;
    }
}

function renderRouletteCard (array) {
    const result = [];
    const rows = Math.ceil(array.length / 5);

    for (let i = 0; i < rows; i++) {
        const row = array.slice(i * 5, (i + 1) * 5);
        result.push(row);
    }

    rouletteCard.innerHTML = "";
    for (const cardElm1 of result) {
        let elmStr = "<tr>";
        for (const cardElm2 of cardElm1) {
            elmStr += `<th${cardElm2==gameBingoArray[nowR]?' class="active"':''}>${cardElm2}</th>`;
        }
        elmStr += "</tr>";
        rouletteCard.innerHTML += elmStr;
    }
}

function createBingoCard () {
    let bingoArray = new Array(Kakuritu).fill(null).map((_, i) => i + 1);
    let bingoCard  = Array.from(new Array(5), () =>
        new Array(5).fill(0).map(() => {
            const index = Math.floor(Math.random() * bingoArray.length);
            const bingo = bingoArray[index];
            bingoArray.splice(index, 1);
            return bingo;
        })
    );

    bingoCard[2][2] = "Free";
    return bingoCard;
}

function startRoulette () {
    nowRoulette = true;
    rouletteTimer = setInterval(() => {
        nowR++;
        if (gameBingoArray.length <= nowR) nowR = 0;
        renderRouletteCard(gameBingoArray);
    }, 50);
}

function stopRoulette () {
    clearInterval(rouletteTimer);
    nowRoulette = false;
    let stopTimer = setInterval(() => {
        nowR++;
        if (gameBingoArray.length <= nowR) nowR = 0;
        renderRouletteCard(gameBingoArray);
    }, 100);
    let stopS = Math.floor( Math.random() * (2000 + 1 - 1000) ) + 1000 ;
    setTimeout(() => {
        clearInterval(stopTimer);
        loopBingoNoNo();
        function loopBingoNoNo () {
            const copyBingoCard = JSON.parse(JSON.stringify(nowBingoCard));
            let testC = isBingo(copyBingoCard);
            if (testC) {
                loopCounter++;
                if (loopCounter > 10) {
                    startButton.hidden = true;
                    controlText.innerText = "G A M E  O V E R . . .";
                    return;
                }
                nowR++;
                if (gameBingoArray.length <= nowR) nowR = 0;
                setTimeout(() => {
                    renderRouletteCard(gameBingoArray);
                    loopBingoNoNo();
                }, 100);
            } else {
                loopCounter = 0;
                controlText.innerText = `${gameBingoArray[nowR]} が出ました！`;
                for (const cardKey1 in nowBingoCard) {
                    for (const cardKey2 in nowBingoCard[cardKey1]) {
                        if (gameBingoArray[nowR] == nowBingoCard[cardKey1][cardKey2]) {
                            nowBingoCard[cardKey1][cardKey2] = -nowBingoCard[cardKey1][cardKey2];
                        }
                    }
                }
                renderBingoCard(nowBingoCard);
                gameBingoArray = gameBingoArray.filter(f => f !== gameBingoArray[nowR]);
                startButton.hidden = false;
            }
        }
    }, stopS);
}

function startOnButton () {
    if (startButton.hidden) return;
    if (!nowRoulette) {
        startRoulette();
        startButton.innerText = "止める";
    } else {
        stopRoulette();
        startButton.hidden = true;
        startButton.innerText = "回す";
    }
}

window.document.onkeydown = function (event) {
    if (event.key === "Enter") startOnButton();
}
function isBingo(board) {
    for (const cardKey1 in board) {
        for (const cardKey2 in board[cardKey1]) {
            if (gameBingoArray[nowR] == board[cardKey1][cardKey2]) {
                board[cardKey1][cardKey2] = -board[cardKey1][cardKey2];
            }
        }
    }
    // ビンゴ判定用の関数
    function checkBingoLine(line) {
        return line.every((number) => number < 0 || number == 'Free');
    }

    // 縦のビンゴをチェック
    for (let col = 0; col < 5; col++) {
        if (checkBingoLine(board.map(row => row[col]))) {
            return true;
        }
    }

    // 横のビンゴをチェック
    for (let row = 0; row < 5; row++) {
        if (checkBingoLine(board[row])) {
            return true;
        }
    }

    // 斜めのビンゴをチェック
    if (checkBingoLine([board[0][0], board[1][1], board[2][2], board[3][3], board[4][4]])) {
        return true;
    }

    if (checkBingoLine([board[0][4], board[1][3], board[2][2], board[3][1], board[4][0]])) {
        return true;
    }

    return false;
}

main();