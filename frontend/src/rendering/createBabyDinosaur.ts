
import { Graphics } from 'pixi.js';

export function createBabyDinosaur(): Graphics {
  const dinosaur = new Graphics()
    // Tail
    .ellipse(65, 40, 50, 25)
    .fill(0x74a96e)

    // Feet
    .ellipse(-38, 95, 24, 15)
    .fill(0x689b62)
    .ellipse(38, 95, 24, 15)
    .fill(0x689b62)

    // Body and belly
    .ellipse(0, 40, 58, 70)
    .fill(0x91c98b)
    .ellipse(0, 55, 35, 45)
    .fill(0xe8efc5)

    // Arms
    .ellipse(-48, 35, 15, 25)
    .fill(0x7db678)
    .ellipse(48, 35, 15, 25)
    .fill(0x7db678)

    // Head
    .ellipse(0, -25, 70, 60)
    .fill(0x91c98b)

    // Snout
    .ellipse(0, -5, 45, 24)
    .fill(0xa8d69d)

    // Eyes
    .circle(-24, -38, 8)
    .fill(0x283828)
    .circle(24, -38, 8)
    .fill(0x283828)

    // Eye highlights
    .circle(-22, -40, 3)
    .fill(0xffffff)
    .circle(26, -40, 3)
    .fill(0xffffff)

    // Mouth
    .roundRect(-12, 5, 24, 6, 3)
    .fill(0x446b43);

  return dinosaur;
}
