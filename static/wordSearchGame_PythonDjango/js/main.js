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
            console.error(error);
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
            console.error(error);
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
            console.error(error);
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
            let endGame_Result = this.#endGame();
            if (!endGame_Result['rc']){throw(endGame_Result['rv'])}
            document.getElementById('wonModalWord').innerHTML = endGame_Result['rv']['searchWord']
            document.getElementById('wonModalTime').innerHTML = endGame_Result['rv']['hour'] + ':' + endGame_Result['rv']['minute'] + ':' + endGame_Result['rv']['second']
            document.getElementById('wonModalRounds').innerHTML = this.currentPlayRound
            $('#gameWonModal').modal('show');
            return {
                'rc':true,
                'rv':true
            }
        }
        catch (error){
            console.error(error);
            return {
                'rc':false,
                'rv':'#winGame->'+error
            }
        }
    }

    #loseGame(){
        try{
            let endGame_Result = this.#endGame();
            if (!endGame_Result['rc']){throw(endGame_Result['rv'])}
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
            console.error(error);
            return {
                'rc':false,
                'rv':'#winGame->'+error
            }
        }

    }

    #endGame(){
        try{
            document.getElementById('wordInput').disabled = true
            let endGame_Result = this.#getDataFormURL('endGame');
            if (!endGame_Result['rc']){throw(endGame_Result['rv'])}
            return {
                'rc':true,
                'rv':endGame_Result['rv']
            }
        }
        catch (error){
            console.error(error);
            return {
                'rc':false,
                'rv':'#endGame->'+error
            }
        }
    }

    #notAWordError(word){
        try{
            let notify = new Notify();
            notify.changeModalType(notify.noteType.hinweis);
            notify.changeModalText(word + ' ist kein zulässiges Word.')
            notify.makeModal();
            notify.showModal();
            return {
                'rc':true,
                'rv':true
            }
            
        }
        catch (error){
            console.error(error);
            return {
                'rc':false,
                'rv':'#endGame->'+error
            }
        }
    }

    #setRoundDisplay(){
        try{
            let nowRound = this.currentPlayRound + 1
            let maxRound = this.maxRounds + 1
            document.getElementById('currentRound').innerHTML='<p>Runde ' + nowRound + ' / ' + maxRound + '</p>'
        }
        catch (error){
            console.error(error);
            return {
                'rc':false,
                'rv':'#endGame->'+error
            }
        }
    }

    #getHighScoreList(){
        try{
            let highScore_Result = this.#getDataFormURL('getHighScoreTopTenFromWord');
            if (!highScore_Result['rc']){throw(highScore_Result['rv'])}
        }
        catch (error){
            console.error(error);
            return {
                'rc':false,
                'rv':'#endGame->'+error
            }
        }
       
    }

    /**
     * @brief Starts the Game
     */
    startGame() {
        try{
            //let getWordDataList_Result = this.#getWordDataList();
            //if (!getWordDataList_Result['rc']){throw(getWordDataList_Result['rv'])}
            let newWord = this.#getNewWord();
            if (!newWord['rc']){throw(newWord['rv'])}
            console.log('I didn\'t created this game for you to cheat! Take this and die: ' + newWord['rv']);
            let getHighScoreList_Result = this.#getHighScoreList();
            if (!getHighScoreList_Result['rc']){throw(getHighScoreList_Result['rv'])}
            
        }
        catch (error){
            console.error(error);
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
        try{
            let word = document.getElementById('wordInput').value;
            if (word.length == 5){
                document.getElementById('wordInput').value = '';
                let question = new FormData();
                question.append('word', word);
                let checkWord_result = this.#getDataFormURL('checkWord', question)
                if (!checkWord_result['rc']){throw(checkWord_result['rv'])}
                else{
                    if (checkWord_result['rv']==false){
                        let notAWordError_Result = this.#notAWordError(word);
                        if (!notAWordError_Result['rc']) {throw(notAWordError_Result['rv'])}
                        return;
                    }
                    else{
                        
                        console.log('RoundNr' + this.currentPlayRound)
                        document.getElementById('RoundNr' + this.currentPlayRound).innerHTML=checkWord_result['rv']['htmlRow'];
                        this.currentPlayRound = this.currentPlayRound + 1;
                        if (checkWord_result['rv']['wordFound']){
                            let winGame_Result = this.#winGame();
                            if (!winGame_Result['rc']) {throw(winGame_Result['rv'])}
                            return;
                        }
                        else if (this.currentPlayRound > this.maxRounds) {
                            let loseGame_Result = this.#loseGame();
                            if (!loseGame_Result['rc']) {throw(loseGame_Result['rv'])}
                            return;
                        }
                        this.#setRoundDisplay();
                    }
                    return;
                }
            }
        }

        catch (error){
            console.error(error);
            let notify = new Notify();
            notify.changeModalType(notify.noteType.fehler);
            notify.changeModalText('<strong>Schwerer Fehler</strong><br>' + error)
            notify.makeModal();
            notify.showModal();
        }
    }

    wonModalCheckUsername(){
        try{
            let userName = document.getElementById('wonModalUser').value;
            userName.replace(' ', '')
            if (userName.length == 3){
                document.getElementById('saveHighScore').disabled = false;
            }
            else {
                document.getElementById('saveHighScore').disabled = true;
            }
        }
        catch (error){
            console.error(error);
            let notify = new Notify();
            notify.changeModalType(notify.noteType.fehler);
            notify.changeModalText('<strong>Schwerer Fehler</strong><br>' + error)
            notify.makeModal();
            notify.showModal();
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
            console.error(error);
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