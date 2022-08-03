import 'dotenv/config'
import { Context, Markup, Scenes, Telegraf } from 'telegraf'
import LocalSession from 'telegraf-session-local'
const { leave, enter } = Scenes.Stage

/**
 * Считываем токен
 */
const token = process.env.TOKEN

/**
 * Проверяем на условие "Если не задан токен"
 */
if (!token) {
	throw new Error("Не задан токен")
}

interface MySessionScene extends Scenes.SceneSessionData {
	myProps: string
}


interface MySession extends Scenes.SceneSession<MySessionScene> {
	myProp: string
}


interface MyContext extends Context {
	props: string
	session: MySession
	scene: Scenes.SceneContextScene<MyContext, MySessionScene>
}

/**
 * Создаем тестовую сцену
 */
const testScene = new Scenes.BaseScene<MyContext>('test')
testScene.enter((ctx) => ctx.reply('Привет!'))
testScene.command('back', leave<MyContext>())
testScene.on('text', (ctx) => ctx.reply(ctx.message.text))
testScene.leave((ctx) => ctx.reply('Пока!'))


/**
 * Подключаем сцену
 */
const stage = new Scenes.Stage<MyContext>([testScene])

/**
 * Создаем бота
 */
const bot = new Telegraf<MyContext>(token)

/**
 * Сохраняем локально данные текущей сессии
 */
bot.use(new LocalSession({ database: 'session.json' }).middleware())

bot.use(stage.middleware())


/**
 * Промежуточный обработчик, который
 * позволяет передавать дополнительные свойства
 */
bot.use((ctx, next) => {
	ctx.session.myProp
	ctx.scene.session.myProps
	next()
})


/**
 * Входим в сцену
 */
bot.command('test', (ctx) => {
	ctx.scene.enter('test')
})






// /**
//  * Обрабатываем Action
//  */
// bot.action('1', ctx => {
// 	/**
// 	 * Отобразить в консоли callback_data
// 	 */
// 	console.log(ctx.callbackQuery.data)
// 	ctx.reply('Это тестовое сообщение для проверки отображения текста после нажатия на кнопку')
// })


// /**
//  * Команда с клавиатурой внутри команды
//  */
// bot.command('mark', (ctx) => {
// 	ctx.replyWithMarkdown('*Это толстый текст*')
// 	ctx.reply('mark', {
// 		reply_markup: {
// 			inline_keyboard: [
// 				[{ text: '1', callback_data: '1' }]
// 			]
// 		}
// 	})
// })

// /**
//  * Обработка команды с image
//  */
// bot.command('image', (ctx) => {
// 	ctx.replyWithPhoto({
// 		url: 'https://picsum.photos/200/300/?random'
// 	})
// })


// /**
//  * Обработка команды
//  */
// bot.command('test', (ctx) => {
// 	ctx.reply('Test!', Markup.keyboard(
// 		['/1', '/2']
// 		)
// 		.oneTime()
// 		.resize()
// 	)
// })

// /**
//  * Если нам передан текст
//  * вторым аргументам callback контекст
//  * в него попадает вся информация, которую мы приняли
//  */
//  bot.on('text', (ctx) => {
// 	/**
// 	 * Отвечаем "Привет!"
// 	 */
// 	ctx.reply("Привет!")
// 	/**
// 	 * Получаем текст и возвращаем назад
// 	 */
// 	ctx.reply(ctx.message.text)
// })

/**
 * Слушаем события
 */
bot.launch()