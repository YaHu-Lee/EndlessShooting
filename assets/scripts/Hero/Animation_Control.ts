import { _decorator, Component, Node, Animation, SpriteFrame, Texture2D, Sprite, UITransform } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 控制角色动画的优先级
 * 1. 死亡动画优先级最高。死亡动画一旦触发，其他动画都不播放。
 * 2. 受伤动画优先级次高。受伤动画触发后，其他动画可以播放，但必须等待受伤动画完播，受伤动画播放需要 0.2 秒。
 * 3. 移动动画 和 静止 优先级最低。移动动画和静止动画触发后，其他动画可以播放。
 */
@ccclass('Animation_Control')
export class Animation_Control extends Component {
    private animation: Animation | null = null;
    private isDead = false;
    private isHurt = false;

    onLoad() {
        this.animation = this.getComponent(Animation);
    }

    update() {
        const spriteNode = this.node.getComponent(Sprite);
        const spriteTexture = spriteNode.spriteFrame.texture;
        const transform = this.getComponent(UITransform);
        transform.setContentSize(spriteTexture.width / 3, spriteTexture.height / 3);
    }

    run() {
        if (this.isDead || this.isHurt) {
            return;
        }
        if (!this.animation || this.animation.getState('hero_run').isPlaying) {
            return;
        }
        this.animation.play('hero_run');
    }

    stay() {
        if (this.isDead || this.isHurt) {
            return;
        }
        if (!this.animation || this.animation.getState('hero_stay').isPlaying) {
            return;
        }
        this.animation.play('hero_stay');
    }

    hurt() {
        if (this.isDead) {
            return;
        }
        if (!this.animation || this.animation.getState('hero_hurt').isPlaying) {
            return;
        }
        this.isHurt = true;
        this.animation.play('hero_hurt');
        this.scheduleOnce(() => {
            this.isHurt = false;
        }, 0.2);
    }

    die() {
        if (this.isDead) {
            return;
        }
        if (!this.animation || this.animation.getState('hero_die').isPlaying) {
            return;
        }
        this.isDead = true;
        this.animation.play('hero_die');
    }

    get dead() {
        return this.isDead;
    }
}


