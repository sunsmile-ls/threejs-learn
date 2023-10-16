// 创建 canvas 添加 body
var canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerWidth
document.querySelector('body').appendChild(canvas)

// 获取 webgl 绘图上下文
var gl = canvas.getContext('webgl')

// 第一次创建 webgl 绘图上下文，需要设置视口大小
gl.viewport(0, 0, canvas.width, canvas.height)

// 创建顶点着色器
var verTextShader = gl.createShader(gl.VERTEX_SHADER)
// 创建顶点着色器的源码，需要编写glsl代码
gl.shaderSource(
	verTextShader,
	`
  attribute vec4 a_Position;
  void main() {
    gl_Position = a_Position;
  }
`
)
// 编译顶点着色器
gl.compileShader(verTextShader)

// 创建片元着色器
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
// 创建片元着色器的源码，需要使用glsl代码
gl.shaderSource(
	fragmentShader,
	`
  void main(){
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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

// 绘制三角形
gl.drawArrays(gl.TRIANGLES, 0, 3)

