const pi = Math.PI;

const sin = (x:number) => Math.sin(x);
const cos = (x:number) => Math.cos(x);

const getSpherePosition = (radius:number, theta:number, phi:number): number[] => {
    const x = radius * sin(theta) * cos(phi);
    const y = radius * cos(theta);
    const z = -radius * sin(theta) * sin(phi);    
    return [x,y,z];     
}

export const createSphere= (radius:number, u_o:number, v_o:number) => {
    let u = u_o, v=v_o;
    if(u_o < 2 || v_o < 2){
        u=2; 
        v=2;
    }
    const pt_normals = [];
    const pts = [];
    for(let i = 0; i <= u; i++){
        for(let j = 0; j <= v; j++){
            const pt = getSpherePosition(radius, i*pi/u, j*2*pi/v);
            pt_normals.push(pt[0], pt[1], pt[2],pt[0]/radius, pt[1]/radius, pt[2]/radius);
            pts.push(pt[0], pt[1], pt[2]);
        }
    }

    const vertices_per_row = v + 1;
    const indices = [];

    for(let i = 0; i < u; i++){
        for(let j = 0; j < v; j++) {
            const idx0 = j + i * vertices_per_row;
            const idx1 = j + 1 + i * vertices_per_row;
            const idx2 = j + 1 + (i + 1) * vertices_per_row;
            const idx3 = j + (i + 1) * vertices_per_row; 

            indices.push(idx0, idx1, idx2, idx2, idx3, idx0);              
        }
    }
    return {
        vertex_normalData : new Float32Array(pt_normals),
        vertexData:new Float32Array(pts),
        indexData: new Uint16Array(indices),
        numIndices:indices.length
    };
}
