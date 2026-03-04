import { useSpring, animated } from '@react-spring/three';
import { useStore } from '../../hooks/useStore';

export default function Lights() {
  const sliderValue = useStore((state) => state.sliderValue);

  const { ambientIntensity, directionalIntensity, lightColor } = useSpring({
    ambientIntensity: 0.3 + (sliderValue / 100) * 0.4,
    directionalIntensity: 0.8 + (sliderValue / 100) * 0.7,
    lightColor: sliderValue < 50
      ? [1, 0.8, 0.6]
      : [0.6 + (sliderValue - 50) / 100, 0.8 + (sliderValue - 50) / 200, 1],
    config: { tension: 120, friction: 14 }
  });

  return (
    <>
      <animated.ambientLight intensity={ambientIntensity} />
      <animated.directionalLight
        position={[10, 10, 5]}
        intensity={directionalIntensity}
        color={lightColor}
        castShadow
      />
      <animated.pointLight
        position={[0, 5, 0]}
        intensity={sliderValue / 50}
        color={sliderValue > 70 ? '#00ffff' : '#ffffff'}
      />
    </>
  );
}
