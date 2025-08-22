import { _decorator, Component, AnimationComponent, Collider2D, Contact2DType } from 'cc';
import { Animation_Control } from './Animation_Control';
const { ccclass, property } = _decorator;

@ccclass('Hero_Collider')
export class Hero_Collider extends Component {
    private originalClipName: string | null = null;
    private animationControl: Animation_Control | null = null;

    onLoad(): void {
        console.log('Hero_Collider onLoad');
        const collider = this.getComponent(Collider2D);
        this.animationControl = this.getComponent(Animation_Control);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
        }
    }
    onCollisionEnter(selfCollider: Collider2D, otherCollider: Collider2D): void {
        console.log('碰撞开始');
        if (this.animationControl) {
            console.log('Hero_Collider 播放碰撞动画');

            this.animationControl.hurt();
        }
    }
}


