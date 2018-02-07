
class Users {
    // create an empty array to store individual users
    constructor() {
        this.users = [];
    }

    addUser(id, name, game, role) {
        var user = {id, name, game, role};
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        var user = this.getUser(id);

        // set user array to an array of users that do not have the id
        if(user){
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserList(room) {
        var users = this.users.filter((user) => user.room === room);
        var namesArr = users.map((user) => user.name);

        return namesArr;
    }
}

module.exports = {Users};