import { _decorator, Component } from 'cc';
import { HeroAttributes } from './HeroAttributes';
import { Animation_Control } from './Animation_Control';
const { ccclass, property } = _decorator;

@ccclass('Hero_Fight')
export class Hero_Fight extends Component {
    @property(HeroAttributes)
    attributes: HeroAttributes = new HeroAttributes();

    private animationControl: Animation_Control | null = null;

    protected onLoad(): void {
        this.animationControl = this.getComponent(Animation_Control);
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