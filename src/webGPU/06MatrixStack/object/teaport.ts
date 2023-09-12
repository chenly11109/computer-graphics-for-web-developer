import OBJFile from 'obj-file-parser';
import Teapot from './teapot.obj?raw'

export const createTeapot = ()=>{
    const teapotPlainText = new OBJFile(Teapot);
    const teapotModel = teapotPlainText.parse();
    const teapotVertex = teapotModel.models[0].vertices.map(item=>Object.values(item)).flat();

    const numVertices = teapotVertex.length /3;
    const vertexData = new Float32Array(teapotVertex); //xyz

   return {
    vertexData,
    numVertices
   }
}