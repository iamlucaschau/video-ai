/**
 * Style N post effects, inside the ThreeCanvas: contact shading (GTAO), bloom on practical lights, split-tone grade,
 * vignette. This is what turns flat coloured blocks into a lit room, all from code.
 * useFrame only triggers the draw: @remotion/three calls advance() once per Remotion frame; motion still comes from
 * useCurrentFrame. Priority 1 replaces R3F's own render call.
 */
import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const GRADE = {
  uniforms: { tDiffuse: { value: null }, vig: { value: 0.75 }, sat: { value: 1.12 } },
  vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
  fragmentShader: `uniform sampler2D tDiffuse; uniform float vig; uniform float sat; varying vec2 vUv;
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      float l = dot(c.rgb, vec3(.2126,.7152,.0722));
      c.rgb = mix(vec3(l), c.rgb, sat);
      // the N look: teal in the shadows, amber in the lights
      float k = smoothstep(0., .9, l);
      c.rgb *= mix(vec3(.86,.98,1.12), vec3(1.08,1.,.88), k);
      vec2 d = (vUv - .5) * vec2(1., 1.15);
      c.rgb *= 1. - vig * smoothstep(.3, .85, length(d));
      gl_FragColor = c;
    }`,
};

export type PostOpts = { bloom?: number; ao?: boolean; vignette?: number };

export const Post: React.FC<PostOpts> = ({ bloom = 0.55, ao = true, vignette = 0.75 }) => {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const composer = useMemo(() => {
    const size = gl.getDrawingBufferSize(new THREE.Vector2());
    const target = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: size.x > 1500 ? 2 : 4 }  /* 4K: four samples on half-float targets ran the GPU out of memory */);
    const c = new EffectComposer(gl, target);
    c.addPass(new RenderPass(scene, camera));
    if (ao) {
      const g = new GTAOPass(scene, camera, size.x, size.y);
      g.updateGtaoMaterial({ radius: 0.55, distanceExponent: 1.4, thickness: 1.2, scale: 1.35, samples: 16, distanceFallOff: 1, screenSpaceRadius: false });
      g.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
      c.addPass(g);
    }
    c.addPass(new UnrealBloomPass(size.clone(), bloom, 0.55, 1.35));
    const grade = new ShaderPass(GRADE);
    grade.uniforms.vig.value = vignette;
    c.addPass(grade);
    c.addPass(new OutputPass());
    return c;
  }, [gl, scene, camera, ao, bloom, vignette]);
  // each shot mounts its own canvas: free the targets or 59 shots exhaust GPU memory
  useEffect(() => () => composer.dispose(), [composer]);
  useFrame(() => composer.render(), 1);
  return null;
};
