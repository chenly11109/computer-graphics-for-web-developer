import { mat4, lookAt } from "./mat";

export class Stack {
  stack: any[];
  constructor() {
    this.stack = [];
  }
  push(item: any) {
    this.stack.push(item);
  }
  pop() {
    if (this.stack.length == 0) return undefined;
    return this.stack.pop();
  }
  peek() {
    return this.stack[this.stack.length - 1];
  }
}

export class MatrixStack {
  private m_currMatrix: Float32Array;
  stack: Float32Array[];


  constructor(matrix?: Float32Array) {
    this.stack = [];
    this.m_currMatrix = matrix || mat4.identity();
  }

  push(matrix?: Float32Array) {
    //apply the matrix
    //save the current matrix
    //set the currentMatrix
    this.stack.push(this.m_currMatrix);
    this.applyMatrix(matrix);
    return this.m_currMatrix;
  }

  pop() {

    //pop the latest matrix;
    //make sure there is still one matrix available
    const currMatrix = this.m_currMatrix;
    this.m_currMatrix = this.stack.pop() || mat4.identity();
    return currMatrix;
  }

  getCurrMatrix() {
    return this.m_currMatrix;
  }

  private applyMatrix(matrix?: Float32Array) {
    this.m_currMatrix = matrix ? mat4.multiply(matrix, this.m_currMatrix) : this.m_currMatrix
  }

  rotateX(deg: number) {
    const rotationMatrix = mat4.rotationX(deg);
    this.applyMatrix(rotationMatrix);
  }
  rotateY(deg: number) {
    const rotationMatrix = mat4.rotationY(deg);
    this.applyMatrix(rotationMatrix);

  }
  rotateZ(deg: number) {
    const rotationMatrix = mat4.rotationZ(deg);
    this.applyMatrix(rotationMatrix);
  }

  translate([tx, ty, tz]: number[]) {
    const translationMatrix = mat4.translation([tx, ty, tz]);
    this.applyMatrix(translationMatrix);
  }

  scale([sx, sy, sz]: number[]) {
    const scaleMatrix = mat4.scaling([sx, sy, sz]);
    this.applyMatrix(scaleMatrix);
  }

  ortho(left: number, right: number, bottom: number, top: number, near: number, far: number) {
    const orthoMatrix = mat4.ortho(left, right, bottom, top, near, far);
    this.applyMatrix(orthoMatrix);
  }

  perspective(fovy: number,
    aspect: number,
    zNear: number,
    zFar: number,) {

    const perspectiveMatrix = mat4.perspective(fovy, aspect, zNear, zFar);
    this.applyMatrix(perspectiveMatrix);
  }

  lookAt(eye: [eyeX: number, eyeY: number, eyeZ: number],
    center: [centerX: number, centerY: number, centerZ: number],
    UP: [upX: number, upY: number, upZ: number]) {

    const cameraMatrix = lookAt(eye, center, UP);

    this.applyMatrix(cameraMatrix);
  }
}
