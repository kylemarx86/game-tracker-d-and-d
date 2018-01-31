const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {
    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Dan',
            game: 'Dragon Fire',
            role: 'gameMaster'
        }, {
            id: '2',
            name: 'Sean',
            game: 'Dragon Fire',
            role: 'player'            
        }, {
            id: '3',
            name: 'Mike',
            game: 'Dungeon Crawler',
            role: 'gameMaster'
        }];
    });
    
    it('should add new user', () => {
        // var users = new Users();
        var user = {
            id: 123,
            name: 'Kyle',
            game: 'MMMS',
            role: 'player'
        };
        var resUser = users.addUser(user.id, user.name, user.game, user.role);
        
        expect(user).toMatchObject(resUser);
    });

    it('should remove a user', () => {
        // assert that the user is removed
        var userId = '1';
        var resUser = users.removeUser(userId);

        expect(resUser.id).toEqual(userId);
        expect(users.users.length).toBe(2);
    });
    it('should not remove a user', () => {
        // assert that the user is not removed
        // the array has not changed
        var resUser = users.removeUser('47');

        expect(resUser).toBeFalsy();
        expect(users.users.length).toBe(3);
    });

    it('should find user', () => {
        var userId = '1';
        var userRes = users.getUser(userId);

        // expect(userRes).toInclude(users.users[0]);
        expect(userRes).toMatchObject(users.users[0]);
    });
    it('should not find user', () => {
        var userId = '47';
        var userRes = users.getUser(userId);

        expect(userRes).toBeFalsy();
    });

    it('should return names in Dragon Fire game', () => {
        var userList = users.getUserList('Dragon Fire');

        // expect(userList).toEqual(['Dan', 'Mike']);
        expect(userList).toEqual(expect.arrayContaining(['Dan', 'Sean']));
    });
    it('should return names in Dungeon Crawler game', () => {
        var userList = users.getUserList('Dungeon Crawler');

        expect(userList).toEqual(expect.arrayContaining(['Mike']));
        // expect(userList).toEqual(['Sean']);
    });
})