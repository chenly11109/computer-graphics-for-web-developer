struct Vertex {
    @builtin(vertex_index) vertexIndex : u32,
    @location(0) position: vec4f,
}

struct VSOutput {
    @builtin(position) position:vec4f,
 
}

struct FS {
    @builtin(position) pos: vec4f,

}

@group(0) @binding(0) var<uniform> viewMatrix: mat4x4f;
@group(1) @binding(0) var<uniform> fColor:vec4f;


@vertex fn vs(vert: Vertex)->VSOutput{
    var vsOut: VSOutput;

    vsOut.position =  viewMatrix * vert.position;
  
    return vsOut;
}

@fragment fn fs()->@location(0) vec4f{

    return fColor;
}