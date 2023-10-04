struct Vertex {
    @builtin(vertex_index) vertexIndex : u32,
    @location(0) position: vec4f,
}

struct VSOutput {
    @builtin(position) position:vec4f,
}

@group(0) @binding(0) var<uniform> viewMatrix: mat4x4f;
@group(1) @binding(0) var<uniform> lColor:vec4f;
@group(1) @binding(1) var<uniform> lightMatrix: mat4x4f;


@vertex fn vs(vert: Vertex)->VSOutput{
    var vsOut: VSOutput;

    vsOut.position =  viewMatrix * lightMatrix * vert.position;
    return vsOut;
}

@fragment fn fs()->@location(0) vec4f{
    return lColor;
}