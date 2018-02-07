class Games {
    constructor() {
        this.games = [];
    }

    addGame(name) {
        var games = this.games.filter((game) => game.name === name);
        if(!games[0]) {
            var game = {
                name,
                userCount: 1
            }
            this.games.push(game);
            this.sortGamesByUserCount();
        }
        
        return game;
    }
    
    addUserToGame(name) {
        console.log('name here', name);
        var gameIndex = this.games.findIndex((game) => game.name === name);

        // find index returns index of first matching index of matching criteria or -1 if not found
        if(gameIndex !== -1){
            // found game index
            this.games[gameIndex].userCount++;
            this.sortGamesByUserCount();
            return this.games[gameIndex];
        }else{
            // did not find game index, create game
            return this.addGame(name);
        }
    }

    removeUserFromGame(name) {
        var gameIndex = this.games.findIndex((game) => game.name === name);

        // find index returns index of first matching index of matching criteria or -1 if not found
        if(gameIndex !== -1){
            // found game index and decrement userCount by one
            this.games[gameIndex].userCount--;
            if(this.games[gameIndex].userCount === 0){
                // removeGame returns a game object
                return this.removeGame(name);
            }
            this.sortGamesByUserCount();
            // returns a game object
            return this.games[gameIndex];
        }
        // returns the name
        return name;
    }

    removeGame(name) {
        // if the game we are checking has one user then we can delete it
        var game = this.games.filter((game) => game.name === name)[0];

        if(game){
            this.games = this.games.filter((game) => game.name !== name);
        }
        this.sortGamesByUserCount();

        return game;
    }

    // sorts the games with highest userCount first
    sortGamesByUserCount(){
        this.games.sort(function(a, b){
            return b.userCount - a.userCount;
        });
        return this.games;
    }

}

module.exports = {Games};