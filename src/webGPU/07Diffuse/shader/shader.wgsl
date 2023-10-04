struct Vertex {
    @builtin(vertex_index) vertexIndex : u32,
    @location(0) position: vec4f,
    @location(1) normal: vec4f
}

struct VSOutput {
    @builtin(position) position:vec4f,
    @location(1) fragPos: vec4<f32>,
    @location(2) fragNorm: vec4<f32>,
 
}

struct FInput {
    @location(1) fragPos: vec4<f32>,
    @location(2) fragNorm: vec4<f32>,

}

@group(0) @binding(0) var<uniform> viewMatrix: mat4x4f;
@group(1) @binding(0) var<uniform> sColor:vec4f;
@group(2) @binding(0) var<uniform> lColor:vec4f;
@group(2) @binding(1) var<uniform> lightPosition: mat4x4f;


@vertex fn vs(vert: Vertex)->VSOutput{
    var vsOut: VSOutput;

    vsOut.position =  viewMatrix * vert.position;

    vsOut.fragPos = vsOut.position;
    vsOut.fragNorm = vert.normal;
  
    return vsOut;
}

@fragment fn fs(fInput : FInput)->@location(0) vec4f{
    var to_light: vec4f;
    var cos_angle: f32;
    var fColor: vec4f;

    to_light = normalize(lightPosition * vec4f(0,0,0,1) - fInput.fragPos);
    cos_angle = dot(fInput.fragNorm, to_light);
    cos_angle = clamp(cos_angle, 0.0, 1.0);
    fColor = vec4(vec3(sColor.rgb) * cos_angle, sColor.a) * lColor;

    return fColor;
}