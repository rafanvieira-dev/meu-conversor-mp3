const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const app = express();
app.use(express.static('public'));
app.use(cors());

app.get('/baixar', (req, res) => {
    const urlDoVideo = req.query.url;

    if (!urlDoVideo || !ytdl.validateURL(urlDoVideo)) {
        return res.status(400).send('Link inválido ou ausente.');
    }

    console.log(`A iniciar o download: ${urlDoVideo}`);

    res.header('Content-Disposition', 'attachment; filename="audio_128k.mp3"');
    res.header('Content-Type', 'audio/mpeg');

    const stream = ytdl(urlDoVideo, { quality: 'highestaudio' });

    ffmpeg(stream)
        .audioBitrate(128)
        .format('mp3')
        .pipe(res, { end: true })
        .on('end', () => console.log('Download concluído com sucesso!'))
        .on('error', (erro) => console.error('Erro na conversão:', erro.message));
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
    console.log(`🚀 Servidor a correr na porta ${PORTA}`);
});
