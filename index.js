const TelegramApi = require('node-telegram-bot-api')
const token = '5485759852:AAEHFR5uQq_t1ddBAHi6nE0wL2jdEcvGGDw';
const {gameOptions, restartGameOptions} = require('./options')
const bot = new TelegramApi(token, {polling: true})
const chats = {}

const startGames = async (chatId) => {
    await bot.sendMessage(chatId, 'Я сейчас загадаю цыфру от 0 до 9, а ты попробуешь угадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Start welcome'},
        {command: '/info', description: 'Getting info about user'},
        {command: '/game', description: 'Playing game with bot'}
    ])
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            return bot.sendMessage(chatId, `Ur welcome`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `ur nickname ${msg.from.username}`)
        }
        if (text === '/game') {
            return startGames(chatId)
        }
        if (text === '/again') {
            return startGames(chatId)
        }
        return bot.sendMessage(chatId, 'I dont understand u, please try again')
    })
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цыфру ${data}`, restartGameOptions)
        } else {
            return bot.sendMessage(chatId, `Ты не угадал цыфру, бот загадал цыфру ${chats[chatId]}`, restartGameOptions)
        }
    })
}

start()
