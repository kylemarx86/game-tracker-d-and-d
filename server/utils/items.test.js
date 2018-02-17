const expect = require('expect');
const {Items} = require('./items');

describe('Items', () => {
    var items;

    beforeEach(() => {
        items = new Items();
        items.items = [{
            name: 'arrows',
            count: 3
        }, {
            name: 'backpack',
            count: 1
        }, {
            name: 'chain mail',
            count: 2
        }];
    });

    it('should add an item to list', () => {
        var itemName = 'handaxe';
        var itemsRes = items.addItemToList(itemName);
        
        expect(itemsRes.name).toEqual(itemName);
        expect(items.items.length).toBe(4);
    });
    it('should not add an item to list if item already exists', () => {
        var itemName = items.items[1].name;
        var itemsRes = items.addItemToList(itemName);

        expect(itemsRes).toBeFalsy();
        expect(items.items.length).toBe(3);
    });

    it('should increase count of an item that exists', () => {
        var itemName = items.items[0].name;
        var itemsRes = items.addToItemCount(itemName);

        expect(itemsRes.name).toEqual(itemName);
        expect(itemsRes.count).toBe(4);
    });
    it('should add an item if item name does not exist', () => {
        var itemName = 'Dragon Fire';
        var itemsRes = items.addToItemCount(itemName);

        expect(itemsRes.name).toEqual(itemName);
        expect(itemsRes.count).toBe(1);
    });

    it('should decrease item count of an existing item', () => {
        var itemName = items.items[0].name;
        var itemsRes = items.subtractFromItemCount(itemName);

        expect(itemsRes.name).toEqual(itemName);
        expect(itemsRes.count).toBe(2);
        expect(items.items).toContain(itemsRes);
    });
    it('should not decrease item count of an item that does not exist', () => {
        var itemName = 'Non-existent item';
        var itemsRes = items.subtractFromItemCount(itemName);

        // items should not contain an item with the given itemName
        expect(items.items).not.toContain({name: itemName});
        // itemsRes should just be name
        expect(itemsRes).toEqual(itemName);
    });
    it('should remove item that has no long has users', () => {
        var itemName = items.items[1].name;
        var itemsRes = items.subtractFromItemCount(itemName);

        expect(itemsRes.name).toBe(itemName);
        expect(itemsRes.count).toBe(0);
        expect(items.items).not.toContain(itemsRes);
    });
});