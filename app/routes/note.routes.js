module.exports = (app) => {
    const test = require('../controllers/note.controller.js');

    // Create a reg 
    app.post('/reg', test.create);
    
    //login 
    app.post('/login', test.login);
   
   //get all items
   app.get('/test',test.validUser,test.findAll)

    // Retrieve a single Note with noteId
    app.get('/test/:UserId', test.findOne);

    // Update a Note with noteId
    app.put('/test/:UserId', test.update);

    // Delete a Note with noteId
    app.delete('/test/:UserId', test.delete);
}