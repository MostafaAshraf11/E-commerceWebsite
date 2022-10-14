const express = require('express');
const app = express();
const path = require('path');
const { MongoClient } = require('mongodb');
const session = require('express-session');
const costumer = require('./models/user.models'); 
var currCostumer;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret:'secretkey',
    resave:false.valueOf,
    saveUninitialized: false 
}));

const uri = "mongodb+srv://admin:admin@cluster0.fkkvr.mongodb.net/firstdb?retryWrites=true&w=majority";
    
const client = new MongoClient(uri);

async function main() {

    try {
        await client.connect();
    }
    catch(err) {
        console.error(err);
    }
    finally {
        // await  client.close();
    }

}

main().catch(console.error);

async function createListing(client, newListing) {
   const result = await client.db("firstdb").collection("firstcollection").insertOne(newListing);

   console.log(result.insertedId);
}


//To create a record ---> await createListing(client, {username: req.body.username, password: req.body.password});


async function findOneListingByName(client, {name: nameOfListing}) {
    const result = await client.db("firstdb").collection("firstcollection").findOne({name: nameOfListing});
    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log({username: nameOfListing});
        return true;
    } else {
        console.log(`Not found '${nameOfListing}'`);
        return false;
    }
}

async function findOneListing(client, {name: nameOfListing, pass: passOfListing}) {
  const result = await client.db("firstdb").collection("firstcollection").findOne({ name: nameOfListing, pass: passOfListing });
  if (result) {
      console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
      console.log({username: nameOfListing, password: passOfListing});
      return true;
  } else {
      console.log(`Incorrect username or password '${nameOfListing}'`);
      return false;
  }
}



//To find a record ---> await findOneListingByName(client, "Infinite Views");


//Setup


app.get('/',function(req, res){
    currCostumer = undefined;
    res.render('login',{message:""});
  });
  
  app.post('/register',async function(req, res){
    
    var names = req.body.username;
    var password = req.body.password;
    var check = await findOneListingByName(client, {name: names});
    if(names=='' & password=='')
        {
            res.render('registration',{message:"Please enter username and password"});
            return;
        }
        else if (names==''){
            res.render('registration',{message:"Please enter username"});
            return;
        }
        else if (password==''){
            res.render('registration',{message:"Please enter password"});
            return;
        }
    if(check) {
        console.log("Username already exists, try again.");
        res.render('registration', {message:"Username already exists, try again."});
    }
    else{
        var insertion = new costumer({name: names,pass: password});
        console.log(insertion);
        createListing(client, insertion);
        currCostumer = req.session;
        currCostumer.currUsername = req.body.username;
        // currCostumer.currPassword = req.body.password;
        // currCostumer.currCart = (await client.db("firstdb").collection("firstcollection").findOne({ name: currCostumer.currUsername })).cart;
        res.redirect('home');
        }
    });
  
  app.get('/registration',function(req, res){
    res.render('registration',{message:""});
  });
  
  app.post('/', async function(req, res){
    var names = req.body.username;
    var password = req.body.password;
    var check = await findOneListing(client, {name: names, pass: password});
    if(names=='' & password=='')
    {
        res.render('login',{message:"Please enter username and password."});
        return;
    }
    else if (names==''){
        res.render('login',{message:"Please enter username."});
        return;
    }
    else if (password==''){
        res.render('login',{message:"Please enter password."});
        return;
    }
    else if (check) {
        currCostumer = req.session;
        currCostumer.currUsername = req.body.username;
        // currCostumer.currPassword = req.body.password;
        // currCostumer.currCart = (await client.db("firstdb").collection("firstcollection").findOne({ name: currCostumer.currUsername })).cart;
        res.redirect('home');
    }
    else {
      res.render('login',{message:"Incorrect username or password."});
        //res.json({message:"Please enter username"});
    }
  });

  app.get('/home',function(req, res){
    if(typeof(currCostumer) == "undefined"){
        res.send('<script>alert("Cannot access this page unless you login."); window.location.href = "/"; </script>');
        return;
      }
        res.render('home');
  });
  
  app.post('/home',function(req, res){
      currCostumer = req.session;
      res.redirect('phones');
  });

  
  app.get('/phones',function(req, res){
    if(typeof(currCostumer) == "undefined"){
        res.send('<script>alert("Cannot access this page unless you login."); window.location.href = "/"; </script>');
        return;
      }
      res.render('phones');
  });
  
  app.post('/home',function(req, res){
      currCostumer = req.session;
      res.redirect('books');
  });
  
  app.get('/books',function(req, res){
    if(typeof(currCostumer) == "undefined"){
        res.send('<script>alert("Cannot access this page unless you login."); window.location.href = "/"; </script>');
        return;
      }
      res.render('books');
  });
  
  app.post('/home',function(req, res){
      currCostumer = req.session;
      res.redirect('sports');
  });
  
  app.get('/sports',function(req, res){
    if(typeof(currCostumer) == "undefined"){
        res.send('<script>alert("Cannot access this page unless you login."); window.location.href = "/"; </script>');
        return;
      }
      res.render('sports');
  });
  
  app.post('/phones',function(req, res){
      currCostumer = req.session;
      res.redirect('galaxy');
  });
  
  app.get('/galaxy',function(req, res){
    if(typeof(currCostumer) == "undefined"){
        res.send('<script>alert("Cannot access this page unless you login."); window.location.href = "/"; </script>');
        return;
      }
      res.render('galaxy');
  });
  
  app.post('/phones',function(req, res){
      currCostumer = req.session;
      res.redirect('iphone');
  });
  
  app.get('/iphone',function(req, res){
    if(typeof(currCostumer) == "undefined"){
        res.send('<script>alert("Cannot access this page unless you login."); window.location.href = "/"; </script>');
        return;
      }
    res.render('iphone');
  });
  
  app.post('/home',function(req, res){
    currCostumer = req.session;
      res.redirect('cart');
  });
  
  app.get('/cart',async function(req, res){
    if(typeof(currCostumer) == "undefined"){
        res.send('<script>alert("Cannot access this page unless you login."); window.location.href = "/"; </script>');
        return;
      }
      currCostumer = req.session;
      var result = await client.db("firstdb").collection("firstcollection").findOne({ name: currCostumer.currUsername });
      var itemCart = result.cart;
      console.log(itemCart);
      res.render('cart',{itemCart});
  });
  
  app.post('/sports',function(req, res){
      currCostumer = req.session;
      res.redirect('boxing');
  });
  
  app.get('/boxing',function(req, res){
    if(typeof(currCostumer) == "undefined"){
        res.send('<script>alert("Cannot access this page unless you login."); window.location.href = "/"; </script>');
        return;
      }
      res.render('boxing');
  });
  
  app.post('/sports',function(req, res){
    currCostumer = req.session;
    res.redirect('tennis');
  });
  
  app.get('/tennis',function(req, res){
    if(typeof(currCostumer) == "undefined"){
        res.send('<script>alert("Cannot access this page unless you login."); window.location.href = "/"; </script>');
        return;
      }
      res.render('tennis');
  });
  
  app.post('/books',function(req, res){
      currCostumer = req.session;
      res.redirect('leaves');
  });
  
  app.get('/leaves',function(req, res){
    if(typeof(currCostumer) == "undefined"){
        res.send('<script>alert("Cannot access this page unless you login."); window.location.href = "/"; </script>');
        return;
      }
      res.render('leaves');
  });
  
  app.post('/books',function(req, res){
      currCostumer = req.session;
      res.redirect('sun');
  });
  
  app.get('/sun',function(req, res){
    if(typeof(currCostumer) == "undefined"){
        res.send('<script>alert("Cannot access this page unless you login."); window.location.href = "/"; </script>');
        return;
      }
      res.render('sun');
  });
  
  app.post('/search',function(req, res){
      currCostumer = req.session;
      var entry = req.body.Search;
      console.log(entry);
      res.render('searchresults',{entry});
  });
  
  app.get('/searchresults',function(req, res){
    if(typeof(currCostumer) == "undefined"){
        res.send('<script>alert("Cannot access this page unless you login."); window.location.href = "/"; </script>');
        return;
      }
      res.render('searchresults');
  });

  async function addIfNotFound(client, {item: itemName}){
      var result = await client.db("firstdb").collection("firstcollection").findOne({ name: currCostumer.currUsername });
      var resid = result._id;
      var userCart = result.cart;
      if(userCart.includes(itemName)){
          return true;
      }
      else{
        await client.db("firstdb").collection("firstcollection").updateOne({ _id: resid},{$push: {cart: itemName}});
        //userCart.push(itemName);
        return false;
      }
  }

  app.post('/addiphone',async function(req, res){
    currCostumer = req.session;
      var found = await addIfNotFound(client, {item: "iPhone 13 Pro"});
      if(found){
        res.send('<script>alert("You already have this item in your cart."); window.location.href = "/cart"; </script>');
        console.log("Could't add item as it already exists in cart.");
        return;
      }
      else {
        console.log("Item is successfully added to your cart.");
      }
      res.redirect('/home');
  });

  app.post('/addgalaxy',async function(req, res){
    currCostumer = req.session;
    var found = await addIfNotFound(client, {item: "Galaxy S21 Ultra"});
      if(found){
        res.send('<script>alert("You already have this item in your cart."); window.location.href = "/cart"; </script>');
        console.log("Could't add item as it already exists in cart.");
        return;
      }
      else {
        console.log("Item is successfully added to your cart.");

      }
    res.redirect('/home');
  });

  app.post('/addleaves',async function(req, res){
    currCostumer = req.session;
    var found = await addIfNotFound(client, {item: "Leaves of Grass"});
    if(found){
      res.send('<script>alert("You already have this item in your cart."); window.location.href = "/cart"; </script>');
      console.log("Could't add item as it already exists in cart.");
      return;
    }
    else {
      console.log("Item is successfully added to your cart.");

    }
        res.redirect('/home');
  });

  app.post('/addsun',async function(req, res){
    currCostumer = req.session;
    var found = await addIfNotFound(client, {item: "The Sun and Her Flowers"});
      if(found){
        res.send('<script>alert("You already have this item in your cart."); window.location.href = "/cart"; </script>');
        console.log("Could't add item as it already exists in cart.");
        return;
      }
      else {
        console.log("Item is successfully added to your cart.");
      }
    res.redirect('/home');
  });

app.post('/addboxing',async function(req, res){
    currCostumer = req.session;
    var found = await addIfNotFound(client, {item: "Boxing Bag"});
      if(found){
        res.send('<script>alert("You already have this item in your cart."); window.location.href = "/cart"; </script>');
        console.log("Could't add item as it already exists in cart.");
        return;
      }
      else {
        console.log("Item is successfully added to your cart.");

      }
    res.redirect('/home');
});
app.post('/addtennis',async function(req, res){
    currCostumer = req.session;
    var found = await addIfNotFound(client, {item: "Tennis Racket"});
      if(found){
        res.send('<script>alert("You already have this item in your cart."); window.location.href = "/cart"; </script>');
        console.log("Could't add item as it already exists in cart.");
        return;
      }
      else {
        console.log("Item is successfully added to your cart.");

      }
    res.redirect('/home');
});


async function deleteItemFromCart(client, {item: itemName}) {
    //currCostumer = req.session;
    var result = await client.db("firstdb").collection("firstcollection").findOne({ name: currCostumer.currUsername });
    const userCart = result.cart;
    var resid = result._id;
    var index = userCart.indexOf(itemName);
    // await currCostumer.currCart.splice(index,1);
    await userCart.splice(index, 1);
    await client.db("firstdb").collection("firstcollection").updateOne({ _id: resid},{$set: {cart: userCart}});
}


app.post('/removeiphone', async function(req, res){
    currCostumer = req.session;
    await deleteItemFromCart(client, {item: "iPhone 13 Pro"});
    res.redirect('/cart');
});

app.post('/removegalaxy', async function(req, res){
    currCostumer = req.session;
    await deleteItemFromCart(client, {item: "Galaxy S21 Ultra"});
    res.redirect('/cart');
});

app.post('/removetennis', async function(req, res){
    currCostumer = req.session;
    await deleteItemFromCart(client, {item: "Tennis Racket"});
    res.redirect('/cart');
});


app.post('/removeboxing', async function(req, res){
    currCostumer = req.session;
    await deleteItemFromCart(client, {item: "Boxing Bag"});
    res.redirect('/cart');
});

app.post('/removesun', async function(req, res){
    currCostumer = req.session;
    await deleteItemFromCart(client, {item: "The Sun and Her Flowers"});
    res.redirect('/cart');
});

app.post('/removeleaves', async function(req, res){
    currCostumer = req.session;
    await deleteItemFromCart(client, {item: "Leaves of Grass"});
    res.redirect('/cart');
});


// async function deleteAllOccur(client, {item: itemName}) {
//     var result = await client.db("firstdb").collection("firstcollection").findOne({ name: currCostumer.currUsername });
//     var resid = result._id;
//     await client.db("firstdb").collection("firstcollection").updateOne({ _id: resid},{$pullAll: {cart: [itemName]}});
//     currCostumer.currCart = (await client.db("firstdb").collection("firstcollection").findOne({ name: currCostumer.currUsername })).cart;
// }


// app.post('/removealliphone', async function(req, res){
//     await deleteAllOccur(client, {item: "iphone"});
//     res.redirect('/cart');
// });

// app.post('/removeallgalaxy', async function(req, res){
//     await deleteAllOccur(client, {item: "galaxy"});
//     res.redirect('/cart');
// });

// app.post('/removealltennis', async function(req, res){
//     await deleteAllOccur(client, {item: "tennis"});
//     res.redirect('/cart');
// });

// app.post('/removeallboxing', async function(req, res){
//     await deleteAllOccur(client, {item: "boxing"});
//     res.redirect('/cart');
// });

// app.post('/removeallsun', async function(req, res){
//     await deleteAllOccur(client, {item: "sun"});
//     res.redirect('/cart');
// });

// app.post('/removeallleaves', async function(req, res){
//     await deleteAllOccur(client, {item: "leaves"});
//     res.redirect('/cart');
// });

async function clearCart(client) {
  //currCostumer = req.session;
    var result = await client.db("firstdb").collection("firstcollection").findOne({ name: currCostumer.currUsername });
    var resid = result._id;
    await client.db("firstdb").collection("firstcollection").updateOne({ _id: resid},{$set: {cart: []}});
    //currCostumer.currCart = (await client.db("firstdb").collection("firstcollection").findOne({ name: currCostumer.currUsername })).cart;
}

app.post('/clearcart', async function(req, res){
    currCostumer = req.session;
    await clearCart(client);
    res.redirect('/cart');
});

if(process.env.PORT) {
  app.listen(process.env.PORT, function() {console.log('Server started...')});
}
else {
  app.listen(3000, function() {console.log('Server started on port 3000...')});
}