import { useSpring, animated } from '@react-spring/three';
import { useStore } from '../../hooks/useStore';
import Hotspot from './Hotspot';

export default function OldEra() {
  const sliderValue = useStore((state) => state.sliderValue);

  const { opacity } = useSpring({
    opacity: 1 - (sliderValue / 100),
    config: { tension: 120, friction: 14 }
  });

  return (
    <animated.group opacity={opacity} visible={opacity.to(o => o > 0.1)}>
      <Hotspot 
        position={[-3, 0.5, 0]} 
        info={{
          title: 'Lao động truyền thống',
          content: 'Sản xuất nhỏ lẻ, công cụ thủ công, năng suất thấp. Giai cấp công nhân còn mang nhiều tàn dư của tâm lý tiểu nông cần khắc phục.'
        }}
        cameraTargetPos={{ target: [-3, 0.5, 0], position: [-3, 5, 8] }}
      >
        {(hovered) => (
          <mesh castShadow>
            <boxGeometry args={[1.5, 1, 1.5]} />
            <animated.meshStandardMaterial 
              color={hovered ? "#A0522D" : "#8B4513"} 
              emissive={hovered ? "#4a2511" : "#000000"}
              transparent 
              opacity={opacity} 
            />
          </mesh>
        )}
      </Hotspot>

      <mesh position={[-3, 1.3, 0]} castShadow>
        <coneGeometry args={[1.2, 0.8, 4]} />
        <animated.meshStandardMaterial color="#D2691E" transparent opacity={opacity} />
      </mesh>

      <mesh position={[-5, 0.3, 2]} castShadow>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <animated.meshStandardMaterial color="#A0522D" transparent opacity={opacity} />
      </mesh>

      <mesh position={[-5, 0.8, 2]} castShadow>
        <coneGeometry args={[0.7, 0.5, 4]} />
        <animated.meshStandardMaterial color="#CD853F" transparent opacity={opacity} />
      </mesh>

      <mesh position={[-4, 0.2, -1]} castShadow>
        <boxGeometry args={[1, 0.4, 1]} />
        <animated.meshStandardMaterial color="#654321" transparent opacity={opacity} />
      </mesh>

      <mesh position={[-2, 0.1, 3]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <animated.meshStandardMaterial color="#8B7355" transparent opacity={opacity} />
      </mesh>
    </animated.group>
  );
}
