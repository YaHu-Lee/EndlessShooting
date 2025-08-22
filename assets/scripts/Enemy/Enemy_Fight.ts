import { _decorator } from 'cc';
import { EnemyAttributes } from './EnemyAttributes';
const { ccclass, property } = _decorator;

@ccclass('EnemyFight')
export class EnemyFight {
    @property(EnemyAttributes)
    attributes: EnemyAttributes = new EnemyAttributes();

    takeDamage(damage: number) {
        const actualDamage = damage - this.attributes.defense;
        if (actualDamage > 0) {
            this.attributes.health -= actualDamage;
            console.log(`敌人受到 ${actualDamage} 点伤害，剩余生命值: ${this.attributes.health}`);
        }
    }
}