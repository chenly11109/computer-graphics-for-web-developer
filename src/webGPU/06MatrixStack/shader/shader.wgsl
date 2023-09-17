struct Vertex {
    @builtin(vertex_index) vertexIndex : u32,
    @location(0) position: vec4f,
}

struct VSOutput {
    @builtin(position) position:vec4f,
    @location(0) fragUV: vec2<f32>
}

struct FS {
    @builtin(position) pos: vec4f,
    @location(0) uv: vec2f,
}

@group(0) @binding(0) var<uniform> objectType:u32;
@group(1) @binding(1) var samp: sampler;
@group(1) @binding(2) var tex: texture_2d<f32>;

@group(2) @binding(0) var<uniform> viewMatrix: mat4x4f;


@vertex fn vs(vert: Vertex)->VSOutput{
    var vsOut: VSOutput;

 const uv = array(
    vec2(0.0, 0.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),
    vec2(0.0, 1.0),
  );

    vsOut.position =viewMatrix * vert.position;
    vsOut.fragUV = uv[vert.vertexIndex ];
    // vsOut.color = vert.color;

    return vsOut;
}

@fragment fn fs(@location(0) fragUV: vec2f,)->@location(0) vec4f{
    var color : vec4f;
    if(objectType == 1){
        color = vec4f(1.0, 0.0, 0.0, 1.0);
        
        }else{
     color = textureSample(tex, samp, fragUV);
    }
    return color;
}