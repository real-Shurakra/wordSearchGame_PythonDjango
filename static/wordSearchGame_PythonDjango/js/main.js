class wordsearchGame {
    constructor(maxRounds) {
        this.currentPlayRound = 0;
        this.maxRounds = maxRounds;
        this.setRoundDisplay();
        this.timeAtStart = 0;
        this.timeAtEnd = 0;
        this.timeUsed = '';
        this.searchWord = '';
    }

    #getDataFormURL(url, question){
        try{
             let xml = new XMLHttpRequest();
            xml.open('POST', url, false);
            xml.send(question);
            let rowResponse = xml.responseText;
            let response = JSON.parse(rowResponse);
            if (!response['rc']){
                throw(response['rv'])
            }
            else{
                return {
                    'rc' : true,
                    'rv' : response['rv']
                }
            }
        }
        catch (error){
            console.warn(error);
            return {
                'rc':false,
                'rv':error
            }
        }
    
}

    #getWord() {
        try{
            let question = new FormData();
            question.append('mode', 'getNewWord');
            let response = this.#getDataFormURL('getNewWord', question)
            if (response['rc']) {
                return {
                    'rc':true,
                    'rv':response['rv']
                }
            }
            else{throw(response['rv'])}
        }
        catch (error){
            console.warn(error);
            return {
                'rc':false,
                'rv':error
            }
        }
    }
    
    #formatNumber(number) {
        if (number <= 9){
            return '0' + number;
        }
        else{
            return '' + number;
        }
    }

    startGame() {
        try{
            let newWord = this.#getWord();
            if (newWord['rc']){this.searchWord = newWord['rv']}
            else {throw(newWord['rv'])}
            	
            
            
            
            console.log('I didn\'t created this game for you to cheat! Take this and die: ' + this.searchWord);
        }
        catch (error){
            let notify = new Notify();
            notify.setText(notify.noteType.fehler, '<strong>Schwerer Fehler</strong><br>' + error)
            notify.makeModal();
            notify.showModal();
        }

        //this.makeHighScoreList();
        //this.counterStart();
    }
    
    checkWord(word) {
        try{
            let checkThisWord = this.checkWordExists(word);
            if (checkThisWord){
                for (let i = 0; i < word.length; i++) {
                    this.checkWordLetter(this.searchWord, word[i], this.currentPlayRound, i);
                }
            }
            else{
                let notify = new Notify();
                notify.setText(notify.noteType.hinweis, word + ' ist nicht in der Wordliste')
                notify.makeModal();
                notify.showModal();
                return false;
            }

            if (word === this.searchWord){
                let notify = new Notify();
                notify.setText(notify.noteType.erfolg, '<strong>Du hast gewonnen.</strong><br>Zum neu spielen F5.')
                notify.makeModal();
                notify.showModal();
            }

            return true;
        }
        catch (error){
            console.warn(error);
        }
    }

    checkWordExists(word) {
        try{
            let words = Array();
            words = this.loadWords();
            let existCheck = words.includes(word);
            return existCheck;
        }
        catch (error){
            console.warn(error);
        }
    }

    checkWordLetter(word, letter, wordNumber, letterNumber) {
        try{
            let checkExists = word.includes(letter);
            if (checkExists){
                let checkLetter = word[letterNumber] == letter;
                if (checkLetter){
                    this.coverIsExact(letterNumber, wordNumber, letter);
                }
                else {
                    this.coverIsInside(letterNumber, wordNumber, letter)
                }
            }
            else {
                this.coverNotInside(letterNumber, wordNumber, letter)
            }
        }
        catch (error){
            console.warn(error);
        }
    }

    coverIsExact(x, y, letter) {
        try{
            let covering = '<p>'+letter+'</p>';
            let element = document.getElementById('' + y + x);
            element.setAttribute('class', 'letterExect');
            element.innerHTML = covering;

        }
        catch (error){
            console.warn(error);
        }
    }

    coverIsInside(x, y, letter) {
        try{
            let covering = '<p>'+letter+'</p>';
            let element = document.getElementById('' + y + x);
            element.setAttribute('class', 'letterInside');
            element.innerHTML = covering;
        }
        catch (error){
            console.warn(error);
        }
    }

    coverNotInside(x, y, letter) {
        try{
            let covering = '<p>'+letter+'</p>';
            let element = document.getElementById('' + y + x);
            element.innerHTML = covering;

        }
        catch (error){
            console.warn(error);
        }

    }

    // Function for round start
    startRound(){
        let word = document.getElementById('wordInput').value;
        if (word.length == 5){
            let result = this.checkWord(word);
            if (!result) {return;}
            this.currentPlayRound = this.currentPlayRound + 1;
            if (this.currentPLayRound > this.maxRounds - 1) {
                let notify = new Notify();
                notify.setText(notify.noteType.fehler, '<strong>Du hast verloren.</strong><br>Zum neu spielen F5.')
                notify.makeModal();
                notify.showModal();
            }
            else{
                this.setRoundDisplay();
            }
            document.getElementById('wordInput').value = '';
            
        }
        
    }

    setRoundDisplay(){
        let nowRound = this.currentPlayRound + 1
        document.getElementById('currentRound').innerText = 'Runde ' + nowRound + ' / ' + this.maxRounds;
    }

    counterStart () {
        this.timeAtStart = Date.now();
    }

    counterEnd () {
        this.timeAtEnd = Date.now();
    }

    counterGet () {
        let timeUsedInMs = this.timeAtEnd - this.timeAtStart;
        let minutes = 0;
        let seconds = 0;
        let timeUsedInSec = Math.floor(timeUsedInMs/1000);

        minutes = this.#formatNumber(Math.floor(timeUsedInSec/60));
        seconds = this.#formatNumber(timeUsedInSec - (minutes*60));

        this.timeUsed = minutes + ':' + seconds;



    }


    makeHighScoreList(){
        let xml = new XMLHttpRequest();
        xml.open('POST', '../php/main.php?mode=getHighSoreList', false);
        xml.send();
        let rowResponse = xml.responseText;
        let response = JSON.parse(rowResponse);
        
        if (response['rc']) {
            document.getElementById('highScoreList').innerHTML=response['rv']
        }

        else{throw(response['rv'])}
    }
}



var gameEngine = new wordsearchGame(6);
gameEngine.startGame();
document.getElementById('wordInput').addEventListener("input", ()=>{gameEngine.startRound();});
