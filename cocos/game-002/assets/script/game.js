/// <reference path="../../creator.d.ts"/>

cc.Class({
    extends: cc.Component,

    properties: {
        ballNode: cc.Node,
        blockPrefab: cc.Prefab,
        areaNode: cc.Node,
        scoreLabel: cc.Label,
    },

    onLoad() {
        this.initPhysics();

        this.node.on("touchstart",this.boost,this);

        this.gameStart = 0;
        this.score = 0;
        this.initBlock();
    },

    update(dt) {
        if (this.gameStart) {
            let speed = -450 * dt;
            for (let blockNode of this.blockNodeArr) {
                blockNode.x += speed;

                if (blockNode.x < -cc.winSize.width / 2 - blockNode.width / 2) {
                    this.refreshScore(1);
                    blockNode.x = this.getLastBlockPosX() + 200;
                    let width = 80 + (Math.random()>.5 ? 1 : -1) * (Math.random() * 40);
                    blockNode.getComponent("block").init(width);
                }
            }
        }

        if (this.ballNode.y < -cc.winSize.height / 2) {
            cc.director.loadScene("game");
        }
    },

    onDestroy() {
        this.node.off("touchstart",this.boost, this);
    },

    // 初始化跳板
    initBlock() {
        this.lastBlockX = this.ballNode.x;    // 最后一个方块x轴
        this.blockNodeArr = [];
        for (var i = 0; i < 10; i++) {

            let blockNode = cc.instantiate(this.blockPrefab);
            blockNode.x = this.lastBlockX;
            blockNode.y = 0;
            let width = 80 + (Math.random()>.5 ? 1 : -1) * (Math.random() * 40);
            blockNode.getComponent("block").init(width);
            this.areaNode.addChild(blockNode);
            this.blockNodeArr.push(blockNode);
            this.lastBlockX += 200;
        }
    },

    /// 初始化物理引擎
    initPhysics() {

        let manager = cc.director.getPhysicsManager()
        manager.enabled = true;
        manager.gravity = cc.v2(0, -2400);
        this.scoreLabel.y = cc.winSize.height / 5 * 3;
        this.scoreLabel.x = cc.winSize.width / 5 * 3;
    },

    boost() {
        if (this.ballNode.getComponent("ball").initVelocity) {
            let rigidBody = this.ballNode.getComponent(cc.RigidBody);
            rigidBody.linearVelocity = cc.v2(0, -1600);
            this.gameStart = 1;
        }
    },

    /// 获取最后一个目标的x轴
    getLastBlockPosX() {
        let posX = 0;
        for (let blockNode of this.blockNodeArr) {
            if (blockNode.x > posX) {
                posX = blockNode.x;
            }
        }
        return posX;
    },

    /// 刷新得分
    refreshScore(incr) {
        this.score += incr;
        this.scoreLabel.string = this.score;
    }

});
