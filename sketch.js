//declarando as variáveis
var trex,trex_running,trex_colided;
var edges;
var solo,solo_image,bloco;
var nuvem,nuvem_image,nuvem_gp;
var cacto,cacto_image1,cacto_image2,cacto_image3,cacto_image4,cacto_image5,cacto_image6,cacto_gp;
var pontos = 0;
var recordes = 0;
var play = 1;
var end = 0;
var gameState = play;
var gameover,gameover_image;
var restart,restart_image;
var som_pulo,som_morte,som_pontos;

//preload carrega as mídias do jogo
function preload(){
  //animações do trex
  trex_running = loadAnimation("images/trex3.png","images/trex4.png");
  trex_colided = loadAnimation("images/trex_collided.png");
  //imagens do solo
  solo_image = loadImage("images/ground2.png");

  //sons
  som_pulo = loadSound("sound/jump.mp3");
  som_morte = loadSound("sound/die.mp3");
  som_pontos = loadSound("sound/checkPoint.mp3");
 
  //imagem da nuvem
  nuvem_image = loadImage("images/cloud.png");

  //imagens dos cactos
  cacto_image1 = loadImage("images/obstacle1.png");
  cacto_image2 = loadImage("images/obstacle2.png");
  cacto_image3 = loadImage("images/obstacle3.png");
  cacto_image4 = loadImage("images/obstacle4.png");
  cacto_image5 = loadImage("images/obstacle5.png");
  cacto_image6 = loadImage("images/obstacle6.png");

  //imagem do gameover
  gameover_image = loadImage("images/gameOver.png");

  //imagem do restart
  restart_image = loadImage("images/restart.png");
}
  

//setup faz a configuração
function setup(){
  createCanvas(windowWidth,windowHeight);
  //tamanho da tela de antes 600,200

  //criando bordas
  edges = createEdgeSprites();

  //sprite trex
  trex = createSprite(50,height - 40,20,40);
  trex.addAnimation("run",trex_running);
  trex.addAnimation("colided",trex_colided);
  trex.scale = 0.5;
  trex.debug = false;
  trex.setCollider("rectangle",0,0,35,80,25);
  //trex.setCollider("circle",0,0,+20);

  //sprite do solo
  solo = createSprite(width/ 2,height - 20,width,10);
  solo.addImage(solo_image);
  bloco = createSprite(width/ 2,height - 5,width,10);
  bloco.visible = false;

  //criando grupos
  nuvem_gp = new Group();
  cacto_gp = new Group();

  //sprite gameover
  gameover = createSprite(width/ 2,height - 100,10,10);
  gameover.addImage(gameover_image);
  gameover.scale = 0.6;
  gameover.visible = false;

  //sprite restart
  restart = createSprite(width/ 2,height - 70,10,10);
  restart.addImage(restart_image);
  restart.scale = 0.5
  restart.visible = false;
}

//draw faz o movimento, a ação do jogo
function draw(){
  background("white");

  //verificando a colisão do trex
  if (trex.isTouching(cacto_gp)) {
    gameState = end;
    //som_morte.play();
  }
  //criando gameState
  if (gameState === play){
    pontos = pontos + Math.round(getFrameRate() / 60);

    //som da pontução quando da 100
    if (pontos % 100 === 0 && pontos > 0){
      som_pontos.play();
    }
    //pulo do trex
    if (keyDown("space") || touches > 0 && trex.y > height - 80) {
      trex.velocityY = -10;
      som_pulo.play();
      touches = [];
    }
    //movimento do solo
    solo.velocityX = -(2 + pontos / 100);
    if (solo.x < 0) {
      solo.x = solo.width /2;
    }
    //chamando a função das nuvens
    gerarNuvens();
    //chamando a função dos cactos
    gerarCactos();

  }

  if (gameState === end){
    trex.changeAnimation("colided",trex_colided);
    solo.velocityX = 0;
    cacto_gp.setVelocityXEach(0);
    nuvem_gp.setVelocityXEach(0); 
    cacto_gp.setLifetimeEach(-1);
    nuvem_gp.setLifetimeEach(-1);
    gameover.visible = true;
    restart.visible = true;
    if (recordes < pontos) {
      recordes = pontos;
    }
    if (mousePressedOver(restart)) {
      gameState = play;
      gameover.visible = false;
      restart.visible = false;
      cacto_gp.destroyEach();
      nuvem_gp.destroyEach();
      trex.changeAnimation("run",trex_running);
      pontos = 0;
     
      
    }
  }

  //var dado = Math.round(random(1,6));
  //text(frameCount,300,150);

  //fazendo a pontução e os recordes
  text("Pontuação: " + pontos,width - 599,height - 175);
  text("Recordes: " + recordes,width - 599,height - 163);

  gravity();

  trex.collide(bloco);

  //console.log (trex.y);

  //coordenadas do mouse na tela
  text("X: "+mouseX+" / Y: "+mouseY,mouseX,mouseY)
  drawSprites();
}

//função para dar gravidade no trex
function gravity(){
  trex.velocityY = trex.velocityY + 0.5
}

//função para gerar nuvens na tela
function gerarNuvens(){
  if (frameCount % 60 === 0) {
    nuvem = createSprite(width,random(height - 170,height - 50));
    nuvem.velocityX = -(2 + pontos / 100);
    nuvem.addImage(nuvem_image);
    nuvem.scale = random(0.3,1.5);
    nuvem.depth = trex.depth -1;
    nuvem.lifetime = width/ nuvem.velocityX;
    nuvem_gp.add(nuvem);
  }
}

//função para gerar cactos na tela
function gerarCactos(){
  if (frameCount % 100 === 0) {
    cacto = createSprite(width,height - 30,60,60);
    cacto.velocityX = -(2 + pontos / 100);
    var sorteioCacto = Math.round(random(1,6));
    switch (sorteioCacto) {
      case 1:cacto.addImage(cacto_image1);
        break;
      case 2:cacto.addImage(cacto_image2);
        break;
      case 3:cacto.addImage(cacto_image3);
        break;
      case 4:cacto.addImage(cacto_image4);
        break;
      case 5:cacto.addImage(cacto_image5);
        break;
      case 6:cacto.addImage(cacto_image6);
        break;
    }
    cacto.scale = 0.3;
    cacto.lifetime = width/ cacto.velocityX;
    cacto_gp.add(cacto);
  }


}