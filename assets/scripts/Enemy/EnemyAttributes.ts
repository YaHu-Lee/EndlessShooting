import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyAttributes')
export class EnemyAttributes {
    @property({ type: Number, tooltip: '攻击力' })
    attack = 0;

    @property({ type: Number, tooltip: '防御力' })
    defense = 0;

    @property({ type: Number, tooltip: '生命值' })
    health = 0;
}