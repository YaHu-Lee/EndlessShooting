import { Asset, resources, SpriteFrame } from "cc";

class ResourceManage {

  loadDir(path: string, type: typeof Asset = SpriteFrame) {
    return new Promise((resolve, reject) => {
      resources.loadDir(path, type, (err, assets) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(assets);
      })
    })
  }

  loadMapResource() {
    return this.loadDir('texture/tile/tile') as Promise<SpriteFrame[]>;
  }

  loadShootingEnemy() {
    return this.loadDir('texture/woodenskeleton/idle/bottom') as Promise<SpriteFrame[]>;
  }

  loadHittingEnemy() {
    return this.loadDir('texture/ironskeleton/idle/bottom') as Promise<SpriteFrame[]>;
  }
}

export const resourceManage = new ResourceManage();
