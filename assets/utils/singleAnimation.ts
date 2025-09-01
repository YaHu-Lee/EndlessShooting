import { _decorator, Color, Component, Node, Rect, Sprite, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;

export class SingleAnimation {

    node: Node;
    parentNode: Node;
    sprite: SpriteFrame;
    useSpriteFrame: SpriteFrame;
    @property({ tooltip: '每帧的宽度' })
    width = 128;
    @property({ tooltip: '每帧的高度' })
    height = 128;
    @property
    rows = 1;
    @property
    columns = 1;
    @property({tooltip: '总帧数, 默认为 rows x columns, 因为并不是所有的都是行列全满'})
    count = 0
    @property({ tooltip: '每帧间隔的秒数' })
    speed = .1;
    @property({ tooltip: '是否自动播放' })
    autoPlay = true
    @property({ tooltip: '用于标识此热点, 在点击事件时可用' })
    tag = ''

    currentIndex = 0;

    constructor(node, parentNode, { width = 128, height = 128, count = 1, columns = 1, rows = 1, speed = 0.1 }, useSpriteFrame) {
      this.node = node;
      this.parentNode = parentNode;
      this.useSpriteFrame = useSpriteFrame;
      this.init({ width, height, count, columns, rows, speed });
    }

    init({ width = 128, height = 128, count = 1, columns = 1, rows = 1, speed = 0.1 }) {
      if (width) this.width = width;
      if (height) this.height = height;
      if (count) this.count = count;
      if (columns) this.columns = columns;
      if (rows) this.rows = rows;
      if (speed) this.speed = speed;
    }

    start() {
      const useSprite = this.node.getComponent(Sprite);
      useSprite.color = new Color(255,255,255);
      useSprite.spriteFrame = this.useSpriteFrame;
      this.sprite = useSprite.spriteFrame;
      this.sprite.rect = new Rect(0, 0, this.width, this.height)
      this.node.getComponent(UITransform).setContentSize(this.width, this.height);
      
      this.node.getComponent(Sprite).updateRenderer();
      if (this.autoPlay) {
          this.play()
      }
    }

    getFrame(index: number) {
        if (index >= this.count) {
          this.node.destroy();
          this.parentNode.destroy();
        }

        let x = index % this.columns        
        let y = Math.floor(index / this.columns)
        this.sprite.rect = new Rect(x * this.width, y * this.height, this.width, this.height)
        this.node.getComponent(Sprite).updateRenderer();
    }

    play() {
        this.node.getComponent(Sprite).schedule(() => {
          this.currentIndex += 1
          this.getFrame(this.currentIndex)
        }, this.speed)
    }
}