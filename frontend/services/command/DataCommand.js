import Command from './command.js';

const DATA_COMMAND = {
    SAVE_ITEM: 'SAVE_ITEM',
    UNSAVE_ITEM: 'UNSAVE_ITEM',
    SAVE_EVENT: 'SAVE_EVENT',
    UNSAVE_EVENT: 'UNSAVE_EVENT'
};

class DataCommandExecutor {
    constructor(myApi) {
        if (!myApi) {
            throw new Error('myApi cannot be null');
        }
        this.myApi = myApi;
    }

    async execute(command) {
        if (!(command instanceof Command)) {
            throw new Error('Argument must be a Command instance.');
        }

        const { name, args } = command;
        const { itemId } = args;

        switch (name) {
            case DATA_COMMAND.SAVE_ITEM:
                return await this.myApi.saveItem(itemId);
            case DATA_COMMAND.UNSAVE_ITEM:
                return await this.myApi.unsaveItem(itemId);
            case DATA_COMMAND.SAVE_EVENT:
                return await this.myApi.saveEvent(itemId);
            case DATA_COMMAND.UNSAVE_EVENT:
                return await this.myApi.unsaveEvent(itemId);
            default:
                throw new Error(`Unknown command: ${name}`);
        }
    }
}

export { DataCommandExecutor, DATA_COMMAND, Command };