import { useSpring, animated } from '@react-spring/three';
import { useStore } from '../../hooks/useStore';
import Hotspot from './Hotspot';

export default function NewEra() {
  const sliderValue = useStore((state) => state.sliderValue);

  const { opacity, emissiveIntensity } = useSpring({
    opacity: sliderValue / 100,
    emissiveIntensity: (sliderValue / 100) * 0.5,
    config: { tension: 120, friction: 14 }
  });

  return (
    <animated.group opacity={opacity} visible={opacity.to(o => o > 0.1)}>
      <Hotspot 
        position={[3, 0.8, 0]} 
        info={{
          title: 'Trí thức hóa công nhân',
          content: 'Đại bộ phận công nhân làm chủ khoa học công nghệ, vươn lên đảm nhận các vị trí kỹ thuật cao trong dây chuyền tự động hóa.'
        }}
        cameraTargetPos={{ target: [3, 0.8, 0], position: [3, 6, 8] }}
      >
        {(hovered) => (
          <mesh castShadow>
            <boxGeometry args={[2, 1.6, 2]} />
            <animated.meshStandardMaterial
              color={hovered ? "#E0E0E0" : "#C0C0C0"}
              metalness={0.8}
              roughness={0.2}
              emissive="#00FFFF"
              emissiveIntensity={hovered ? emissiveIntensity.to(i => i * 2) : emissiveIntensity}
              transparent
              opacity={opacity}
            />
          </mesh>
        )}
      </Hotspot>

      <mesh position={[3, 2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.8]} />
        <animated.meshStandardMaterial
          color="#808080"
          metalness={0.9}
          roughness={0.1}
          emissive="#00FFFF"
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={opacity}
        />
      </mesh>

      <mesh position={[5, 0.6, 2]} castShadow>
        <boxGeometry args={[1.5, 1.2, 1.5]} />
        <animated.meshStandardMaterial
          color="#A9A9A9"
          metalness={0.7}
          roughness={0.3}
          emissive="#0099FF"
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={opacity}
        />
      </mesh>

      <mesh position={[4, 0.4, -2]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.8]} />
        <animated.meshStandardMaterial
          color="#DCDCDC"
          metalness={0.9}
          roughness={0.1}
          emissive="#00FFFF"
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={opacity}
        />
      </mesh>

      <mesh position={[2, 0.3, 3]} castShadow>
        <boxGeometry args={[1, 0.6, 1]} />
        <animated.meshStandardMaterial
          color="#B0B0B0"
          metalness={0.8}
          roughness={0.2}
          emissive="#9933FF"
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={opacity}
        />
      </mesh>

      <mesh position={[6, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.4]} />
        <animated.meshStandardMaterial
          color="#BEBEBE"
          metalness={1}
          roughness={0}
          emissive="#00FFFF"
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={opacity}
        />
      </mesh>
    </animated.group>
  );
}
