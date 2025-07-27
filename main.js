/*
 * constant
 */
var SCREEN_WIDTH   = 800;
var SCREEN_HEIGHT   = 450;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;

var WorldVX;
var WorldVY;
var WorldY;
var WorldX;


var PLAYER;
var ROCK;

var GameMain;

var RESULT = {
    main: { // MainScene用ラベル
        children: [{
            type: "Label",
            name: "Resultscore",
            fontSize: 32,
            fillStyle: "White",
            shadowBlur: 4,
            x: SCREEN_WIDTH /2,
            y: SCREEN_HEIGHT /2 - 100,
        },
        {
            type: "Label",
            name: "comment",
            fontSize: 23,
            fillStyle: "White",
            shadowBlur: 4,
            x: SCREEN_WIDTH /2,
            y: (SCREEN_HEIGHT /2 - 100) + 35,
        }],
    }
};

var ASSETS = {
    "title":  "./img/title.png",
    "Player":  "./img/Player.png",
    "PlayerSS":  "./img/PlayerSS.tmss",
    "Sora":  "./img/Sora.png",
    "Zimen":  "./img/Zimen2.png",
    "Yama":  "./img/Yama.png",
    "Rock":  "./img/Rock.png",
    "Musuko":  "./img/Musuko.png",
    "MusukoSS":  "./img/MusukoSS.tmss",
    "MusukoMater":  "./img/MusukoMater3.png",
    "MusukoMaterSS":  "./img/MusukoMaterSS.tmss",
    "Kemuri":  "./img/Kemuri.png",
    "Raion":  "./img/raion.png",
    "Yazirusi":  "./img/Yazirusi.png",
    "Hit":  "./img/Hit.png",

    "RetryButton":  "./img/ResultButton/Retry.png",
    "TweetButton":  "./img/ResultButton/Tweet.png",
    "LogoButton":  "./img/ResultButton/logo.png",


};

var DEFAULT_PARAM = {
    width: 465,
    height: 465
};


var point;

var BackGroup;

var BulletGroup;
var EnemyGroup;
var EffectGroup;
var ZimenGroup

tm.main(function() {
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();

    app.background = "#FFFFFF";

    var loading = tm.app.LoadingScene({
        assets: ASSETS,
        nextScene: TitleScene,
    });
    app.replaceScene(loading);

    //音楽
    //tm.sound.SoundManager.add("bound", "https://github.com/phi1618/tmlib.js/raw/0.1.0/resource/se/puu89.wav");

    app.run();
});

tm.define("TitleScene", {
    superClass : "tm.app.Scene",

    init : function() {
        this.superInit({
            title :  "ライオンが勃起してるタイミングで石を投げると遠くに飛ぶゲーム",
            width :  SCREEN_WIDTH,
            height : SCREEN_HEIGHT
        });

        this.title = tm.app.Sprite("title", SCREEN_WIDTH, SCREEN_HEIGHT).addChildTo(this);
        this.title.position.set(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);


        this.Starttext  = TextObject().addChildTo(this);
        this.Starttext.text = "タッチで石を投げる";
        this.Starttext.fontSize = 30;
        this.Starttext.x = SCREEN_WIDTH / 2;
        this.Starttext.y = SCREEN_HEIGHT / 2;



        this.Starttext.tweener
            .clear()
            .to({scaleX:1,scaleY:1}, 700,"easeInSine")
            .to({scaleX:1.2,scaleY:1.5}, 700,"easeInSine")
            .setLoop(true);

        // 画面(シーンの描画箇所)をタッチした時の動作
        this.addEventListener("pointingend", function(e) {
            // シーンの遷移
            e.app.replaceScene(MainScene());
        });




    },

    update: function(app) {

    },


});



tm.define("MainScene", {
    superClass: "tm.app.Scene",

    init: function() {
        // 親の初期化
        this.superInit();
        GameMain = this;

        BackGroup = tm.app.CanvasElement().addChildTo(this); //
        this.SoraGroup = tm.app.CanvasElement().addChildTo(this); //
        this.YamaGroup = tm.app.CanvasElement().addChildTo(this); //
        ZimenGroup = tm.app.CanvasElement().addChildTo(this); //

        this.Yazirusi = Yazirusi().addChildTo(this);

        EffectGroup = tm.app.CanvasElement().addChildTo(this);


        this.Player = Player().addChildTo(this);
        this.Rock = Rock().addChildTo(this);

        this.Raion = Raion().addChildTo(this);


        var zimen = Map("Zimen", SCREEN_WIDTH, 70,ZimenGroup,2).addChildTo(ZimenGroup);
        zimen.position.set(SCREEN_CENTER_X, SCREEN_HEIGHT - 35);

        var yama = Map("Yama", SCREEN_WIDTH, SCREEN_HEIGHT ,this.YamaGroup,0.3).addChildTo(this.YamaGroup);
        yama.position.set(SCREEN_CENTER_X, SCREEN_CENTER_Y );

        var sora = Map("Sora", SCREEN_WIDTH * 4, SCREEN_HEIGHT * 4,this.SoraGroup,2).addChildTo(this.SoraGroup);
        sora.position.set(SCREEN_WIDTH *  2, -500);


        WorldVX = 0;
        WorldVY = 0;
        WorldY = 0;
        WorldX = 0;
        var kickCollision = KickCollision(100,100).addChildTo(this);

        this.MusukoMater = MusukoMater().addChildTo(this);

        this,KickTextFLG = false;


        this.HitCombo = 0;

        this.GameOverFLG = false;
        this.gameovertimer = 0;
    },

    update: function(app) {


    	WorldX += WorldVX;
        WorldY += WorldVY;

        if(this.GameOverFLG){

        	this.gameovertimer++;

        	if(this.gameovertimer == 30){
        		this.Score.GameOver();


        	}
        	if(this.gameovertimer == 100){

		    	this.result = Result(this.Score.Score).addChildTo(this);

        	}


        }

    },

    Hit:function(){

    	if(this.HitCombo == 0){
    		this.kicktext.remove();
    	}

    	this.HitCombo ++;



    	this.Rock.Hit();
    	this.Player.Hit();

    	var hittext = HitText().addChildTo(EffectGroup);
    	hittext.text = this.HitCombo + " HIT"
    },

    Shot:function(){

    	var power = 0;

    	this.Yazirusi.ActiveFLG = false;
    	this.Raion.Musuko.ActiveFLG = false;

    	this.Score = ScoreText().addChildTo(EffectGroup);



    	switch(this.Raion.Musuko.State){

    		case 1:
    			power = 15;
    		break;

    		case 2:
    			power = 22;
    		break;

    		case 3:
    			power = 30;

    		break;

    		case 4:
    			power = 38;

    		break;

    		case 5:
    			power = 45;
    		break;


    	}


		GameMain.Rock.Shot(power,this.Yazirusi.rotation);
    },


    //石が下降し始めたタイミングで発火
    DrawKickText:function(){

    	if(!this.KickTextFLG){
		    this.kicktext = KickText(this.Player.y).addChildTo(EffectGroup);
		    this.KickTextFLG = true;
    	}

    },


    GameOver:function(){

    	if(this.HitCombo == 0){

    		if(this.kicktext != null){
	    		this.kicktext.remove();
    		}

    		WorldVY = 0;
    		WorldVX = 0;

    	}

    	this.GameOverFLG = true;




    }

});

tm.define("Player", {
    superClass: "tm.app.AnimationSprite",

    init: function () {
        this.superInit("PlayerSS");
        this.gotoAndPlay("Kamae");

        //--初期値設定
        //ポジションとサイズ;
        this.width = 100;
        this.height = 100;

        this.x =215;
        this.y = 330;

        this.Speed = 5;

        this.vx = this.Speed;

        this.setBoundingType("rect");

        this.State = "Kamae";

        this.ry = 1;
        this.vy = 0;
        this.vx = this.Speed;

     //   this.KickCollision = KickCollision(this.x,this.y).addChildTo(this);
        this.KickCollision = KickCollision(30,-35).addChildTo(this);

        this.timer = 0;

        this.HitFLG = false;


        this.KizyunX = 260;

        //キック時のワールドvx
        this.KickWorldVX =0;
    },

    update: function(app) {
        this.y += WorldVY;

        switch(this.State){
            case "Run":
                this.Run(app);
            break;


            case "Kick":
                this.Kick();
            break;

            case "Kamae":
            	this.Kamae(app);
           	break;

            case "Nageru":
            	this.Nageru();
           	break;

        }

    },


    Kamae: function(app){
    	if(app.pointing.getPointingStart()){

    		GameMain.Shot();

    		this.State = "Nageru";
    		this.gotoAndPlay("Nage");

    		this.timer = 0;

    		this.tweener
            .clear()
            .to({x:this.x + 40,scaleX:1.2,scaleY:1.5}, 200,"easeInSine")
            .to({scaleX:1,scaleY:1}, 200,"easeInSine")

            var kemuri = Kemuri(this.x,this.y).addChildTo(EffectGroup);

    	}


    },

    Nageru: function(){
    	this.timer++;


    	if(this.timer > 20){
    		this.timer = 0;
    		this.gotoAndPlay("Run");
    		this.State = "Run";
    	}
    },



    Run: function(app){

    	//基準位置に収束
        if(this.x < this.KizyunX ){
            this.x += this.vx;

            if(this.x > this.KizyunX ){
            	this.x = this.KizyunX ;
            }
        }
        if(this.x > this.KizyunX ){
            this.x -= (this.vx * 2);

            if(this.x < this.KizyunX ){
            	this.x = this.KizyunX ;
            }

        }

        if(app.pointing.getPointingStart()){


        	//キック開始
        	if(this.x < SCREEN_WIDTH){

	            this.gotoAndPlay("Kick");
	            this.State = "Kick";

	            this.vx = 24;
	            this.vy = -10;
	            this.KickWorldVX = WorldVX
	            this.KickCollision.On();
	            this.HitFLG = false;

	            var kemuri = Kemuri(this.x - 50,this.y).addChildTo(EffectGroup);
        	}


        }



    },

    Kick:function(){




    	if(this.HitFLG){
	    	this.x -= (this.vx * 2);

    	}
    	else{
       		this.x += this.vx;
    	}


        this.y += this.vy;
        this.vy += this.ry;
        this.vx -= 0.2;


        var zc = ZimenGroup.children;
        var self = this;
        zc.each(function(z) {
            if(self.isHitElementRect(z)){
            	self.gotoAndPlay("Run");
            	self.vx =0;
            	self.vy =0;


            	self.y = z.y - (z.height / 2) - (self.height / 2);

            	self.State = "Run";
           		self.KickCollision.Off();
           		self.vx = self.Speed;
            }
        });

    },

    Hit:function(){
    	this.HitFLG = true;

    }


});

tm.define("Kemuri", {
    superClass: "tm.app.Sprite",

    init: function (x,y) {
        this.superInit("Kemuri");

        this.width = 200;
        this.height = 100;

        this.x =  x - 30;
        this.y =  y + 15;

        this.scaleX = 0.5;


        this.tweener
        .to({x:this.x - 50,scaleX:1,scaleY:1},200)
        .to({x:this.x - 150,scaleX:1.5,scaleY:1,alpha:0},400)

        this.timer = 0;
    },

    update: function(){

    //	this.x +=WorldVX;
    	this.y += WorldVY;

    	this.timer++;
    	if(this.timer > 60){
    		this.remove();
    	}


    }

});

tm.define("RKemuri", {
    superClass: "tm.app.Sprite",

    init: function (x,y) {
        this.superInit("Kemuri");

        this.width = 200;
        this.height = 100;

        this.x =  x + 30;
        this.y =  y + 15;

        this.scaleX = - 0.5;


        this.tweener
        .to({x:this.x + 50,scaleX:-1,scaleY:1},200)
        .to({x:this.x + 150,scaleX:-1.5,scaleY:1,alpha:0},400)

        this.timer = 0;
    },

    update: function(){

    //	this.x +=WorldVX;
    	this.y += WorldVY;

    	this.timer++;
    	if(this.timer > 60){
    		this.remove();
    	}


    }

});


tm.define("HitEffect", {
    superClass: "tm.app.Sprite",

    init: function (x,y) {
        this.superInit("Hit");

        this.width = 80;
        this.height = 80;

        this.x =  x - 10;
        this.y =  y + 10;





        this.tweener
        .wait(50)
        .to({scaleX:0.3,scaleY:0.3,alpha:0},100)


        this.timer = 0;

    },

    update: function(){

    //	this.x +=WorldVX;
    	this.y += WorldVY;

    	this.timer++;
    	if(this.timer > 60){
    		this.remove();
    	}

    }

});

//キックの当たり判定----------------------------------------------------------------
tm.define("KickCollision", {
    superClass: "tm.app.CanvasElement",

    init: function(X,Y) {

        this.superInit();
        this.x = X;
        this.y = Y;

        this.mx = X;
        this.my = Y;

        this.width = 20;
        this.height = 20;

        this.setBoundingType("rect");

        this.color = "hsla(133, 100%, 50%, 1)";

        this.ColisionFLG = false;

        this.setAlpha(0);
        this.Off();
    },

    update: function(app) {

    	this.x = this.mx + GameMain.Player.x;
    	this.y = this.my + GameMain.Player.y;

		if(this.ColisionFLG){
		    if(this.isHitElement(GameMain.Rock)){
		   		GameMain.Hit();
		   		this.Off();

		    }
		}

    },

    draw: function(c) {
        c.fillStyle = this.color;
        c.strokeStyle = this.color;
		c.fillRect(-GameMain.Player.x, -GameMain.Player.y,this.width, this.height, 8);
    },

    On: function(){
        this.ColisionFLG = true;
      //  this.setAlpha(0.6);
    },

    Off:function(){
        this.ColisionFLG = false;
      //  this.setAlpha(0);
    }

});


tm.define("Rock", {
    superClass: "tm.app.Sprite",

    init: function () {
        this.superInit("Rock");

        //--初期値設定
        //ポジションとサイズ;
        this.width = 40;
        this.height = 40;

        this.x =185;
        this.y = 345;


        this.vx = 0;
        this.vy = 0;

        //キックされた時の移動値;

//        this.k
        this.kvx = 0;
        this.kr = 0;
        //初速;
        this.sx = 0;
        this.sy = 0;

        this.r = 0;

        this.gr = 0;

        this.RemitY = 40;
        this.RemitX =600;

        this.MaxRakkaSpeed = 3;

        this.State = "RockMove";
        this.RemitTopYFLG = false;
        this.RemitXFLG = false;

        this.setBoundingType("Circle");

        this.State = "Active";


    },

    update: function(app) {


        switch(this.State){
            case "Active":
                this.Active();
            break;

            case "Stop":
                this.Stop();
            break;
        }


    },

    Active:function(){



        this.rotation+=this.r;


        this.vy +=  this.gr;

        //落下速度制限
        if(this.vy  > this.MaxRakkaSpeed){
             this.vy = this.MaxRakkaSpeed;
        }

        //横移動限界
        if(this.x > this.RemitX){
            WorldVX = -this.vx;

            if(this.x < SCREEN_WIDTH - 50 && this.x > this.RemitX){


	            if(this.kvx < -2){
	            	this.kvx = -2;
	            }
	            this.x += this.kvx;
	            this.kvx -= this.kr;



            }
            if(this.x >= SCREEN_WIDTH - 50){
            	this.x = SCREEN_WIDTH - 50;
	            this.x += this.kvx;
	            this.kvx -= this.kr;


            }
            if(this.x < this.RemitX - this.kvx){
            	this.x = this.RemitX - this.kvx;
            	this.kvx = 0;
            	this.kr = 0;
            }

        }
        else{
        	this.x += this.vx;
        }

        //上昇中
        if(this.y < this.RemitY && this.vy < 0 && WorldY < 1350){
            WorldVY = -this.vy;
            this.RemitYFLG = true;

        }
        //下降中
        else if(this.y > SCREEN_HEIGHT - 350 && this.vy > 0){
            WorldVY = -this.vy;


            GameMain.DrawKickText();
        }
        else{
            WorldVY = 0;
            this.y += this.vy;

        }

        //地面に戻ってきたとき
        if(WorldY + WorldVY < 0){



            WorldVY = 0;
            this.y += this.vy;

        }



        if(this.x < -5){
        	this.State = "Stop";
        	GameMain.GameOver();
        }

        var zc = ZimenGroup.children;
        var self = this;
        zc.each(function(z) {
            if(self.isHitElementRect(z)){
                self.Chakuci();
            }
        });

    },


    Stop:function(){

    },

    Chakuci:function(){
        WorldVX = 0;
        WorldVY = 0;
        this.vy = 0;
        this.State = "Stop";

        var kemuri = Kemuri(this.x,this.y -20).addChildTo(EffectGroup);
        var rkemuri = RKemuri(this.x,this.y - 20).addChildTo(EffectGroup);


        GameMain.GameOver();

    },

    Hit:function(){
    	this.vx += this.sx;
    	this.vy = this.sy;
    	this.gr *= 1.5;
    	this.r += 10;
    	this.MaxRakkaSpeed *= 1.5;

    	this.kvx  =18;
    	this.kr = 1;



        var hit = HitEffect(this.x,this.y).addChildTo(EffectGroup);

    },


    Shot:function(Power,rot){

    	this.sx = Math.cos(rot * Math.PI / 180) * Power;
    	this.sy = Math.sin(rot * Math.PI / 180) * Power;

    	this.vx = this.sx;
    	this.vy = this.sy;

    	this.gr += 0.2;

    	this.r += 20;

    },


});

tm.define("Yazirusi", {
    superClass: "tm.app.Sprite",

    init: function () {
        this.superInit("Yazirusi");

        this.width = 100;
        this.height = 70;

        this.x =  280;
        this.y = 320;


        this.houkou = 1;
        this.r = 5;
		this.origin.x = 0;

		this.ActiveFLG = true;
    },

    update: function(){

    	if(this.ActiveFLG){
    		this.Active();
    	}

    	this.x += WorldVX;
    	this.y += WorldVY;

    },

    Active:function(){
    	 this.rotation += this.r;

    	if(this.rotation < -100){
    		this.rotation = -100;
    		this.r *= -1;
    	}
    	if(this.rotation > 20){
    		this.rotation = 20;
    		this.r *= -1;
    	}
    	this.x +=WorldVX;
    	this.y += WorldVY;

    }

});

tm.define("Raion", {
    superClass: "tm.app.Sprite",

    init: function () {
        this.superInit("Raion");

        this.width = 100;
        this.height = 200;

        this.x =  70;
        this.y = 290;

        this.Musuko = Musuko().addChildTo(this);

    },

    update: function(){

    	this.x +=WorldVX;
    	this.y += WorldVY;
    }

});

tm.define("Musuko", {
    superClass: "tm.app.AnimationSprite",

    init: function () {
        this.superInit("MusukoSS");

        this.width = 55;
        this.height = 55;
        this.x = 40;
        this.y = 42

        this.gotoAndPlay("1");

        this.State = 1;

        this.ActiveFLG = true;

        this.timer = 0;

        this.NextMsuko = 30;
        this.NextMsukoMax = 20;
    },

    update: function(){

    	if(this.ActiveFLG){
    		this.Active();
    	}
    	else{

    	}


    },

    Active:function(){

    	this.timer++;

    	if(this.timer > this.NextMsuko){

    		this.timer = 0;
    		this.NextMsuko = rand(this.NextMsukoMax);

    		var r = rand(this.State - 1);
    		if(r == 0){
    			this.State++;
    		}
    		else{
    			this.State--;
    		}

    		if(this.State > 5){
    			this.State = 5;
    		}
    		if(this.State < 1){
    			this.State = 1;
    		}

    		this.gotoAndPlay(this.State);


    		GameMain.MusukoMater.ChangeMusuko(this.State);
    	}


    }

});

tm.define("MusukoMater", {
    superClass: "tm.app.AnimationSprite",

    init: function () {
        this.superInit("MusukoMaterSS");

        this.width = 130;
        this.height = 130;
        this.x = 80;
        this.y = 90;


        this.State = "1";
        this.gotoAndPlay(this.State);

        this.MaterText  = TextObject().addChildTo(this);
        this.MaterText.setShadowBlur(0)
        this.MaterText.setFillStyle("Black")
        this.MaterText.text = "Power";
        this.MaterText.fontSize = 30;
        this.MaterText.x = 0;
        this.MaterText.y = -75;
    },

    update: function(){

    	this.x +=WorldVX;
    	this.y += WorldVY;


    },

    ChangeMusuko:function(state){
    	this.State = state;
    	this.gotoAndPlay(this.State);

    },


});

tm.define("Map", {
    superClass: "tm.app.Sprite",

    init: function (sprite,width,height,BackGroup,Speed) {
        this.superInit(sprite,width,height);

        this.width = width;
        this.height = height;
        this.setBoundingType("rect");


        this.NextMapFLG = false;
        this.sprite = sprite;
        this.backgroup = BackGroup;
        this.Speed = Speed;

        this.Halfwidth = width / 2;
    },

    update: function(){

        this.x += WorldVX * this.Speed;
        this.y += WorldVY;

        if(this.x < SCREEN_CENTER_X && !this.NextMapFLG){
            this.x = SCREEN_CENTER_X ;
            var nextmap = Map(this.sprite,this.width,this.height,this.backgroup,this.Speed).addChildTo(this.backgroup);
            nextmap.position.set(this.width + this.Halfwidth + WorldVX, this.y);
            if(this.sprite == "Sora"){
                nextmap.x -= 1250;
                nextmap.y = this.y;
            }

            this.NextMapFLG = true;

        }

        if(this.x < 0 - (this.width * 2)){
            this.remove();
        }



    }

});

//テキスト;
tm.define("HitText", {
    superClass: "tm.app.Label",

init: function() {
        this.superInit("");

        this.x = 400;
        this.y = 200;
        this.vx = 0;
        this.vy = 0;

        this.scaleY = 0;


        this.dir = 0;

        this.setFillStyle("#00bfff")
        this.setFontSize(122)
        this.setShadowBlur(4)
        this.setShadowColor("white");

        this.tweener
            .clear()
            .to({scaleX:1.2,scaleY:1.2}, 50,"easeInSine")
            .to({scaleX:1.2,scaleY:1}, 100,"easeInSine")
            .wait(600)
            .to({alpha:0}, 200,"easeInSine")



       // this.text = "HIT";

        this.timer = 0;
        this.DestroyRemit = 100;

    },

    update: function(app) {
    	this.timer ++;

    	if(this.timer > 60){
    		this.remove();
    	}
    },

});

//テキスト;
tm.define("KickText", {
    superClass: "tm.app.Label",

init: function(y) {
        this.superInit("");

        this.x = 300;
        this.y = y - 150;


        this.text = "タッチして蹴れ！";

        this.dir = 0;

        this.setFillStyle("Black")
        this.setFontSize(60)
        this.setShadowBlur(4)
        this.setShadowColor("white");

        this.tweener
            .clear()
            .to({alpha:1}, 400,"easeInSine")
            .to({alpha:0}, 200,"easeInSine")
            .setLoop(true);



       // this.text = "HIT";


    },

    update: function(app) {

    	this.y += WorldVY;
    },

});


//テキスト;
tm.define("TextObject", {
    superClass: "tm.app.Label",

init: function() {
        this.superInit("");

        this.x = 0;
        this.y = 45;
        this.vx = 0;
        this.vy = 0;

        this.dir = 0;

        this.setFillStyle("white")
        this.setFontSize(22)
        this.setShadowBlur(4)
        this.setShadowColor("Black");

        this.text = "";

        this.timer = 0;
        this.DestroyRemit = 100;

    },

    update: function(app) {

    },

});

//テキスト;
tm.define("ScoreText", {
    superClass: "tm.app.Label",

init: function() {
        this.superInit("");

        this.x = 0;
        this.y = 35;

        this.scaleX = 0;
        this.scaleY = 0;

        this.dir = 0;

        this.setFillStyle("white")
        this.setFontSize(66)
        this.setShadowBlur(4)
        this.setShadowColor("Black");

        this.tweener
            .clear()
            .to({x:this.x + 200,y:this.y + 30,scaleX:1,scaleY:1}, 2000,"easeInSine");

    },

    update: function(app) {

    	this.Score = Math.floor(-(WorldX / 10));

        this.text = this.Score + " M";
    },

    GameOver: function(){


        this.tweener
            .clear()
            .to({x:SCREEN_CENTER_X,y:100,scaleX:1.5,scaleY:1.5}, 1000,"easeInSine");


    },

});
tm.define("TobidasuText", {
    superClass: "tm.app.Label",

init: function(stage) {
        this.superInit("");

        this.x = SCREEN_WIDTH / 2;
        this.y = 280;
        this.vx = 0;
        this.vy = 0;
        this.scaleX = 0;
        this.scaleY = 0;

        this.Muki = 1;

        this.setFillStyle("Black")
        this.setFontSize(60)
        this.setShadowBlur(22)
        this.setShadowColor("white");


        this.tweener
            .clear()
            .to({scaleX:2,scaleY:2}, 400,"easeOutBack")
            .wait(1500)
            .to({scaleX:0,scaleY:0}, 200,"easeInSine")

        this.timer = 0;
        this.DestroyRemit = 200;

    },

    update: function(app) {

        this.timer++;
        if(this.timer > this.DestroyRemit){
            this.remove();
        }

    },

});



//テキスト;
tm.define("Result", {
    superClass: "tm.app.Label",

init: function(score) {
        this.superInit("");


        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;

        this.dir = 0;

        this.setFillStyle("white")
        this.setFontSize(40)
        this.setShadowBlur(22)
        this.setShadowColor("white");

        this.ButtonWD = 140;
        this.ButtonHE = 40;
        this.MarginX  = (this.ButtonWD / 2) + 10;
        this.MarginY = 0;

        this.DeleteFLG = false;

        this.ResultTxt = "";


        this.resume =  tm.app.Sprite("RetryButton", this.ButtonWD, this.ButtonHE).addChildTo(this);
        this.resume .setPosition(SCREEN_CENTER_X - this.MarginX, SCREEN_CENTER_Y + this.MarginY);
		this.resume.interactive = true;
		this.resume.boundingType = "rect";

        this.EndFLG = false;
        self = this;
        this.resume .onclick = function() {
            self.EndFLG = true;
        };
        var TweetButton =  tm.app.Sprite("TweetButton", this.ButtonWD, this.ButtonHE).addChildTo(this);
		TweetButton.interactive = true;
		TweetButton.boundingType = "rect";


        TweetButton.setPosition(SCREEN_CENTER_X + this.MarginX, SCREEN_CENTER_Y  + this.MarginY);
        url = "http://cachacacha.com/GAME/RaionBokki/";
        var Tweettxt = encodeURIComponent("Score " + score + "" + this.ResultTxt + " " + url + "  #ライオンが勃起してるタイミングで石を投げると遠くに飛ぶゲーム #かちゃコム");

        TweetButton.onclick = function() {
            window.open("http://twitter.com/intent/tweet?text=" + Tweettxt);
        };

/*
        var Sendentxt = "ハッシュタグ「#Ｇスペでつくってほしいゲーム」で\nつくってほしいゲームをつぶやいてみよう！";



        var SendenText = tm.app.Label(Sendentxt).addChildTo(this);
        SendenText.setFillStyle("#32cd32")
                  .setPosition(SCREEN_WIDTH /2 - 200, SCREEN_CENTER_Y + this.MarginY + 100)
                  .setFontSize(18)
                  .setAlign("left");
*/


		var LogoButton = tm.app.Sprite("LogoButton", 170, 50).addChildTo(this);
		LogoButton.interactive = true;
		LogoButton.boundingType = "rect";


//        var GspeButton =  tm.ui.GlossyButton(170, 50, "#FC7918", "Ｇスペ").addChildTo(this);
        LogoButton.setPosition(SCREEN_CENTER_X, SCREEN_HEIGHT  -40 + this.MarginY);
        LogoButton.onclick = function() {
            window.open("http://www.cachacacha.com/");
        };



        this.timer = 0;
        this.DestroyRemit = 100;

    },

    update: function(app) {


        if(this.EndFLG){
            app.replaceScene(MainScene());
        }



    },

    SetText: function(txt){
        this.text = txt;
    },

    Delete: function(){

        this.cachacom.remove();
        this.tweet.remove();
        this.resume.remove();
        this.ResultText.remove();
        this.ResultText2.remove();
    }

});

//衝突判定
function clash(a,b){
    if((a.L <= b.R) && (a.R >= b.L)
    && (a.T  <= b.B) && (a.B >= b.T))
    {
            return true
    }
    return false;
}

function rand(n){
    return Math.floor(Math.random() * (n + 1));
}
