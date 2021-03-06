const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload')
const jsmediatags = require('jsmediatags')
const fs = require('fs')

const songdata = [];

router.post('/upload', fileUpload({ safeFileNames: true }), (req, res) => {

       console.log(req.files.file);
       let filetype;

       if (req.files.file.mimetype === 'audio/mpeg') {
            filetype = 'mp3'
       } else if (req.files.file.mimetype === 'audio/flac') {
            filetype = 'flac'
       } else {
           console.log(filetype);
           res.sendStatus(500)
       }

       let songDir = `public/uploadDestination/${req.files.file.name}.${filetype}`

       req.files.file.mv(songDir, (err) => {
        if (err) {
            console.log(err);    
            res.sendStatus(500)
        } else {
            songdata.push(songDir)
            res.send(songdata)
        }

        let songRead = fs.createReadStream(songDir)
        
        jsmediatags.read(songDir, {
            onSuccess: function(tag) {
            console.log(tag);
            },
            onError: function(error) {
            console.log(':(', error.type, error.info);
            }
        })
    })
})

router.get('/', (req, res) => {
    res.sendStatus(200)
})

module.exports = router;