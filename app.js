// loading node library
const http = require('http');
const fs = require('fs');

// local host
const hostname = '127.0.0.1';
const port = 3000;
let quotes;

const server = http.createServer();
quotesArr = []

// Files are stored as JSON
fs.readFile('input.json',function(err,data){
    if (err){
        return console.log(err)
    }
    quotesArr= JSON.parse(data.toString())
})
function updateFile(){
    fs.writeFile('input.json',JSON.stringify(quotesArr),function(err,data){
      if (err){
          return console.log(err)
      }
      console.log("Sucessfully updated JSON file with new quotes")     
    })
}

function randomQuote(){
    return quotesArr[Math.floor(Math.random() * quotesArr.length)]
}

server.on ('request',function(request,result){
    // console.log('method', request.method);
    // console.log('url', request.url);
    // JSON Format
    result.setHeader('Content-Type','text/json');
    result.setHeader('Access-Control-Allow-Origin', '*');
    result.setHeader("Access-Control-Allow-Methods","OPTIONS, GET");
    result.setHeader("Access-Control-Allow-Headers",'*');

    if (request.method == "GET"){
        
        if (request.url == "/quotes"){
            result.write(JSON.stringify(quotesArr));
            result.end()
        }
        else if(request.url=="/quotes/random"){
            const answer = { quote : randomQuote()} 
            result.write(JSON.stringify(answer))      
            result.end()
        }
        else{
            result.write('<a href="/quotes">Go to this page to get some quotes</a>');
            result.end()
        }
    }
    else if (request.method == "POST") {
        const body = [] 
        if(request.url =="/quotes/submit"){
            request.on('data',function(chunk){
            body.push(chunk)
            }).on('end',function(){
                const data = Buffer.concat(body).toString();
                    // RegEx expression
                const newQuote = data.split('=')[1].replace(/\+/g, " "); 
                quotesArr.push(newQuote);
                updateFile();
                 result.writeHead(301, {Location:'/quotes'});
                 result.end();
            })
            

        }
    }
    

});

server.listen(port,hostname ,function(){
    console.log(`Server Running at http ://${hostname}:${port}/`);
});
