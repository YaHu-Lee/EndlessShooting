import { _decorator, Component, Collider2D, Contact2DType, Node, Asset, Sprite, SpriteFrame, UITransform } from 'cc';
import { Hero } from '../Hero/Hero';
import { Hero_Fight } from '../Hero/Hero_Fight';
import { SingleAnimation } from '../../utils/singleAnimation';
const { ccclass, property } = _decorator;

@ccclass('BulletController')
export class BulletController extends Component {
    @property(Number)
    attack: number = 10;

    bulletDestroySpriteFrames: SpriteFrame[];

    singleAnimation: SingleAnimation;

    onLoad() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
        }
    }

    onCollisionEnter(selfCollider: Collider2D, otherCollider: Collider2D) {
        console.log(`子弹碰撞到了 ${otherCollider.node.name}`);
        const hero = otherCollider.node;
        if (hero) {
            const boomSprite = new Node();
            boomSprite.addComponent(Sprite);
            const singleAnimation = new SingleAnimation(boomSprite, this.node, {
                width: 256 / 4,
                height: 240 / 4,
                count: 16,
                columns: 4,
                rows: 4,
                speed: 0.01
            }, this.bulletDestroySpriteFrames?.[0]);
            this.node.addChild(boomSprite);
            console.log(`子弹命中！攻击力: ${this.attack}`);
            hero.getComponent(Hero_Fight).takeDamage(this.attack);
            singleAnimation.start();
        }
    }
}