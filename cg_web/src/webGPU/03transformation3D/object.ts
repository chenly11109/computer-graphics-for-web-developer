import { getData } from "../utils/getData";

export const createCubic = () => {
    const positions = [
        //0
        0,0,0,
        //1
        100, 0, 0,
        //2
        100, 100, 0,
        //3
        0, 100, 0,

          //4
          0,0,-100,
          //5
          100, 0, -100,
          //6
          100, 100, -100,
          //7
          0, 100, -100,
    ];

    const indices = [
        //front
        0, 3, 1,
        1, 3, 2,
        //back
        5, 6, 7,
        4, 5, 7,
        // //right
        1, 2, 5,
        5, 2, 6,
        //left
        0, 7, 3,
        0, 7, 4,
        //top
        4, 1, 0,
        4, 1, 5,
        //bottom
        3, 7, 2,
        2, 7, 1

    ];

    const quadColors = [
        200, 70, 120,
        80, 70, 200,
        160, 160, 220,
    ]


    const { vertexData, numVertices } = getData(positions, indices, quadColors)

    return {
        cubicVertexData: vertexData,
        cubicNumVertices: numVertices
    }
}
