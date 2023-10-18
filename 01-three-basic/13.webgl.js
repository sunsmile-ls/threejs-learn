// 创建 canvas 添加 body
var canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerWidth
document.querySelector('#app').appendChild(canvas)

// 获取 webgl 绘图上下文
var gl = canvas.getContext('webgl')

// 第一次创建 webgl 绘图上下文，需要设置视口大小
gl.viewport(0, 0, canvas.width, canvas.height)

// 创建顶点着色器
var verTextShader = gl.createShader(gl.VERTEX_SHADER)
// 创建顶点着色器的源码，需要编写glsl代码
// varying vec4 v_Color; 表示顶点着色器可以传值到片元着色器
gl.shaderSource(
	verTextShader,
	`
  attribute vec4 a_Position;
  uniform mat4 u_Mat;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_Mat * a_Position;
    v_Color = gl_Position;
  }
`
)
// 编译顶点着色器
gl.compileShader(verTextShader)

// 创建片元着色器
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
// 创建片元着色器的源码，需要使用glsl代码
// percision mediump float; 使gpu 估计顶点着色器传递给片元的精度
gl.shaderSource(
	fragmentShader,
	`
  precision mediump float;
  varying vec4 v_Color;
  void main(){
    gl_FragColor = v_Color;
  }
`
)
// 编译片元着色器
gl.compileShader(fragmentShader)

// 创建程序连接顶点着色器和片元着色器
var program = gl.createProgram()
// 链接顶点着色器和片元着色器
gl.attachShader(program, verTextShader)
gl.attachShader(program, fragmentShader)

// 链接程序
gl.linkProgram(program)

// use 程序进行渲染
gl.useProgram(program)
// 创建顶点缓存区对象
var vertexBuffer = gl.createBuffer()
// 绑定顶点缓存区对象
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
// 向顶点缓冲区对象中写入数据
var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5])
// gl.STATIC_DRAW 表示数据不会改变，gl.DYNAMIC_DRAW 表示数据会改变
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

// 获取顶点着色器中的 a_Position变量的位置
var a_Position = gl.getAttribLocation(program, 'a_Position')
// 将顶点缓冲区对象分配给a_Position变量
// 告诉OpenGL如何解析顶点数据
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
// 启动顶点着色器中的a_Position 变量
gl.enableVertexAttribArray(a_Position)

// 清除canvas
gl.clearColor(0.0, 0.0, 0.0, 0.0)
// 清除缓存区颜色
gl.clear(gl.COLOR_BUFFER_BIT)

// ------ start line -------
// 缩放功能
const scale = {
	x: 0.5,
	y: 0.5,
	z: 0.5,
}

function animate() {
	scale.x -= 0.01
	const mat = new Float32Array([
		scale.x,
		0.0,
		0.0,
		0.0,
		0.0,
		scale.x,
		0.0,
		0.0,
		0.0,
		0.0,
		scale.x,
		0.0,
		0.0,
		0.0,
		0.0,
		1.0,
	])
	// 获取 uniform 变量，并且设置值
	const u_Mat = gl.getUniformLocation(program, 'u_Mat')
	gl.uniformMatrix4fv(u_Mat, false, mat)
	// ------ end line --------
	// 绘制三角形
	gl.drawArrays(gl.TRIANGLES, 0, 3)
	requestAnimationFrame(animate)
}
animate()

