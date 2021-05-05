let START=0
let PLAY=1;
let END=2;
let WIN=3;
let gameState=START;
let monkey ,monkey_running,monkey_stop;
let banana,stone,stone2,banana_img,back_img,stone_img,can;
let survivalTime=0;
let score=0;
let bg;
let ground;
let foodGrp,stoneGrp,stone2Grp;
let logo,logo_img;
let play ,play_img;
let die_Sound,gameOver_Sound,jump_Sound,youWin_Sound;

function preload(){
  back_img=loadImage("jungle.png");
  monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png");
  monkey_stop = loadAnimation("sprite_0.png");
  banana_img=loadImage("banana.png");
  stone_img=loadImage("obstacle.png");
  logo_img=loadImage("logo.png");
  play_img=loadImage("button.png");
  die_Sound=loadSound("die.mp3");
  gameOver_Sound=loadSound("game over sound.mp4");
  jump_Sound=loadSound("jump.mp3");
  youWin_Sound=loadSound("you win.mp4");

}

function setup(){
  can =createCanvas(576,600);

  bg=createSprite(576/2,640/2,600,400);
  bg.addImage(back_img);
  bg.scale=2
  bg.velocityX=-4;
  bg.x=width /2;
  bg.visible=false;

  monkey=createSprite(170,550,50,50);
  monkey.addAnimation("run",monkey_running);
  monkey.addAnimation("stop",monkey_stop);
  monkey.scale=0.3;
  monkey.visible= false;

  ground=createSprite(576/2,550,600,10);
  ground.visible= false;

  logo=createSprite(576/2-100,680/2-100)
  logo.addImage(logo_img);
  logo.visible= true;
  logo.scale=0.7;

  play=createSprite(576/2-50,680/2+100);
  play.addImage(play_img);
  play.visible=true;
  play.scale=0.2

  stoneGrp=new Group();
  foodGrp=new Group();
  stone2Grp=new Group();

}

function draw(){
  background(0);
  

  if(gameState===START){
    push()
    strokeWeight(15);
    stroke("yellow");
    point(10,490);
    pop();

    push();
    textSize(30);
    fill("yellow");
    text("hit play button to play",20,500);
    text("THE MONKEY",576/2-150,50);
    pop();
    
    if(mousePressedOver(play)){
      gameState=PLAY;
      monkey.visible=true;
      logo.visible=false;
      play.visible=false;
      bg.visible=true;

    }
  }
  else{

    

  monkey.collide(ground);

  if(bg.x < 0){
    bg.x = width /2;
  }

  monkey.velocityY=monkey.velocityY+0.5;

  monkey.collide(ground);

  if(gameState===PLAY){

    if(keyDown("space") && monkey.y>170) {
    monkey.velocityY = -12;
    jump_Sound.play();
    }
   monkey.velocityY =monkey.velocityY + 0.8;

    survivalTime=survivalTime+Math.round(frameRate()/60);

    for(let i=0;i<foodGrp.length;i++){
    if(foodGrp.get(i).isTouching(monkey)){
      foodGrp.get(i).destroy();
      score+=2;
      monkey.scale+=+0.1
    }
   } 

   if(stoneGrp.isTouching(monkey)){
     monkey.scale=0.1
     die_Sound.play()
   }



   if(stone2Grp.isTouching(monkey)){
     gameState=END;
     gameOver_Sound.play();
   }

   if(score===10){
     gameState=WIN;
     youWin_Sound.play();
   }

  spawnStone2();
  spawnStone();
  spawnBanana();
   
  }

  if(gameState===WIN){
    foodGrp.setVelocityXEach(0);
    stoneGrp.setVelocityXEach(0);
    stone2Grp.setVelocityXEach(0);
    foodGrp.setLifetimeEach(-1);
    stoneGrp.setLifetimeEach(-1);
    stone2Grp.setLifetimeEach(-1);
    monkey.changeAnimation("stop",monkey_stop);
    bg.velocityX=0;
  }


  if(gameState===END){
    foodGrp.setVelocityXEach(0);
    stoneGrp.setVelocityXEach(0);
    stone2Grp.setVelocityXEach(0);
    foodGrp.setLifetimeEach(-1);
    stoneGrp.setLifetimeEach(-1);
    stone2Grp.setLifetimeEach(-1);
    monkey.changeAnimation("stop",monkey_stop);
    bg.velocityX=0;
    
    
  }

  if(keyDown("r")&& (gameState===END || gameState===WIN)){
    gameState=PLAY;
    foodGrp.destroyEach();
    stoneGrp.destroyEach();
    stone2Grp.destroyEach();
    monkey.changeAnimation("run",monkey_running);
    bg.velocityX=-4;
    score=0;
    survivalTime=0;
    monkey.scale=0.3;
    
  }

 }
 drawSprites();
  textSize(30);
  fill(0);
  text("Score:"+score,25,50);
  text("survivalTime:"+survivalTime,330,50);

  if(gameState===END || gameState===WIN){
    push();
    textSize(40);
    fill(0)
    text("press 'r'to restart",567/2-100,680/2-100);
    pop();
  }

  if(gameState===WIN){
    push();
    textSize(40);
    fill(0)
    text("YOU WIN",567/2-100,680/2-200);
    pop();
  }

}

function spawnStone(){
  if(frameCount % 180===0){
    stone = createSprite(576,500,40,10);
    stone.addImage(stone_img);
    stone.scale=0.3;
    stone.velocityX=-8;
    stone.lifetime=160;
    stone.depth = monkey.depth;
    monkey.depth++;
    stoneGrp.add(stone);
  }
}

function spawnStone2(){
  if(frameCount % 270===0){
    stone2 = createSprite(576,500,40,10);
    stone2.addImage(stone_img);
    stone2.scale=0.3;
    stone2.velocityX=-8;
    stone2.lifetime=160;
    stone2.depth = monkey.depth;
    monkey.depth++;
    stone2Grp.add(stone2);
  }
}

function spawnBanana(){
  let randy=Math.round(random(250,450));
  if(frameCount % 230===0){
    banana=createSprite(576,randy,10,10);
    banana.addImage(banana_img);
    banana.scale=0.5;
    banana.velocityX=-9;
    banana.lifetime=50;
    banana.depth=monkey.depth;
    monkey.depth++;
    foodGrp.add(banana);
  }
}