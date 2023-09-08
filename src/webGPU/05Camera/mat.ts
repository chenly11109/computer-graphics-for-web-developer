const getRadians = (deg: number) => {
  return (deg / 180) * Math.PI;
};

export const mat4 = {
  perspective(
    fovy: number,
    aspect: number,
    zNear: number,
    zFar: number,
    dst?: Float32Array
  ) {
    dst = dst || new Float32Array(16);

    const fInRadians = getRadians(90 - fovy / 2);
    const f = Math.tan(fInRadians);
    const rangeInv = 1 / (zFar-zNear);

    dst[0] = f / aspect;
    dst[1] = 0;
    dst[2] = 0;
    dst[3] = 0;

    dst[4] = 0;
    dst[5] = f;
    dst[6] = 0;
    dst[7] = 0;

    dst[8] = 0;
    dst[9] = 0;
    dst[10] =- (zFar + zNear) * rangeInv;
    dst[11] = -1;

    dst[12] = 0;
    dst[13] = 0;
    dst[14] = 2 * zNear * zFar * rangeInv;
    dst[15] = 0;

    return dst;
  },

  multiply(a: Float32Array, b: Float32Array, dst: Float32Array) {
    dst = dst || new Float32Array(16);
    const b00 = b[0 * 4 + 0];
    const b01 = b[0 * 4 + 1];
    const b02 = b[0 * 4 + 2];
    const b03 = b[0 * 4 + 3];
    const b10 = b[1 * 4 + 0];
    const b11 = b[1 * 4 + 1];
    const b12 = b[1 * 4 + 2];
    const b13 = b[1 * 4 + 3];
    const b20 = b[2 * 4 + 0];
    const b21 = b[2 * 4 + 1];
    const b22 = b[2 * 4 + 2];
    const b23 = b[2 * 4 + 3];
    const b30 = b[3 * 4 + 0];
    const b31 = b[3 * 4 + 1];
    const b32 = b[3 * 4 + 2];
    const b33 = b[3 * 4 + 3];
    const a00 = a[0 * 4 + 0];
    const a01 = a[0 * 4 + 1];
    const a02 = a[0 * 4 + 2];
    const a03 = a[0 * 4 + 3];
    const a10 = a[1 * 4 + 0];
    const a11 = a[1 * 4 + 1];
    const a12 = a[1 * 4 + 2];
    const a13 = a[1 * 4 + 3];
    const a20 = a[2 * 4 + 0];
    const a21 = a[2 * 4 + 1];
    const a22 = a[2 * 4 + 2];
    const a23 = a[2 * 4 + 3];
    const a30 = a[3 * 4 + 0];
    const a31 = a[3 * 4 + 1];
    const a32 = a[3 * 4 + 2];
    const a33 = a[3 * 4 + 3];

    dst[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    dst[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    dst[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    dst[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;

    dst[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    dst[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    dst[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    dst[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;

    dst[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    dst[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    dst[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    dst[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;

    dst[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    dst[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    dst[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    dst[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

    return dst;
  },


  translation([tx, ty, tz]: number[]|Float32Array, dst?: Float32Array) {
    dst = dst || new Float32Array(16);
    dst.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1]);
    return dst;
  },
};

export const vec3 = {
  cross(a:Float32Array, b:Float32Array, dst?:Float32Array) {
    dst = dst || new Float32Array(3);

    const t0 = a[1] * b[2] - a[2] * b[1];
    const t1 = a[2] * b[0] - a[0] * b[2];
    const t2 = a[0] * b[1] - a[1] * b[0];

    dst[0] = t0;
    dst[1] = t1;
    dst[2] = t2;

    return dst;
  },

  subtract(a:number[], b:number[], dst?:Float32Array) {
    dst = dst || new Float32Array(3);

    dst[0] = a[0] - b[0];
    dst[1] = a[1] - b[1];
    dst[2] = a[2] - b[2];

    return dst;
  },

  normalize(v:number[]|Float32Array, dst?:Float32Array) {
    dst = dst || new Float32Array(3);

    const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    // make sure we don't divide by 0.
    if (length > 0.00001) {
      dst[0] = v[0] / length;
      dst[1] = v[1] / length;
      dst[2] = v[2] / length;
    } else {
      dst[0] = 0;
      dst[1] = 0;
      dst[2] = 0;
    }

    return dst;
  },
};

export const lookAt = (
  eye:[eyeX:number, eyeY:number, eyeZ:number],
  center: [centerX:number, centerY:number, centerZ:number], 
  UP:[upX:number,upY:number,upZ:number], dst?:Float32Array)=>{
    const F = vec3.subtract(eye, center);
    const f = vec3.normalize(F);
    const up = vec3.normalize(UP);
    const s = vec3.normalize(vec3.cross(f, up));
    const u = vec3.cross(s, f);

    dst = dst || new Float32Array(16);
    dst[0] = s[0];
    dst[1] = u[0];
    dst[2] = -f[0];
    dst[3] = 0;

    dst[4] = s[1];
    dst[5] = u[1];
    dst[6] = -f[1];
    dst[7] = 0;

    dst[8] = s[2];
    dst[9] = u[2];
    dst[10] = -f[2];
    dst[11] = 0;

    dst[12] = s[0];
    dst[13] = u[0];
    dst[14] = -f[0];
    dst[15] = 1;

    const translationMatrix = mat4.translation(vec3.subtract([0,0,0],eye));
    mat4.multiply(translationMatrix,dst,dst);
    return dst;

}