import { getData2D } from "../utils/getData";
export const createPlan = () => {
    const positions = [
        -0.8, -0.8, 
        -0.8, 0.8, 
        0.8, -0.8, 
        0.8, 0.8, 
    ];

    const indices = [
        1, 0, 2,
        1, 2, 3
    ];

    const quadColors = [
        200, 70, 120,
    ]


    const { vertexData, numVertices } = getData2D(positions, indices, quadColors)

    return {
        planVertexData: vertexData,
        planNumVertices: numVertices
    }
}
