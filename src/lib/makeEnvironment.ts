import * as THREE from 'three'


export function makeEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
    const pmrem = new THREE.PMREMGenerator(renderer)
    const env = new THREE.Scene()
    env.background = new THREE.Color(0x0a0c16)

    const panel = (w: number, h: number, pos: [number, number, number], color: number, power: number) => {
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(w, h),
            new THREE.MeshBasicMaterial({
                color: new THREE.Color(color).multiplyScalar(power),
                side: THREE.DoubleSide,
            }),
        )
        mesh.position.set(...pos)
        mesh.lookAt(0, 0, 0)
        env.add(mesh)
    }

    panel(7, 12, [-7, 2, 5], 0xffffff, 5)
    panel(5, 12, [7, 1, 4], 0xdfe8ff, 3.2)
    panel(12, 4, [0, 8, 2], 0xffffff, 4)
    panel(10, 5, [0, -6, 3], 0x8f9bff, 1.2)
    panel(8, 8, [0, 0, -8], 0xffffff, 1.4)

    const texture = pmrem.fromScene(env, 0.03).texture
    pmrem.dispose()
    return texture
}