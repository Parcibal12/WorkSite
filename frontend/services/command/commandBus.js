import { DataCommandExecutor } from './DataCommand.js';

class CommandBus {
    constructor() {
        if (CommandBus.instance) {
            return CommandBus.instance;
        }
        this.executors = new Map();
        this.register(DataCommandExecutor);
        CommandBus.instance = this;
    }

    register(executor) {
        executor.commands.forEach(commandName => {
            this.executors.set(commandName, executor);
        });
    }

    async dispatch(command) {
        console.log(`Dispatching command: ${command.name}`);
        const executor = this.executors.get(command.name);

        if (executor) {
            try {
                await executor.execute(command);
            } catch (error) {
                throw error;
            }
        }
    }
}

export default new CommandBus();