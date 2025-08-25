import { Layers, Node, UITransform } from 'cc';

export const createUINode = () => {
  const node = new Node();
  const transform = node.addComponent(UITransform);
  transform.setAnchorPoint(0, 1);
  node.layer = Layers.Enum.UI_2D;

  return node;
}

export const randomByRange = (start: number, end: number) => {
  return start + Math.floor(Math.random() * (end - start));
}
