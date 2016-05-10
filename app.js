var express = require('express'); 
var app = express(); 
var server = require('http').createServer(app); 
var multer  = require('multer');

var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;
var oxford = require('project-oxford');
var stream = require('stream');
var GIFEncoder = require('gifencoder');
var Canvas = require('canvas');
var fs = require('fs');
app.use(multer({ dest: './uploads/'}));

var client = new oxford.Client(process.env.myoxfordkey);
var Image = Canvas.Image;

server.listen(port);
app.use(express.static(__dirname + '/public'));

app.post('/upload', function (req, res, next) {
    console.log(res.body) // form fields
    console.log(res.files) // form files
    res.status(204).end()
})

function overlayImage(background, foreground, x, y, width) {
    
}

function detectFace(stream) {
        client.face.detect({
            stream: stream,
            analyzesFaceLandmarks: true,
            analyzesHeadPose: true
        }).then(function(response) {
            console.log(response);
        }, function(err) {
            console.log(err)
        });
}

function encodeGIF() {
    fs.readFile(__dirname + '/glasses.png', function(err, glasses) {
        if(err) throw err;
        var glassesImg = new Image();
        glassesImg.src = glasses;

        fs.readFile(__dirname + '/me.jpg', function(err, me){
            if (err) throw err;
            var img = new Image;
            img.src = me;
          
            var encoder = new GIFEncoder(img.width, img.height);
            encoder.createReadStream().pipe(fs.createWriteStream('myanimated.gif'));
            
            encoder.start();
            encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat 
            encoder.setDelay(1000/24);  // frame delay in ms 
            encoder.setQuality(10); // image quality. 10 is default. 
            
            var canvas = new Canvas(img.width, img.height);
            var ctx = canvas.getContext('2d');
        
            var offsetX, offsetY = 0;
            offsetX = 40;
            offsetY = -35;
            
            for (var i = 0; i<30; i++) {
                ctx.drawImage(img, 0, 0, img.width, img.height);
                ctx.save();
                
                ctx.translate(offsetX, offsetY);
                ctx.rotate(-0.075); 
                ctx.scale(0.2,0.2);
           
                ctx.drawImage(glassesImg, 0,0, glassesImg.width/5, glassesImg.height/5);
                ctx.restore();
                encoder.addFrame(ctx);
                
                offsetY+=4;
            }
            
            for(var i=0;i<10;i++) {
                encoder.addFrame(ctx);
            }
            
            encoder.finish();
            console.log("Image Saved!")
        }); 
    }); 
}

//detectFace();
//encodeGIF();

function getStream() {
    const data = req.body.image.split(',')[1];  // removing 'data:image/jpeg;base64,'
  const decodedImage = new Buffer(data, 'base64');
  const rs = new stream.Readable();
  rs.push(decodedImage);
  rs.push(null);
}

io.on('connection', function(socket) { 
    socket.on('origimgurl', function(origimgurl) {
        console.log('face url: ' + origimgurl);
        client.face.detect({
            url: origimgurl,
            analyzesFaceLandmarks: true,
            analyzesHeadPose: true
        }).then(function(response) {
            socket.emit('face', response);
            console.log(response);
        });
    });
});
