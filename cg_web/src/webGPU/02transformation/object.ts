import { getData } from "../utils/getData";

export const createCubic = () => {
    const positions = [
        //0
        -0.3, 0.3, 0,
        //1
        0.3, 0.3, 0,
        //2
        0.3, -0.3, 0,
        //3
        -0.3, -0.3, 0,
    ];

    const indices = [
        //front
        0, 3, 1,
        1, 3, 2,
    ];

    const quadColors = [
        200, 70, 120,
    ]


    const { vertexData, numVertices } = getData(positions, indices, quadColors)

    return {
        cubicVertexData: vertexData,
        cubicNumVertices: numVertices
    }
}
