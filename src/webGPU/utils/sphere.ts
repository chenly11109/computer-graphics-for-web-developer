import OBJFile from 'obj-file-parser';
import sphere from './sphere.obj?raw'

export const createSphere = ()=>{
    const spherePlainText = new OBJFile(sphere);
    const sphereModel = spherePlainText.parse().models[0];


    const sphereVertex = sphereModel.vertices.map(item=>Object.values(item)).flat();
    const sphereIndices = sphereModel.faces.map(item=>item.vertices.map(item=>item.vertexIndex-1)).flat();


    const numIndices = sphereIndices.length;
    const vertexData = new Float32Array(sphereVertex); //xyz
    const indexData = new Uint16Array(sphereIndices);
   return {
    vertexData,
    indexData,
    numIndices
   }
}