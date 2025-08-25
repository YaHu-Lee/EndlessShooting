import { _decorator, Component, Node, input, Input, KeyCode, Vec3, UITransform, Animation, director } from 'cc';
import { Animation_Control } from './Animation_Control';
const { ccclass, property } = _decorator;

@ccclass('Hero_Move')
export class Hero_Move extends Component {
    private defaultFacing: number = -1;
    mapNode: Node | null = null;
    moveSpeed: number = 300;

    private minX: number = 0;
    private maxX: number = 0;
    private minY: number = 0;
    private maxY: number = 0;
    protected animationControl: Animation_Control | null = null;
    private facingRight: boolean = false;

    onLoad() {
        this.mapNode = director.getScene().getChildByName('Canvas').getChildByName('Map');

        // 获取动画组件
        this.animationControl = this.getComponent(Animation_Control);
        if (!this.animationControl) {
            console.warn('Hero_Move: 未找到动画组件！');
            return;
        }

        // 注册键盘输入事件
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

        if (!this.mapNode) {
            console.warn('Hero_Move: 未设置地图节点！');
            return;
        }

        // 获取地图边界
        const mapTransform = this.mapNode.getComponent(UITransform);
        if (!mapTransform) {
            console.warn('Hero_Move: 地图节点缺少 UITransform 组件！');
            return;
        }

        // 获取主角的 UITransform 组件以计算主角尺寸
        const heroTransform = this.getComponent(UITransform);
        if (!heroTransform) {
            console.warn('Hero_Move: 主角节点缺少 UITransform 组件！');
            return;
        }

        // 计算地图边界（考虑主角尺寸的一半，防止移动到边缘时超出地图）
        const mapWidth = mapTransform.width;
        const mapHeight = mapTransform.height;
        const mapPos = this.mapNode.position;
        const heroHalfWidth = heroTransform.width / 2;
        const heroHalfHeight = heroTransform.height / 2;
        
        this.minX = mapPos.x - mapWidth / 2 + heroHalfWidth;
        this.maxX = mapPos.x + mapWidth / 2 - heroHalfWidth;
        this.minY = mapPos.y - mapHeight / 2 + heroHalfHeight;
        this.maxY = mapPos.y + mapHeight / 2 - heroHalfHeight;
    }

    private moveDirection: Vec3 = new Vec3(0, 0, 0);

    update(deltaTime: number) {
        const normalizedMoveDirection = this.moveDirection.normalize();


        if (this.moveDirection.x !== 0 || this.moveDirection.y !== 0) {
            // 计算新位置
            const newPos = new Vec3(
                this.node.position.x + normalizedMoveDirection.x * this.moveSpeed * deltaTime,
                this.node.position.y + normalizedMoveDirection.y * this.moveSpeed * deltaTime,
                this.node.position.z
            );

            // 限制在地图边界内
            newPos.x = Math.max(this.minX, Math.min(this.maxX, newPos.x));
            newPos.y = Math.max(this.minY, Math.min(this.maxY, newPos.y));

            // 更新位置
            this.node.setPosition(newPos);

            // 如果之前不是移动状态，切换到移动动画
            if (this.animationControl) {
                this.animationControl.run();
            }

            // 根据移动方向更新朝向
            if (this.moveDirection.x !== 0) {
                const shouldFaceRight = this.moveDirection.x > 0;
                if (this.facingRight !== shouldFaceRight) {
                    this.facingRight = shouldFaceRight;
                    this.updateFacing();
                }
            }
        } else {
            // 如果停止移动，切换到静止动画
            this.animationControl.stay();
        }
    }

    private updateFacing() {
        const scale = this.node.scale;
        this.node.setScale(Math.abs(scale.x) * (this.facingRight ? 1 : -1) * this.defaultFacing, scale.y, scale.z);
    }

    onKeyDown(event: any) {
        if (this.animationControl.dead) return;
        console.log('Hero_Move: 键盘按下', event.keyCode);
        switch(event.keyCode) {
            case KeyCode.ARROW_LEFT:
            case KeyCode.KEY_A:
                this.moveDirection.x = -1;
                break;
            case KeyCode.ARROW_RIGHT:
            case KeyCode.KEY_D:
                this.moveDirection.x = 1;
                break;
            case KeyCode.ARROW_UP:
            case KeyCode.KEY_W:
                this.moveDirection.y = 1;
                break;
            case KeyCode.ARROW_DOWN:
            case KeyCode.KEY_S:
                this.moveDirection.y = -1;
                break;
        }
    }

    onKeyUp(event: any) {
        switch(event.keyCode) {
            case KeyCode.ARROW_LEFT:
            case KeyCode.KEY_A:
                if (this.moveDirection.x < 0) this.moveDirection.x = 0;
                break;
            case KeyCode.ARROW_RIGHT:
            case KeyCode.KEY_D:
                if (this.moveDirection.x > 0) this.moveDirection.x = 0;
                break;
            case KeyCode.ARROW_UP:
            case KeyCode.KEY_W:
                if (this.moveDirection.y > 0) this.moveDirection.y = 0;
                break;
            case KeyCode.ARROW_DOWN:
            case KeyCode.KEY_S:
                if (this.moveDirection.y < 0) this.moveDirection.y = 0;
                break;
        }
    }

    onDestroy() {
        // 移除事件监听
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
}


