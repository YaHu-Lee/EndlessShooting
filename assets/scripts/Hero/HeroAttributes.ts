import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HeroAttributes')
export class HeroAttributes {
    @property(Number)
    attack: number = 30;

    @property(Number)
    defense: number = 20;

    @property(Number)
    health: number = 300;
}