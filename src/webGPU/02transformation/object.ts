import { getData2D } from "../utils/getData";

export const createSquare = () => {
    const positions = [
        //0
        0,0,
        //1
        100,0, 
        //2
        100, 100, 
        //3
        0, 100, 
    ];

    const indices = [
        0, 3, 1,
        1, 2, 3,
    ];

    const quadColors = [
        200, 70, 120,
        
    ]


    const { vertexData, numVertices } = getData2D(positions, indices, quadColors)

    return {
        squareVertexData: vertexData,
        squareNumVertices: numVertices
    }
}
