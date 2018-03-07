define(function (require, exports, module) {
    class Items {
        constructor() {
            this.items = [];
        }

        addItemToList(name) {
            var items = this.items.filter((item) => item.name === name);
            if (!items[0]) {
                var item = {
                    name,
                    count: 1
                }
                this.items.push(item);
            }

            return item;
        }

        addToItemCount(name) {
            var itemIndex = this.items.findIndex((item) => item.name === name);

            // find index returns index of first matching index of matching criteria or -1 if not found
            if (itemIndex !== -1) {
                // found item index
                this.items[itemIndex].count++;
                return this.items[itemIndex];
            } else {
                // did not find item index, create item
                return this.addItemToList(name);
            }
        }

        subtractFromItemCount(name) {
            var itemIndex = this.items.findIndex((item) => item.name === name);

            // find index returns index of first matching index of matching criteria or -1 if not found
            if (itemIndex !== -1) {
                // found item index and decrement count by one
                this.items[itemIndex].count--;
                if (this.items[itemIndex].count === 0) {
                    // removeItem returns a item object
                    return this.removeItem(name);
                }
                // returns a item object
                return this.items[itemIndex];
            }
            // returns the name
            return name;
        }

        removeItem(name) {
            // if the item we are checking has one user then we can delete it
            var item = this.items.filter((item) => item.name === name)[0];

            if (item) {
                this.items = this.items.filter((item) => item.name !== name);
            }
            return item;
        }
    }

    module.exports = { Items };
});