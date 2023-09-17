import { getData3D } from "../utils/getData";

export const createCubic = () => {
    const positions = [
        //0
        -50,-50,50,
        //1
        50, -50, 50,
        //2
        50, 50, 50,
        //3
        -50, 50,50,

          //4
          -50,-50,-50,
          //5
          50, -50, -50,
          //6
          50, 50, -50,
          //7
          -50, 50, -50,
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
        4, 0, 1,
        4, 1, 5,
        //bottom
        3, 7, 2,
        2, 7, 6

    ];

    const quadColors = [
        200, 70, 120,
        200, 70, 120,

        80, 70, 200,
        80, 70, 200,
       
        160, 160, 120,
        160, 160, 120,
    ]


    const { vertexData, numVertices } = getData3D(positions, indices, quadColors)

    return {
        cubicVertexData: vertexData,
        cubicNumVertices: numVertices
    }
}

