import { _decorator, Component, Node, Vec3, Prefab, instantiate, math, RigidBody2D, Vec2, director } from 'cc';
import { EnemyAttributes } from './EnemyAttributes';
import { BulletController } from '../Weapon/BulletController';
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

        // 创建子弹
        const bullet = instantiate(this.bulletPrefab);
        bullet.setPosition(this.node.position);
        this.node.parent?.addChild(bullet);

        // 使用 Vec3 计算方向并转换为 Vec2
        const heroPos = this.hero.position;
        const enemyPos = this.node.position;
        const directionVec3 = new Vec3(heroPos.x - enemyPos.x, heroPos.y - enemyPos.y, 0);
        directionVec3.normalize();
        const direction = new Vec2(directionVec3.x, directionVec3.y);

        // 随机偏移角度
        const randomAngle = (Math.random() - 0.5) * 2 * this.randomAngleRange;
        const radians = math.toRadian(randomAngle);
        const rotatedDirection = new Vec2(
            direction.x * Math.cos(radians) - direction.y * Math.sin(radians),
            direction.x * Math.sin(radians) + direction.y * Math.cos(radians)
        );

        // 设置子弹速度
        const bulletRigidBody = bullet.getComponent(RigidBody2D); // 假设子弹有 RigidBody2D 组件
        if (bulletRigidBody) {
            bulletRigidBody.linearVelocity = rotatedDirection.multiplyScalar(this.bulletSpeed);
        }
        // 设置子弹攻击力
        const bulletController = bullet.getComponent(BulletController);
        if (bulletController) {
            bulletController.attack = this.attributes.attack;
        }

        console.log(`敌人发射子弹！攻击力: ${this.attributes.attack}`);
    }

}


