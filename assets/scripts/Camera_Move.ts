import { _decorator, Component, Node, Vec3, UITransform, Camera } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Camera_Move')
export class Camera_Move extends Component {
    @property({ 
        type: Node, 
        tooltip: '要跟随的目标节点（通常是主角）'
    })
    target: Node | null = null;

    @property({ 
        type: Node, 
        tooltip: '地图节点'
    })
    mapNode: Node | null = null;

    private minX: number = 0;
    private maxX: number = 0;
    private minY: number = 0;
    private maxY: number = 0;

    start() {
        if (!this.target) {
            console.warn('Camera_Move: 未设置跟随目标！');
        }
        if (!this.mapNode) {
            console.warn('Camera_Move: 未设置地图节点！');
            return;
        }

        // 获取地图的 UITransform 组件
        const mapTransform = this.mapNode.getComponent(UITransform);
        if (!mapTransform) {
            console.warn('Camera_Move: 地图节点缺少 UITransform 组件！');
            return;
        }

        // 获取相机组件
        const camera = this.node.getComponent(Camera);
        if (!camera) {
            console.warn('Camera_Move: 相机节点缺少 Camera 组件！');
            return;
        }

        // 获取画布的 UITransform 组件
        const canvas = this.node.parent?.getComponent(UITransform);
        if (!canvas) {
            console.warn('Camera_Move: 画布节点缺少 UITransform 组件！');
            return;
        }

        // 计算地图边界
        const mapWidth = mapTransform.width;
        const mapHeight = mapTransform.height;
        const mapPos = this.mapNode.position;
        
        // 计算相机视口宽度和高度
        
        // 计算边界值（考虑相机尺寸和地图尺寸）
        this.minX = mapPos.x - mapWidth / 2 + canvas.width / 2;
        this.maxX = mapPos.x + mapWidth / 2 - canvas.width / 2;
        this.minY = mapPos.y - mapHeight / 2 + canvas.height / 2;
        this.maxY = mapPos.y + mapHeight / 2 - canvas.height / 2;
    }

    update(deltaTime: number) {
        if (!this.target) {
            return;
        }

        // 获取目标位置
        const targetPosition = this.target.position;
        
        // 计算相机位置（考虑边界限制）
        const newPosition = new Vec3(
            Math.max(this.minX, Math.min(this.maxX, targetPosition.x)),
            Math.max(this.minY, Math.min(this.maxY, targetPosition.y)),
            this.node.position.z
        );

        // 直接更新相机位置
        this.node.setPosition(newPosition);
    }
}


