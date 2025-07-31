import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import Loader from "./Loader";
import Timer from "./Timer";

export default function Game({ onGameOver }) {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [player, setPlayer] = useState(null);
  const [canMove, setCanMove] = useState(false);
  const animationIdRef = useRef(null);
  const spacePressed = useRef(false);


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.key === "ArrowUp") {
        spacePressed.current = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space" || e.key === "ArrowUp" || e.key === "w") {
        spacePressed.current = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 20, 10);
    scene.add(ambientLight, dirLight);

    const loader = new GLTFLoader();
    const fontLoader = new FontLoader();


    const modelPaths = [
      {
        path: "/models/background.glb",
        pos: [0, 0, 0],
        scale: [5, 5, 5],
      },
      {
        path: "/models/doll.glb",
        pos: [2, 0.2, 41],
        isDoll: true,
        scale: [5, 5, 5],
      },
      { path: "/models/tree.glb", pos: [2, 0, 41], scale: [2, 2, 2] },
      {
        path: "/models/pink-men.glb",
        pos: [8, 0.3, 40],
        scale: [20, 20, 20],
      },
      {
        path: "/models/pink-men.glb",
        pos: [-7, 0.3, 40],
        scale: [20, 20, 20],
      },
      {
        path: "/models/player.glb",
        pos: [0, 0, -3],
        isPlayer: true,
        scale: [2, 2, 2],
      },
    ];

    let loadedCount = 0;
    let dollModel = null;
    const models = [];

    const loadModel = ({ path, pos, isPlayer, isDoll, scale = [1, 1, 1] }) => {
      loader.load(
        path,
        (gltf) => {
          const model = gltf.scene;
          model.position.set(...pos);
          model.scale.set(...scale);

          if (path.includes("pink-men")) {
            model.rotation.y = pos[0] < 0 ? Math.PI / 12 : -Math.PI / 12;
          }

          scene.add(model);
          models.push(model);

          if (isPlayer) setPlayer(model);
          if (isDoll) dollModel = model;

          loadedCount++;
          if (loadedCount === modelPaths.length) {
            setLoading(false);
          }
        },
        undefined,
        (err) => console.error(`Error loading ${path}:`, err)
      );
    };

    modelPaths.forEach(loadModel);

    
    fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      const textGeometry = new TextGeometry("FINISH", {
        font: font,
        size: 0.5,
        height: 0.1,
      });

      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

     
      textGeometry.center();
      textMesh.position.set(0, 2, 38);
      textMesh.rotation.x = -Math.PI / 8;

      scene.add(textMesh);
    });


    const redMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const points = [
      new THREE.Vector3(-20, 0, 38),
      new THREE.Vector3(40, 0, 38),
    ];
    const redGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const redLine = new THREE.Line(redGeometry, redMaterial);
    scene.add(redLine);

   
    camera.position.set(0, 3.5, -5);
    camera.lookAt(0, 1, 0);

    let walkTime = 32;
    const animate = () => {
      const id = requestAnimationFrame(animate);
      animationIdRef.current = id;

      // Move player with spacebar when allowed
      if (canMove && player && spacePressed.current) {
        player.position.z += 0.15;

        walkTime += 0.15;
        player.position.y = 0.05 * Math.sin(walkTime);

     
        camera.position.z = player.position.z - 5;
        camera.position.y = player.position.y + 2;
        camera.position.x = player.position.x;
        camera.lookAt(player.position.x, player.position.y, player.position.z);

        
        if (player.position.z >= 37) {
          cancelAnimationFrame(id);
          onGameOver("won");
        }
      }


      if (dollModel) {
        dollModel.rotation.y += 0.03;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      models.forEach((model) => scene.remove(model));
    };
  }, []);


  useEffect(() => {
    if (!player) return;

    const intervalId = setInterval(() => {
      const next = !canMove;
      setCanMove(next);
      setStatus(next ? "Green Light" : "Red Light");

      if (next) {
        
        new Audio("/sounds/squidgame.mp3").play();
      } else {
       
        new Audio("/sounds/gunshotlaser.mp3").play();

        setTimeout(() => {
          new Audio("/sounds/laser-scan.mp3").play();

          
          if (spacePressed.current) {
            new Audio("/sounds/squid-game-gunshot.mp3").play();

            setTimeout(() => {
              alert("❌ You moved during RED light. Eliminated.");
              setCanMove(false);
              cancelAnimationFrame(animationIdRef.current);
              onGameOver("died");
            }, 400);
          }
        }, 500);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [player, canMove]);
  setCanMove(next);
  setStatus(next ? "Green Light" : "Red Light");

  return (
    <>
      {loading && <Loader />}
      <Timer
        onTimeUp={() => {
          alert("Time's up! You failed");
          setCanMove(false);
          cancelAnimationFrame(animationIdRef.current);
          onGameOver("died");
        }}
      />
      <div
        ref={mountRef}
        className="game-canvas"
        style={{ width: "100vw", height: "100vh" }}
      />
    </>
  );
}
