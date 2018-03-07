const expect = require('expect');
const {Games} = require('./games');

describe('Games', () => {
    var games;

    beforeEach(() => {
        games = new Games();
        games.games = [{
            name: 'game 1',
            userCount: 3
        }, {
            name: 'game 2',
            userCount: 1
        }, {
            name: 'game 3',
            userCount: 2
        }];
    });

    it('should add a game', () => {
        var gameName = 'Dragon Fire';
        var gamesRes = games.addGame(gameName);
        
        expect(gamesRes.name).toEqual(gameName);
        expect(games.games.length).toBe(4);
    });
    it('should not add a game if game already exists', () => {
        var gameName = games.games[1].name;
        var gamesRes = games.addGame(gameName);

        expect(gamesRes).toBeFalsy();
        expect(games.games.length).toBe(3);
    });

    it('should increase user count in a game that exists', () => {
        var gameName = games.games[0].name;
        var gamesRes = games.addUserToGame(gameName);

        expect(gamesRes.name).toEqual(gameName);
        expect(gamesRes.userCount).toBe(4);
    });
    it('should add a game if game name does not exist', () => {
        var gameName = 'Dragon Fire';
        var gamesRes = games.addUserToGame(gameName);

        expect(gamesRes.name).toEqual(gameName);
        expect(gamesRes.userCount).toBe(1);
    });

    it('should decrease user count of an existing game', () => {
        var gameName = games.games[0].name;
        var gamesRes = games.removeUserFromGame(gameName);

        expect(gamesRes.name).toEqual(gameName);
        expect(gamesRes.userCount).toBe(2);
        expect(games.games).toContain(gamesRes);
    });
    it('should not decrease user count of a game that does not exist', () => {
        var gameName = 'Non-existent game';
        var gamesRes = games.removeUserFromGame(gameName);

        // games should not contain a game with the given gameName
        expect(games.games).not.toContain({name: gameName});
        // gamesRes should just be name
        expect(gamesRes).toEqual(gameName);
    });
    it('should remove game that has no long has users', () => {
        var gameName = games.games[1].name;
        var gamesRes = games.removeUserFromGame(gameName);

        expect(gamesRes.name).toBe(gameName);
        expect(gamesRes.userCount).toBe(0);
        expect(games.games).not.toContain(gamesRes);
    });

    it('should sort the games by userCount', () => {
        var gamesRes = games.sortGamesByUserCount();
        
        expect(gamesRes[0].name).toBe('game 1');
        expect(gamesRes[1].name).toBe('game 3');
        expect(gamesRes[2].name).toBe('game 2');
    });
    it('should sort the games after users added to games', () => {
        var gameName = 'game 3';
        var gamesRes = games.addUserToGame(gameName);

        expect(games.games[0].name).toBe('game 1');
        expect(games.games[1].name).toBe('game 3');
        expect(games.games[2].name).toBe('game 2');

        gamesRes = games.addUserToGame(gameName);
        
        expect(games.games[0].name).toBe('game 3');
        expect(games.games[1].name).toBe('game 1');
        expect(games.games[2].name).toBe('game 2');
    });
    it('should sort the games after users removed from games', () => {
        var gameName = 'game 1';
        var gamesRes = games.removeUserFromGame(gameName);

        expect(games.games[0].name).toBe('game 1');
        expect(games.games[1].name).toBe('game 3');
        expect(games.games[2].name).toBe('game 2');

        gamesRes = games.removeUserFromGame(gameName);
        
        expect(games.games[0].name).toBe('game 3');
        expect(games.games[1].name).toBe('game 1');
        expect(games.games[2].name).toBe('game 2');
    });
});