struct Uniforms{
    matrix: mat4x4f
}
@group(0) @binding(0) var<uniform> uni: Uniforms;
struct Vertex {
    @location(0) position: vec2f,
    @location(1) color:vec4f
}

struct VSOutput {
    @builtin(position) position:vec4f,
    @location(0) color:vec4f
}

@vertex fn vs(vert: Vertex)->VSOutput{
    var vsOut: VSOutput;
    let clipSpace = (uni.matrix * vec4f(vert.position,0, 1)).xy;
    vsOut.position = vec4f(clipSpace, 0.0, 1.0);
    vsOut.color = vert.color;

    return vsOut;
}

@fragment fn fs(vsOut: VSOutput)->@location(0) vec4f{
    return vsOut.color;
}