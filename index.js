
let express = require('express');
let app = express();
const bodyparser = require('body-parser')
const fetch = require('node-fetch');
let sqlite = require('sqlite');

app.use(bodyparser.json())


function setupServer(db) {

    // This is a test frontend - uncomment to check it out
    app.use(express.static('public'));
    


    app.get('/info', (req, res) => {

        // console.log("headers are"+JSON.stringify(req.headers.authorization))

        let Token = JSON.stringify(req.headers.authorization)
        console.log(Token);
        fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${Token}`).then(function(response) {
    


        return response.json();
        }).then(data =>{

            if(data.error){
                res.send("Error 401: Unauthorized access")
            }
            else{

                res.send("Full Stack Example1")

            }
           
        }).catch(error =>{

            console.log(error)
            res.send("Error 401: Unauthorized access")
        })
    
    });

    // retrieve all unique stree names
    app.get('/streets/:token', (req, res) => {
    
        let Token = req.params.token
        console.log(Token);
        fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${Token}`).then(function(response) {
    


        return response.json();
        }).then(data =>{

            if(data.error){
                res.send("Error 401: Unauthorized access")
            }
            else{

    
            db.all(`SELECT DISTINCT(name) FROM BikeRackData`)
            .then( data => {
            
                console.log(data);
                res.send(data);
            
            });         
            }
    

        }).catch(error =>{

            console.log(error)
            
            res.send("Error 401: Unauthorized access")
        })
    
    
    
    
    });

    app.get('/streets/:street/:token', (req, res) => {

        let Token = req.params.token
        console.log(Token);
        fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${Token}`).then(function(response) {
    


        return response.json();
        }).then(data =>{
            
            if(data.error){

                res.send("Error 401: Unauthorized access")

            }
            else{
            let streetName = req.params.street;
            // query based on street
        // NOTE: this is open to SQL injection attack
            db.all(`SELECT * FROM BikeRackData WHERE name = '${streetName}'`)
              .then( data => {
                  res.send(data);              
              });
            }
        
        }).catch(error =>{

            console.log(error)
            
            res.send("Error 401: Unauthorized access")
        })
        

    });

    

    let server = app.listen(8080, () => {
        console.log('Server ready', server.address().port);
    });
    
}

sqlite.open('database.sqlite').then( db => {
	//console.log('database opened', db);

    setupServer(db);
    //return db.all('SELECT * from TEST');
    
})

