const postApi = `https://words.dev-apis.com/validate-word`;
const getApi = `https://words.dev-apis.com/word-of-the-day`;
const main = document.querySelector("body");
const header = document.querySelector(".head");
const loader = document.querySelector(".hidden");
const ANSWER_LENGTH = 5;
let row = document.querySelectorAll(".cell-1");

let ans = "", guess = 1, letter = 0;
main.addEventListener("keydown", async (el) => {
    if (isLetter(el.key) && ans.length <= ANSWER_LENGTH-1) {
        row[letter].textContent = (el.key).toUpperCase();
        ans += el.key;
        letter++;
    } else if (el.key === "Backspace" && ans.length >= 1 && ans.length <= ANSWER_LENGTH) {
        letter--;
        row[letter].textContent = "";
        ans = ans.substring(0, ans.length - 1);
    } else if (el.key === "Enter" && ans.length === ANSWER_LENGTH && guess <= ANSWER_LENGTH+1) {
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            row[i].classList.remove("wrong-word");
        }
        loader.classList.add("show");
        isValidWord(ans).then((valid) => {
            loader.classList.remove("show");
            if (valid) {
                loader.classList.add("show");
                validateWord(ans).then(el => {
                    loader.classList.remove("show");
                    if (el[0] === 1) {
                        ans += 'a';
                    }
                    else if (guess === ANSWER_LENGTH+1 && el[0] !== 1) {
                        alert(`you lose, the word was ${el[1]}`);
                        ans += 'a';
                    }
                    else {
                        ans = "";
                        guess++;
                        row = document.querySelectorAll(`.cell-${guess}`);
                        letter = 0;

                    }
                })
            }
            else {
                for (let i = 0; i < ANSWER_LENGTH; i++) {
                    row[i].classList.add("wrong-word");
                }
            }
        })
    }
    else el.preventDefault();
})
function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}
async function checkWord(guessWord) {
    const promise = await fetch(postApi, {
        method: "POST",
        body: JSON.stringify({
            "word": guessWord
        })
    });
    const processedResponse = await promise.json();
    return processedResponse.validWord;
}
async function isValidWord(guessWord) {
    return await checkWord(guessWord);
}
async function validateWord(guessWord) {
    let flag;
    const promise = await fetch(getApi);
    const data = await promise.json();
    let copy = data.word;
    if (guessWord === data.word) {
        flag = 1;
        GusssCorrect();
    } else {
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (guessWord[i] === copy[i]) {
                row[i].classList.add("correct");
                copy = copy.replace(guessWord[i],' ');
            } else if (copy.includes(guessWord[i])) {
                row[i].classList.add("out-place");
                copy = copy.replace(guessWord[i], ' ');
            } else row[i].classList.add("not-letter");
        }
        flag = 0;
    }
    return [flag, data.word];
}
function GusssCorrect() {
    for (let i = 0; i < ANSWER_LENGTH; i++) {
        row[i].classList.add("correct");
    }
    alert(`you win`);
    header.classList.add("rainbow-victory");
}