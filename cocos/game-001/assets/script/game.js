
cc.Class({
    extends: cc.Component,

    properties: {
		playerNode: cc.Node,
		boomNode: cc.Node,
		enemyNode: cc.Node,
		scoreLabel: cc.Label, 
    },

	onLoad () {

		this.score = 0;
		this.placePlayer();
		this.placeEnemy();

		this.node.on('touchstart',this.fire,this); // 绑定点击事件
	},

	update(dt) {
		if (this.playerNode.position.sub(this.enemyNode.position).mag() < this.playerNode.width / 2 + this.enemyNode.width / 2) {
			this.enemyNode.active = false;
			this.boom(this.enemyNode.position, this.enemyNode.color);

			this.enemyNode.stopAction(this.enemyAction);
			this.playerNode.stopAction(this.playerAction);
			this.playerNode.stopAction(this.playerDownAction);

			this.scoreLabel.string = ++this.score;
			this.placePlayer();
			this.placeEnemy();
		}
	},

	onDestroy() {


		this.node.off('touchstart',this.fire,this); // 绑定发射事件
	},

	placeEnemy() {
		let x = cc.winSize.width / 2 - this.enemyNode.width / 2;
		let y = Math.random() * cc.winSize.height / 4;
		this.enemyNode.active = true;

		let duration = 1.5 + Math.random() * 0.5;

		this.enemyNode.x = 0;
		this.enemyNode.y = cc.winSize.height / 3 - this.enemyNode.height / 2;

		let seg = cc.repeatForever(
			cc.sequence(
				cc.moveTo(duration, -x, y),
				cc.moveTo(duration, x , y),
			),
		);
		this.enemyAction = this.enemyNode.runAction(seg);
	},
	
	// 放置玩家节点
	placePlayer() {

		this.isFire = false;
		this.playerNode.active = true;
		this.playerNode.y = -cc.winSize.height / 4;

		let duration = 15;
		let seg = cc.sequence(
			cc.moveTo(duration, cc.v2(0, -(cc.winSize.height / 2 - this.playerNode.height) )),
			cc.callFunc(()=> {
				this.die();
			}),
		);
		this.playerDownAction = this.playerNode.runAction(seg);
	},

	// 发射
	fire() {
		if (this.isFire) return;
		this.isFire = true;
		console.log("发射");
		let duration = 0.6;
		let seg = cc.sequence(
			cc.moveTo(duration, cc.v2(0, cc.winSize.height/2)),
			cc.callFunc(() => {
				this.die()
			})

		);
		this.playerAction = this.playerNode.runAction(seg);

		 
	},

	/// 游戏结束
	die() {
		console.log("游戏结束");
		this.playerNode.active = false;
		this.boom(this.playerNode.position, this.playerNode.color);

		
		setTimeout(()=>{
			cc.director.preloadScene('game',function(){
				cc.loader.onProgress= null;
				cc.director.loadScene('game');
			});
		},1000);
	},

	/// 爆炸
	boom(pos, color) {
		this.boomNode.setPosition(pos);
		let particle = this.boomNode.getComponent(cc.ParticleSystem);
		if (color !== undefined) {
			particle.startColor = particle.endColor = color;
		}
		particle.resetSystem();

	},
});
