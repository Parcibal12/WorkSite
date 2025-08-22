class DataList {
    #items = [];
    static instance = null;

    static getInstance() {
        if (!DataList.instance) {
            DataList.instance = new DataList();
        }
        return DataList.instance;
    }

    setItems(newItems) {
        this.#items = newItems;
    }

    addItem(newItem) {
        this.#items.push(newItem);
    }

    getItems() {
        return this.#items;
    }

    getById(itemId) {
        return this.#items.find(item => item.id == itemId);
    }

    updateItem(itemId, updatedFields) {
        const itemIndex = this.#items.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            this.#items[itemIndex] = { ...this.#items[itemIndex],
                ...updatedFields
            };
        }
    }
}

export default DataList;