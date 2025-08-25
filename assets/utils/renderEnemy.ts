import { Animation, animation, AnimationClip, Component, Sprite, SpriteFrame, UITransform } from "cc";
import { ANIMATION_SPEED, ENEMY_HEIGHT, ENEMY_WIDTH } from "./constant";

export function renderEnemyClip(that: Component, spriteFrames: any[]) {
  const sprite = that.addComponent(Sprite);
  sprite.sizeMode = Sprite.SizeMode.CUSTOM;
  const transform = that.getComponent(UITransform);
  transform.setContentSize(ENEMY_WIDTH, ENEMY_HEIGHT);
  const animationComponent = that.addComponent(Animation);

  const animationClip = new AnimationClip();


  const track = new animation.ObjectTrack();
  track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame');
  const frames: [number, SpriteFrame][] = spriteFrames.map((item, index) => [ANIMATION_SPEED * index, item]);
  track.channel.curve.assignSorted(frames);

  animationClip.addTrack(track);
  animationClip.duration = frames.length * ANIMATION_SPEED; // s
  animationClip.wrapMode = AnimationClip.WrapMode.Loop;
  animationComponent.defaultClip = animationClip;
  animationComponent.play();
}