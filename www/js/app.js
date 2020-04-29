window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};


document.addEventListener("init", function(event){

    if(event.target.id == "home"){
      openDb();
      getItems();
    }

});


var db = null;

function onError(tx,e){
  alert("Something went wrong:"+ e.Message);
}


function onSuccess(tx,r){
  getItems();
}

function openDb(){

  db = openDatabase("ShoppingList","1","Shopping list",1024*1024);
  // 1Mb  equivalent to 1024*1024

  db.transaction(function(tx){
 
      tx.executeSql("CREATE TABLE IF NOT EXISTS items ( ID INTEGER PRIMARY KEY ASC, item TEXT )",[]);

  });

}

function renderItems(tx,rs){

  var output = "" ;
  var list = document.getElementById("shoppinglist");

  for ( i = 0 ; i<rs.rows.length ; i++) {

    var row = rs.rows.item(i);
    console.log("<br/>entry :"+ row.item );

    output += "<ons-list-item>"+ row.item +
                  "<div class=\"right\">"+
                    "<ons-button onclick='deleteItems("+row.ID+");'>"+
                      "<ons-icon icon=\"trash\">"+
                      "</ons-icon>"+
                    "</ons-button>"+
                  "</div>"+
                "</ons-list-item>";
  };

  list.innerHTML = output;

}


function getItems(){

  db.transaction(function(tx){
    tx.executeSql("Select * from items",[], renderItems, onError);
  });

}


function addItem(){
  var textbox  = document.getElementById("item")
  var value = textbox.value;

  db.transaction(function(tx){
    tx.executeSql("INSERT INTO items (item) VALUES (?) ", [value], onSuccess,onError);
  });

  textbox.value = "";

  fn.load("home.html");

}

function deleteItems(id){

  db.transaction(function(tx){

    tx.executeSql("DELETE FROM items WHERE ID=?",[id],onSuccess,onError);

  })

}