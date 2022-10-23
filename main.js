document.addEventListener('DOMContentLoaded', () => {

    const gameField = document.querySelector('.game__field');
    const buttonStart = document.querySelector('.form__button');
    buttonStart.disabled = true;
    const inputNumberCards = document.querySelector('.form__input');
    const win = document.querySelector('.win');
    const buttonNextGame = document.querySelector('.win__btn');

    let allCards = [];
    let hasFlippedCard = false;
    let firstCard, secondCard;
    let lastGame;

    const cardWidth = 90;
    const cardHeight = 100;
    const cardMargin = 4;


    function createCard() {
        const cardBack = document.createElement('div');
        cardBack.classList.add('card__back');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card__front');

        const cardFlipper = document.createElement('div');
        cardFlipper.classList.add('card__flipper');
        cardFlipper.append(cardFront);
        cardFlipper.append(cardBack);


        const card = document.createElement('div');
        card.classList.add('card');
        card.append(cardFlipper);
        card.style.width = `${ cardWidth }px`;
        card.style.height = `${ cardHeight }px`;

        allCards.push(card);
    };

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        };
    };

    function checkMatch() {
        blockAllCards(allCards);
        if (firstCard.querySelector('.card__front').style.background === secondCard.querySelector('.card__front').style.background) {
            setTimeout(() => {
                firstCard.classList.add('matched')
                secondCard.classList.add('matched')
                winGame(allCards);
                unblockAllCards(allCards);
            }, 600);
            return
        }

        setTimeout(() => {
            deleteFlip(firstCard);
            deleteFlip(secondCard);
            unblockAllCards(allCards);
        }, 800);
    };

    function winGame(array) {
        if (array.every(card => card.classList.contains('matched'))) {
            setTimeout(() => {
                win.classList.remove('display-none');
            }, 600);
        };
    };

    function blockAllCards(array) {
        array.forEach((card) => {
            card.style.cursor = 'wait'
            card.removeEventListener('click', flipCard)
        });
    };

    function unblockAllCards(array) {
        array.forEach((card) => {
            card.style.cursor = 'auto'
            if (!card.classList.contains('matched')) {
                card.style.cursor = 'pointer'
                card.addEventListener('click', flipCard)
            }
        });
    };

    function deleteFlip(element) {
        element.firstChild.classList.remove('flip');
    };

    function deleteAllCards(array) {
        if (array.length > 0) {
            array.forEach((card) => {
                card.remove()
            });
            allCards = []
        };
    };

    const flipCard = (event) => {
        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = event.currentTarget;
        } else {
            secondCard = event.currentTarget;
            hasFlippedCard = false;
            checkMatch();
        };
        event.currentTarget.removeEventListener('click', flipCard)
        event.currentTarget.firstChild.classList.add('flip');
    };


    function createGame(numberCards) {

        deleteAllCards(allCards);

        gameField.style.width = `${ Math.sqrt(numberCards) * (cardWidth + cardMargin * 2) }px`;
        gameField.style.height = `${ Math.sqrt(numberCards) * (cardHeight + cardMargin * 2) }px`;

        for (let i = 0; i < numberCards; i++) {
            createCard();
        };


        allCards.forEach(card => {
            card.querySelector('.card__front').style.background = `url('./img/icon${ Math.round((allCards.indexOf(card) + 1) / 2) }.png') no-repeat center center #FBFED1`;
        })


        shuffleArray(allCards);
        allCards.forEach(card => {
            gameField.append(card)
            card.addEventListener('click', flipCard);
        });
    };

    inputNumberCards.addEventListener('input', () => {
        buttonStart.disabled = inputNumberCards.value ? false : true;
    });

    buttonStart.addEventListener('click', (e) => {
        e.preventDefault();
        if (inputNumberCards.value % 2 === 0 && inputNumberCards.value > 2 && inputNumberCards.value < 10) {
            createGame(inputNumberCards.value * inputNumberCards.value);
            lastGame = inputNumberCards.value;
        } else {
            alert('Invalid number of cards');
            createGame(16);
            lastGame = 4;
        };
        inputNumberCards.value = '';
        buttonStart.disabled = true;
    });

    buttonNextGame.addEventListener('click', () => {
        setTimeout(() => {
            win.classList.add('display-none');
            createGame(lastGame * lastGame);
        }, 200);
    });

});