import Command from './command.js';

const DATA_COMMAND = {
    SAVE_ITEM: 'SAVE_ITEM',
    UNSAVE_ITEM: 'UNSAVE_ITEM'
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
            default:
                break;
        }
    }
}

export { DataCommandExecutor, DATA_COMMAND, Command };