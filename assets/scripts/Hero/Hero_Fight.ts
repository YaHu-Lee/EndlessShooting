import { _decorator, Component, director, loader, Node, Prefab, resources, UITransform, Vec3 } from 'cc';
import { HeroAttributes } from './HeroAttributes';
import { Animation_Control } from './Animation_Control';
import { commonBulletPath, findNodesByName, nearestNode } from '../../utils';
const { ccclass, property } = _decorator;

@ccclass('Hero_Fight')
export class Hero_Fight extends Component {
    @property(HeroAttributes)
    attributes: HeroAttributes = new HeroAttributes();

    @property(Prefab)
    bulletPrefab: Prefab | null = null;

    @property(Node)
    allShootingEnemies: Node[] = [];

    @property(Node)
    allHittingEnemies: Node[] = [];

    @property(Number)
    shootInterval: number = 1.0;

    @property(Number)
    randomAngleRange: number = 15; // 随机角度范围，单位：度

    @property(Number)
    bulletSpeed: number = 15;

    private timer: number = 0;

    private animationControl: Animation_Control | null = null;

    protected onLoad(): void {
        this.animationControl = this.getComponent(Animation_Control);
        resources.load("prefabs/carrot", Prefab, (err, prefab) => {
            console.log('prefab loading ,', err, prefab);
            if (err) {
                return;
            }
            console.log('prefab loading ,', prefab);
            this.bulletPrefab = prefab;
        });
    }

    protected start(): void {
        this.timer = this.shootInterval;
        const scene = director.getScene();
        this.allHittingEnemies = findNodesByName(scene, 'Enemy_Hit');
        this.allShootingEnemies = findNodesByName(scene, 'Enemy_Shoot');
        console.log('all nodes find', this.allHittingEnemies, this.allShootingEnemies)
        // 远程敌人设置较高的攻击力，较低的防御力和生命值
        this.attributes.attack = 50;
        this.attributes.defense = 10;
        this.attributes.health = 100;
    }

    protected update(deltaTime: number): void {
        this.timer -= deltaTime;
        if (this.timer <= 0) {
            this.shoot();
            this.timer = this.shootInterval;
        }
    }

    shoot() {
        if(!this.bulletPrefab || this.animationControl.dead) return;
        console.log('all nodes ', [...this.allHittingEnemies, ...this.allShootingEnemies]);
        const [nNode, degree] = nearestNode(this.node, [...this.allHittingEnemies, ...this.allShootingEnemies]);

        if (!nNode) return;

        const [bullet, angle] = commonBulletPath(
            this.bulletPrefab,
            this.node,
            nNode,
            this.randomAngleRange,
            this.bulletSpeed
        );
    }

    takeDamage(damage: number) {
        const actualDamage = damage - this.attributes.defense;
        if (actualDamage > 0 && this.attributes.health > 0) {
            this.attributes.health -= actualDamage;
            console.log(`英雄受到 ${actualDamage} 点伤害，剩余生命值: ${this.attributes.health}`);
            if (this.attributes.health <= 0) {
                this.animationControl?.die();
            }
        }
    }
}