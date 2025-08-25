import { _decorator, Component } from 'cc';
import { HeroAttributes } from './HeroAttributes';
import { Hero_Fight } from './Hero_Fight';
import { Animation_Control } from './Animation_Control';
import { Hero_Move } from './Hero_Move';
import { Hero_Collider } from './Hero_Collider';
const { ccclass, property } = _decorator;

@ccclass('Hero')
export class Hero extends Hero_Move {

    onLoad() {
      console.log('Hero 脚本启动');
      this.addComponent(Animation_Control);
      this.addComponent(Hero_Fight);
      this.addComponent(Hero_Collider);
      this.addComponent(Hero_Move);
    }

    update(deltaTime: number) {
      // 更新逻辑可按需添加
    }
}