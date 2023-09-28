// import texture from "../../../assets/check-texture.png";
import texture from "../../../assets/check-texture2.webp"

export const createPlanTexture = async ()=>{
    const response = await fetch(
       texture
      );
     const imageBitMap = await createImageBitmap(await response.blob());
     return imageBitMap;
}

export const createPlan = ()=>{
    const positions = [
        -1, 0, 1,
        1, 0,1,
        1, 0, -1,
        -1, 0, -1,   
    ];

    const indices = [
        0,2,1,
        2,0,3
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