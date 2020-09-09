/// <reference path="../../creator.d.ts"/>


cc.Class({
    extends: cc.Component,

    properties: {
        targetNode: cc.Node,
        knifeNode: cc.Node,
        knifePrefab: cc.Prefab,

    },
    
    onLoad() {

        this.canThrow = true;
        this.targetRotation = 3;

        this.targetNode.zIndex = 1;

        this.knifeNodeArr = [];

        setInterval(()=> {
            this.changeSpeed();
        },2000);

        this.node.on("touchstart",this.throwKnife, this);
    },

    update(dt) {
        this.targetNode.angle = (this.targetNode.angle + this.targetRotation) % 360

        for (let knifeNode of this.knifeNodeArr) {
            knifeNode.angle = (knifeNode.angle + this.targetRotation) % 360
            let r =  this.targetNode.width / 2;

            let rad = Math.PI * (knifeNode.angle - 90) / 180;
            knifeNode.x = this.targetNode.x + r * Math.cos(rad);
            knifeNode.y = this.targetNode.y + r * Math.sin(rad);
        }
    },

    onDestroy() {
        this.node.off("touchstart",this.throwKnife, this);
    },

    throwKnife() {
        if (this.canThrow) {
            this.canThrow = false;

            this.knifeNode.runAction(cc.sequence(
                cc.moveTo(0.5, cc.v2(this.knifeNode.x, this.targetNode.y - this.targetNode.width / 2)),
                cc.callFunc(()=>{

                    let isHit = false;

                    let gap = 15;

                    for (let knifeNode of this.knifeNodeArr) {
                        if (Math.abs(knifeNode.angle) < gap || Math.abs(360 - knifeNode.angle) < gap) {
                            isHit = true;
                            break;
                        }
                    }
                    if (isHit) {
                        this.knifeNode.runAction(cc.sequence(
                            cc.spawn(
                                cc.moveTo(0.25, cc.v2(this.knifeNode.x, -cc.winSize.height / 2)),
                                cc.rotateTo(0.25, 30),
                            ), 
                            cc.callFunc(()=> {
                                cc.director.loadScene("game");
                            }),
                        ));

                    }else {

                        let knifeNode = cc.instantiate(this.knifePrefab);
                        knifeNode.setPosition(this.knifeNode.position);
                        this.node.addChild(knifeNode);
                        this.knifeNode.setPosition(cc.v2(0, -300));
                        this.knifeNodeArr.push(knifeNode);
    
    
                        this.canThrow = true;
                    }

                }),

            ));
        }

    },

    changeSpeed() {
        let dir = Math.random()>0.5? 1:-1;
        let speed = 1 + Math.random() * 4;

        this.targetRotation = dir * speed;
    },


});
