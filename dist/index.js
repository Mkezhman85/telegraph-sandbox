"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const telegraf_1 = require("telegraf");
const telegraf_session_local_1 = __importDefault(require("telegraf-session-local"));
const { leave, enter } = telegraf_1.Scenes.Stage;
const token = process.env.TOKEN;
if (!token) {
    throw new Error("Не задан токен");
}
const testScene = new telegraf_1.Scenes.BaseScene('test');
testScene.enter((ctx) => ctx.reply('Привет!'));
testScene.command('back', leave());
testScene.on('text', (ctx) => ctx.reply(ctx.message.text));
testScene.leave((ctx) => ctx.reply('Пока!'));
const stage = new telegraf_1.Scenes.Stage([testScene]);
const bot = new telegraf_1.Telegraf(token);
bot.use(new telegraf_session_local_1.default({ database: 'session.json' }).middleware());
bot.use(stage.middleware());
bot.use((ctx, next) => {
    ctx.session.myProp;
    ctx.scene.session.myProps;
    next();
});
bot.command('test', (ctx) => {
    ctx.scene.enter('test');
});
bot.launch();
