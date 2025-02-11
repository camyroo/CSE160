class Triangle {
    constructor() {
        this.type = 'triangle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
    }

    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniform1f(u_Size, size);

        var d = this.size / 200.0;

        drawTriangle([xy[0], [xy[1]], xy[0] + d, xy[1], xy[0], xy[1] + d]);
    }


}

var g_vertexBuffer = null;
function initTriangle3D() {

    g_vertexBuffer = gl.createBuffer();
    if (!g_vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

}

function drawTriangle(vertices) {
    if (!g_vertexBuffer) {
        g_vertexBuffer = gl.createBuffer();
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    let n = vertices.length / 3;
    gl.drawArrays(gl.TRIANGLES, 0, n);
}


function drawTriangle3D(vertices) {
    if (!g_vertexBuffer) {
        initTriangle3D();
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);

    let n = vertices.length / 3;
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

let g_uvBuffer = null;

function drawTriangle3DUV(vertices, uv) {
    let n = vertices.length / 3;

    if (!g_vertexBuffer) {
        g_vertexBuffer = gl.createBuffer();
    }
    if (!g_uvBuffer) {
        g_uvBuffer = gl.createBuffer();
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER, g_uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);

    gl.drawArrays(gl.TRIANGLES, 0, n);

    g_vertexBuffer = null;
}
