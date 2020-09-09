/// <reference path="../../creator.d.ts"/>

cc.Class({
    extends: cc.Component,

    properties: {

        yellowBallPrefab: cc.Prefab,
        blueBallPrefab: cc.Prefab,
    },

    onLoad() {

        this.ballNodeArr = [];

        setInterval(()=>{
            let random = Math.random() > 0.5 ? 1 : -1;
            if (random == 1) {
                this.initBall(this.yellowBallPrefab);
            }else {
                this.initBall(this.blueBallPrefab);
            }
        }, 500);
    },

    update(dt) {
        var insideBallNodeArr = [];
        for (let ballNode of this.ballNodeArr) {
            if (ballNode.getContentSize.width < 40) {
                // ballNode.setContentSize(cc.v2(ballNode.getContentSize.width + 1, ballNode.getContentSize.height + 1));
                // ballNode.setScale(0)
            }else {
                ballNode.setPosition(ballNode.x, ballNode.y + 1);
            }

            if (ballNode.y + ballNode.width < cc.winSize.height) {
                insideBallNodeArr.push(ballNode);
            }
        }
        this.ballNodeArr = insideBallNodeArr;
    },

    initBall(prefab) {
        let ballNode = cc.instantiate(prefab);
        ballNode.setScale(0);
        let direction = Math.random() > 0.5 ? 1 : -1;
        let x = Math.random() * cc.winSize.width * direction;
        ballNode.setPosition(cc.v2(x, -cc.winSize.height / 4));
        this.node.addChild(ballNode);
        this.ballNodeArr.push(ballNode);

        ballNode.runAction(
            // cc.easeBackOut.create(cc.setScale(0.8,1,1)),
            // cc.setScale(0.8,1,1),
            cc.scaleTo(0.5,1,1),
        );
    },
});
