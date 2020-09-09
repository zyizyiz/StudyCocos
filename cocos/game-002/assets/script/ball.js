/// <reference path="../../creator.d.ts"/>

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        this.initVelocity = 0;
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        let rigidBody = selfCollider.getComponent(cc.RigidBody);
        if (this.initVelocity == 0) {
            this.initVelocity = rigidBody.linearVelocity.y;

        } else {
            rigidBody.linearVelocity = cc.v2(0,this.initVelocity);
        }
    },
});
