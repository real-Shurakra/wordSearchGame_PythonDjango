class wordsearchGame {
    constructor(maxRounds) {
        this.currentPlayRound = 0;
        this.maxRounds = maxRounds - 1;
        this.#setRoundDisplay();
        this.timeAtStart = 0;
        this.timeAtEnd = 0;
        this.timeUsed = '';
        this.searchWord = '';
    }

    /**
     * @brief load content from a ressource
     * @param {string} url The URL to the ressource 
     * @param {FormData} question Data to provide to ressource
     */
    #getDataFormURL(url, question=false){
        try{
            //define request object
            let xml = new XMLHttpRequest();

            // open request
            xml.open('POST', url, false);

            // sending request
            if (question==false) {xml.send();}
            else{xml.send(question);}

            // interpret answer
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
            return {
                'rc':false,
                'rv':error
            }
        }
    
    }

    #getWordDataList(){
        try{
            let dataList_Result = this.#getDataFormURL('getWordDataList');
            if (!dataList_Result['rc']){throw(dataList_Result['rv']);}
            document.getElementById('wordInputDatalist').innerHTML=dataList_Result['rv']
            return {
                'rc':true,
                'rv':true
            }
        }
        catch (error){
            return {
                'rc':false,
                'rv':'#winGame->'+error
            }
        }
    }

    /**
     * @brief get an new word from the database
     */
    #getNewWord() {
        try{
            let response = this.#getDataFormURL('getNewWord')
            if (response['rc']) {
                return {
                    'rc':true,
                    'rv':response['rv']
                }
            }
            else{throw(response['rv'])}
        }
        catch (error){
            return {
                'rc':false,
                'rv':error
            }
        }
    }

    /**
     * @brief what happends if the game is won
     */
    #winGame(){
        try{
            this.#endGame();
            $('#gameWonModal').modal('show');
            return {
                'rc':true,
                'rv':true
            }
        }
        catch (error){
            return {
                'rc':false,
                'rv':'#winGame->'+error
            }
        }
    }

    #loseGame(){
        try{
            this.#endGame();
            let notify = new Notify();
            notify.changeModalType(notify.noteType.fehler)
            notify.changeModalText('Du hast verloren')
            notify.makeModal();
            notify.showModal();
            return {
                'rc':true,
                'rv':true
            }
        }
        catch (error){
            return {
                'rc':false,
                'rv':'#winGame->'+error
            }
        }

    }

    #endGame(){
        try{
            endGame_Result = this.#getDataFormURL('endGame');
            if (!endGame_Result['rc']){throw(endGame_Result['rv'])}
            return {
                'rc':true,
                'rv':true
            }
        }
        catch (error){
            return {
                'rc':false,
                'rv':'#endGame->'+error
            }
        }
    }

    #notAWordError(word){
        let notify = new Notify();
        notify.changeModalType(notify.noteType.hinweis);
        notify.changeModalText(word + ' ist kein zulässiges Word.')
        notify.makeModal();
        notify.showModal();
    }

    #setRoundDisplay(){
        let nowRound = this.currentPlayRound + 1
        let maxRound = this.maxRounds + 1
        document.getElementById('currentRound').innerHTML='<p>Runde ' + nowRound + ' / ' + maxRound + '</p>'
    }

    #counterStart () {
        this.timeAtStart = Date.now();
    }

    #counterEnd () {
        this.timeAtEnd = Date.now();
    }

    #counterGetNeededTime () {
        let timeUsedInMs = this.timeAtEnd - this.timeAtStart;
        let minutes = 0;
        let seconds = 0;
        let timeUsedInSec = Math.floor(timeUsedInMs/1000);



        this.timeUsed = minutes + ':' + seconds;
    }

    #getHighScoreList(){
       
    }

    /**
     * @brief Starts the Game
     */
    startGame() {
        try{
            let getWordDataList_Result = this.#getWordDataList();
            if (!getWordDataList_Result['rc']){throw(getWordDataList_Result['rv'])}
            let newWord = this.#getNewWord();
            if (!newWord['rc']){throw(newWord['rv'])}
            console.log('I didn\'t created this game for you to cheat! Take this and die: ' + newWord['rv']);
            	
            
            
            
        }
        catch (error){
            let notify = new Notify();
            notify.changeModalType(notify.noteType.fehler);
            notify.changeModalText('<strong>Schwerer Fehler</strong><br>' + error)
            notify.makeModal();
            notify.showModal();
        }

        //this.#getHighScoreList();
        //this.#counterStart();
    }

    // Function for round start
    startRound(){
        let word = document.getElementById('wordInput').value;
        if (word.length == 5){
            document.getElementById('wordInput').value = '';
            let question = new FormData();
            question.append('word', word);
            let checkWord_result = this.#getDataFormURL('checkWord', question)
            if (!checkWord_result['rc']){throw(checkWord_result['rv'])}
            else{
                if (checkWord_result['rv']==false){
                    this.#notAWordError(word);
                    return;
                }
                else{
                    
                    console.log('RoundNr' + this.currentPlayRound)
                    document.getElementById('RoundNr' + this.currentPlayRound).innerHTML=checkWord_result['rv']['htmlRow'];
                    this.currentPlayRound = this.currentPlayRound + 1;
                    if (checkWord_result['rv']['wordFound']){
                        this.#winGame();
                        return;
                    }
                    else if (this.currentPlayRound > this.maxRounds) {
                        this.#loseGame();
                        return;
                    }
                    this.#setRoundDisplay();
                }
                return;
            }
        }
    }
    wonModalCheckUsername(){
        let userName = document.getElementById('wonModalUser').value;
        userName.replace(' ', '')
        if (userName.length == 3){
            document.getElementById('saveHighScore').disabled = false;
        }
        else {
            document.getElementById('saveHighScore').disabled = true;
        }
    }

    wonModalInsertHighScore(){
        try{
            let neededRounds = this.currentPlayRound;
            let userName = document.getElementById('wonModalUser').value;
            userName.replace(' ', '')
            if (userName.length != 3){return;}
            let question = new FormData();
            question.append('neededRounds', neededRounds);
            question.append('userName', userName);
            let insterHighScoore_Result = this.#getDataFormURL('insertHighScore', question);
            if (!insterHighScoore_Result['rc']){throw(insterHighScoore_Result['rv'])}
            
            let notify = new Notify();
            notify.changeModalType(notify.noteType.erfolg);
            notify.changeModalText('<strong>HighScore Hochgeladen</strong><br>Vielen Dank fürs spielen.<br>Mit einem Klick auf "Neues Spiel" können Sie ein neues Spiel starten.')
            notify.changeModalSize(notify.sizeType.medium)
            notify.makeModal();
            notify.showModal();
        }
        catch (error){
            let notify = new Notify();
            notify.changeModalType(notify.noteType.fehler);
            notify.changeModalText('<strong>Schwerer Fehler</strong><br>' + error)
            notify.makeModal();
            notify.showModal();
        }
    }
}



var gameEngine = new wordsearchGame(6);
document.getElementById('wordInput').addEventListener("input", ()=>{gameEngine.startRound();});
document.getElementById('wonModalUser').addEventListener("input", () => {gameEngine.wonModalCheckUsername();});
document.getElementById('saveHighScore').addEventListener("click", () => {gameEngine.wonModalInsertHighScore();});
gameEngine.startGame();