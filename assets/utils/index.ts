import { instantiate, Layers, math, Node, Prefab, RigidBody2D, UITransform, v2, Vec2, Vec3 } from 'cc';

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

export function findNodesByName(root, name) {
  let result = [];
  if (root.name === name) {
    result.push(root);
  }
  root.children.forEach(child => {
    result = result.concat(findNodesByName(child, name));
  });
  return result;
}

export function commonBulletPath (
  prefabNode: Prefab, 
  curNode: Node, 
  targetNode: Node, 
  randomAngleRange: number,
  bulletSpeed: number
): [Node, Vec3] {
   // 创建子弹
  const bullet = instantiate(prefabNode);
  bullet.setPosition(curNode.position);
  curNode.parent?.addChild(bullet);

  // 使用 Vec3 计算方向并转换为 Vec2
  const heroPos = targetNode.position;
  const enemyPos = curNode.position;
  const directionVec3 = new Vec3(heroPos.x - enemyPos.x, heroPos.y - enemyPos.y, 0);
  bullet.setRotationFromEuler(directionVec3);
  directionVec3.normalize();
  const direction = new Vec2(directionVec3.x, directionVec3.y);

  // 随机偏移角度
  const randomAngle = (Math.random() - 0.5) * 2 * randomAngleRange;
  const radians = math.toRadian(randomAngle);
  const rotatedDirection = new Vec2(
      direction.x * Math.cos(radians) - direction.y * Math.sin(radians),
      direction.x * Math.sin(radians) + direction.y * Math.cos(radians)
  );

  // 设置子弹速度
  const bulletRigidBody = bullet.getComponent(RigidBody2D); // 假设子弹有 RigidBody2D 组件
  if (bulletRigidBody) {
      bulletRigidBody.linearVelocity = rotatedDirection.multiplyScalar(bulletSpeed);
  }
  return [bullet, directionVec3];
}

export function nearestNode(curNode: Node, checkAllNodes: Node[]): [Node, number] {
  // 假设你有一个名为 currentNode 的当前节点，和一组 referenceNodes 作为参考节点数组
  let closestNode = null;
  let closestDistance = Infinity;
  
  for (let i = 0; i < checkAllNodes.length; i++) {
    const one = checkAllNodes[i];
    const pos = v2(one.x - curNode.x, one.y - curNode.y);
    const distance = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestNode = checkAllNodes[i];
    }
  }

  const dx = closestNode.x - curNode.x;
  const dy = closestNode.y - curNode.y;
  const dir = v2(dx, dy);
  const angle = dir.signAngle(v2(1,0));

  const degree = angle / Math.PI * 180;

  return [closestNode, degree];
}