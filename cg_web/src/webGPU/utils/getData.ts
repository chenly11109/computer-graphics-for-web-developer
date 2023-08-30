export const getData = (positions:number[],indices:number[],  quadColors:number[])=>{
    const numVertices = indices.length;
    const vertexData = new Float32Array(numVertices * 4); // xyz + color
    const colorData = new Uint8Array(vertexData.buffer);
    for (let i = 0; i < indices.length; ++i) {
        const positionNdx = indices[i] * 3;
        const position = positions.slice(positionNdx, positionNdx + 3);
        vertexData.set(position, i * 4);
        
        //every face is consist of two triangles, which is 6 indices
        const quadNdx = (i / 6 | 0) * 3;
        const color = quadColors.slice(quadNdx, quadNdx + 3);
        colorData.set(color, i * 16 + 12);
        colorData[i * 16 + 15] = 255;
      }

      return {
        vertexData,
        numVertices
      }
}