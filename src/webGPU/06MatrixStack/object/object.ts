import { getData3DIndices } from "../../utils/getData";

export const createCubicIndices = () => {
    const positions = [
        //0
        -1,-1,1,
        //1
        1, -1, 1,
        //2
        1, 1, 1,
        //3
        -1, 1,1,

          //4
          -1,-1,-1,
          //5
          1, -1, -1,
          //6
          1, 1, -1,
          //7
          -1, 1, -1,
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
        0, 4, 7,
        //top
        4, 0, 1,
        4, 1, 5,
        //bottom
        3, 7, 2,
        2, 7, 6

    ];


    const { vertexData, numIndices, indexData } = getData3DIndices(positions, indices)


    return {
        cubicVertexData: vertexData,
        cubicNumIndices: numIndices,
        cubicIndexData:indexData
    }
}

