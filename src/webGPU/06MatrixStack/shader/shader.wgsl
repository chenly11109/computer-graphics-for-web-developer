struct Vertex {
    @location(0) position: vec4f,
    // @location(1) color:vec4f
}

struct VSOutput {
    @builtin(position) position:vec4f,
    // @location(0) color:vec4f
}

@group(0) @binding(0) var<uniform> viewMatrix: mat4x4f;

@vertex fn vs(vert: Vertex)->VSOutput{
    var vsOut: VSOutput;
    vsOut.position =viewMatrix * vert.position;
  
    // vsOut.color = vert.color;

    return vsOut;
}

@fragment fn fs()->@location(0) vec4f{
    return vec4(1.0, 0, 0, 1.0);
}