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
@group(2) @binding(2) var<uniform> shininess: f32;
@group(2) @binding(3) var<uniform> attenuation: f32;


@vertex fn vs(vert: Vertex)->VSOutput{
    var vsOut: VSOutput;
    vsOut.position =  viewMatrix * vert.position;
    vsOut.fragPos = vsOut.position;
    vsOut.fragNorm = vert.normal;
    return vsOut;
}

@fragment fn fs(fInput : FInput)->@location(0) vec4f{
    var to_light: vec4f;
    var reflection: vec4f;
    var cos_angle: f32;
    var specular_color : vec4f;
    var ambient_color : vec4f;
    var diffuse_color : vec4f;

    var to_camera:vec4f;
    var fColor : vec4f;

    to_light = lightPosition * vec4f(0,0,0,1) - fInput.fragPos;

    var distance : f32;
    distance = length(to_light);
    to_light = normalize(to_light);
    reflection = normalize(2 * dot(fInput.fragNorm, to_light) * fInput.fragNorm - to_light);
    to_camera = normalize(fInput.fragPos);

    cos_angle = dot(reflection, to_camera);
    cos_angle = clamp(cos_angle, 0.0, 1.0);
    cos_angle = pow(cos_angle, shininess);
    specular_color = lColor * cos_angle;
 
    cos_angle = dot(fInput.fragNorm, to_light);
    cos_angle = clamp(cos_angle, 0.0, 1.0);
    diffuse_color = sColor * cos_angle;

    ambient_color = lColor * sColor;
    var attenuationFactor : f32;
    attenuationFactor = clamp(attenuation / distance, 0.0, 1.0);

    fColor = vec4(attenuationFactor * (ambient_color + diffuse_color + specular_color).rgb, sColor.a);

    return fColor;
}