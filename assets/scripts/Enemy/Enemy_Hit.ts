import { _decorator, Component, Node, Vec3, director } from 'cc';
import { EnemyAttributes } from './EnemyAttributes';
import { Hero_Fight } from '../Hero/Hero_Fight';

import { Hero } from '../Hero/Hero';
import { resourceManage } from '../../runtime/resourceManager';
import { renderEnemyClip } from '../../utils/renderEnemy';
const { ccclass, property } = _decorator;

@ccclass('Enemy_Hit')
export class Enemy_Hit extends Component {
    @property(Node)
    hero: Node | null = null;

    @property(EnemyAttributes)
    attributes: EnemyAttributes = new EnemyAttributes();

    @property({ type: Number, tooltip: '移动速度' })
    moveSpeed = 50;

    @property({ type: Number, tooltip: '检测范围' })
    detectionRange = 300;

    @property({ type: Number, tooltip: '攻击范围' })
    attackRange = 50;

    protected onLoad(): void {
        this.render();
    }

    start() {
        if (!this.hero) {
            const scene = director.getScene();
            this.hero = scene.getChildByName('Hero');
        }
        // 近战敌人设置较高的防御力和生命值，较低的攻击力
        this.attributes.attack = 20;
        this.attributes.defense = 30;
        this.attributes.health = 200;
    }

    update(deltaTime: number) {
        if (!this.hero) return;

        const enemyPos = this.node.getWorldPosition();
        const heroPos = this.hero.getWorldPosition();
        const distance = Vec3.distance(enemyPos, heroPos);

        if (distance <= this.detectionRange) {
            if (distance > this.attackRange) {
                const direction = Vec3.subtract(new Vec3(), heroPos, enemyPos).normalize();
                const moveVec = direction.multiplyScalar(this.moveSpeed * deltaTime);
                this.node.setWorldPosition(
                    enemyPos.x + moveVec.x,
                    enemyPos.y + moveVec.y,
                    enemyPos.z + moveVec.z
                );
            } else {
                this.attack();
            }
        }
    }

    attack() {
        if (!this.hero) return;
        this.hero.getComponent(Hero_Fight).takeDamage(this.attributes.attack);
    }

    async render() {
        const spriteFrames = await resourceManage.loadHittingEnemy();
        renderEnemyClip(this, spriteFrames);
    }
}


