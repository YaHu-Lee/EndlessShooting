import { _decorator, Component, Collider2D, Contact2DType, Node } from 'cc';
import { Hero } from '../Hero/Hero';
import { Hero_Fight } from '../Hero/Hero_Fight';
const { ccclass, property } = _decorator;

@ccclass('BulletController')
export class BulletController extends Component {
    @property(Number)
    attack: number = 10;

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
            console.log(`子弹命中！攻击力: ${this.attack}`);
            hero.getComponent(Hero_Fight).takeDamage(this.attack);
            this.node.destroy();
        }
    }
}