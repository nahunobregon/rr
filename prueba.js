var express = require('express');
const cors = require('cors');
const bodyParser=require("body-parser");
var app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());
const qrcode = require('qrcode-terminal');
const readline = require('readline');
const fs = require('fs')
const { MessageMedia } = require('whatsapp-web.js');
const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth()
});
app.get('/', function (req, res) {

    const fs = require('fs').promises
    const path = require('path')
    const FOLDER_TO_REMOVE = './.wwebjs_auth'

    fs.readdir(FOLDER_TO_REMOVE)
        .then(files => {
            const unlinkPromises = files.map(file => {
                const filePath = path.join(FOLDER_TO_REMOVE, file)
                return fs.unlink(filePath)
            })

            return Promise.all(unlinkPromises)
        }).catch(err => {
            console.error(`Something wrong happened removing files of ${FOLDER_TO_REMOVE}`)
        })

});
app.post('/a', function (req, res) {
    var titulo = req.body.msg;
    console.log(titulo);
    res.send('enviado');
});

app.get('/envia', function (req, res) {
    try {
        client.on('ready', () => {
            console.log('Client is ready!');
            const readInterface = readline.createInterface({
                input: fs.createReadStream('./numeros.txt'),
            });
            readInterface.on('line', function (line) {
                const number = "+51" + line;
                const chatId = number.substring(1) + "@c.us";
                const media = MessageMedia.fromFilePath('./Molduras-Vialci-Catalogo-acrilico.pdf');
                client.sendMessage(chatId, media);
            });
        });
        res.send('Hola Mundo!'); 
    } catch (error) {
        
    }
    
    //client.initialize();
});
app.post('/msg', function (req, res) {
    try {
        var texto = req.body.texto;
        var archivo = req.body.archivo;
        console.log(req.body);
        client.on('qr', qr => {
            //qrcode.generate(qr, { small: true });
            //console.log(qr);
            res.json({
                qr: qr,
                msg: 'es nesario escanerar el codigo QR'+texto,
              });
        });
        /*
        client.on('ready', () => {
            console.log('Client is ready!');
            const readInterface = readline.createInterface({
                input: fs.createReadStream('./numeros.txt'),
            });
            readInterface.on('line', function (line) {
                const number = "+51" + line;
                const chatId = number.substring(1) + "@c.us";
                const media = MessageMedia.fromFilePath('./Molduras-Vialci-Catalogo-acrilico.pdf');
                client.sendMessage(chatId, media);
            });
        });*/
        client.on('ready', () => {
            console.log('Client is ready!');
            // Number where you want to send the message.
            const number = "+51916610213";
            // Your message.
            const text = "Hey john";
            // Getting chatId from the number.
            // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
            const chatId = number.substring(1) + "@c.us";
            // Sending message.
            client.sendMessage(chatId, text);
        });
        client.initialize(); 
    } catch (error) {
        
    }
    


});

app.listen(3000, function () {
    console.log('Aplicación ejemplo, escuchando el puerto 3000!');
});
