import { _decorator, Component, Node, Vec3, Prefab, instantiate, math, RigidBody2D, Vec2, director, Sprite, UITransform, Animation, AnimationClip, animation, SpriteFrame, Asset, Texture2D, rect } from 'cc';
import { EnemyAttributes } from './EnemyAttributes';
import { BulletController } from '../Weapon/BulletController';
import { resourceManage } from '../../runtime/resourceManager';
import { ANIMATION_SPEED, ENEMY_HEIGHT, ENEMY_WIDTH } from '../../utils/constant';
import { renderEnemyClip } from '../../utils/renderEnemy';
import { SingleAnimation } from '../../utils/singleAnimation';
import { commonBulletPath } from '../../utils';
const { ccclass, property } = _decorator;

/**
 * 敌人类型： 射击
 */
@ccclass('Enemy_Shoots')
export class Enemy_Shoots extends Component {
    @property(Node)
    hero: Node | null = null;

    @property(Prefab)
    bulletPrefab: Prefab | null = null;

    @property(Number)
    shootInterval: number = 1.0;

    @property(Number)
    bulletSpeed: number = 500;

    @property(Number)
    randomAngleRange: number = 15; // 随机角度范围，单位：度

    @property(EnemyAttributes)
    attributes: EnemyAttributes = new EnemyAttributes();

    private timer: number = 0;

    bulletDestroySpriteFrames: SpriteFrame[];

    protected onLoad(): void {
        this.render();
    }

    start() {
        this.timer = this.shootInterval;
        if (!this.hero) {
            const scene = director.getScene();
            this.hero = scene.getChildByName('Hero');
        }
        // 远程敌人设置较高的攻击力，较低的防御力和生命值
        this.attributes.attack = 50;
        this.attributes.defense = 10;
        this.attributes.health = 100;
    }

    update(deltaTime: number) {
        if (!this.hero || !this.bulletPrefab) return;

        this.timer -= deltaTime;
        if (this.timer <= 0) {
            this.shoot();
            this.timer = this.shootInterval;
        }
    }

    shoot() {
        if (!this.hero || !this.bulletPrefab) return;
        const [bullet] = commonBulletPath(
            this.bulletPrefab,
            this.node,
            this.hero,
            this.randomAngleRange,
            this.bulletSpeed
        );
        // 设置子弹攻击力
        const bulletController = bullet.getComponent(BulletController);
        if (bulletController) {
            bulletController.attack = this.attributes.attack;
            bulletController.bulletDestroySpriteFrames = this.bulletDestroySpriteFrames;
        }

        console.log(`敌人发射子弹！攻击力: ${this.attributes.attack}`);
    }

    async render() {
        const spriteFrames = await resourceManage.loadShootingEnemy();
        renderEnemyClip(this, spriteFrames);
        this.bulletDestroySpriteFrames = await resourceManage.loadDir('exp2_0') as SpriteFrame[];
    }
}


