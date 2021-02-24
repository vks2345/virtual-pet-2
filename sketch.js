//Create variables here
var dog;
var happyDog;
var database
var foodS, foodStock;

var milkBottleimg;

var feedDog, addFood;
var fedTime, lastFed;
var foodObj;


function preload()
{
	//load images here
  dog= loadImage("images/dogImg.png");
  happyDog= loadImage("images/dogImg1.png");
  

}

function setup() {
  
  database= firebase.database();
  createCanvas(500, 500);
  dogSprite= createSprite(250,300,10,10);
  dogSprite.addImage(dog);
  dogSprite.scale= 0.2;

  foodStock= database.ref('Food');
  foodStock.on("value",readStock);

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  foodObj= new Food();
  
}


function draw() {  

  background(46,139,87);
  
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  textSize(20);
  fill("black");

  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM",350,30);
  }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
  }else{
    text("Last Feed : "+ lastFed + " AM", 350,30);
  }
   

  drawSprites();
  //add styles here
 
  text("food remaining : "+ foodS, 170,200);
  
  
}

function readStock(data){
  foodS= data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  if(x<=0){
  x=0;
  }else{
     x=x-1;
  }
  database.ref('/').update({
    Food: x
  })

}

function feedDog(){
  dogSprite.addImage(happyDog);
  if(foodObj.getFoodStock()<=0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}



