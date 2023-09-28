import OBJFile from 'obj-file-parser';
import Teapot from './teapot.obj?raw'

export const createTeapot = ()=>{
    const teapotPlainText = new OBJFile(Teapot);
    const teapotModel = teapotPlainText.parse().models[0];


    const teapotVertex = teapotModel.vertices.map(item=>Object.values(item)).flat();
    const teapotIndices = teapotModel.faces.map(item=>item.vertices.map(item=>item.vertexIndex-1)).flat();


    const numIndices = teapotIndices.length;
    const vertexData = new Float32Array(teapotVertex); //xyz
    const indexData = new Uint16Array(teapotIndices);

   return {
    vertexData,
    indexData,
    numIndices
   }
}