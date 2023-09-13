import texture from "../../../assets/check-texture.png";

export const createPlanTexture = async ()=>{
    const response = await fetch(
       texture
      );
     const imageBitMap = await createImageBitmap(await response.blob());

     return imageBitMap;
}

export const createPlan = ()=>{
    const positions = [
        -50, -50, 0,
        -50, 50,0,

        50, -50, 0,
        50, 50, 0,
    ];

    const indices = [
        1, 0, 2,
        1, 2, 3
    ];

    const numIndices = indices.length;
    const vertexData = new Float32Array(positions);
    const indexData = new Uint16Array(indices); 

    return {
        planNumIndices : numIndices,
        planVertexData : vertexData,
        planIndexData : indexData
    }
}