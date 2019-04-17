"use strict";

let Vertex_Shader_Source = 'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = 10.0;\n' +
    '}\n';

let Fragment_Shader_Source = 'void main() {\n' +
    '  gl_FragColor = vec4(0.5, 0.7, 0.1, 1.0);\n' +
    '}\n';

let ShaderProgram = {};

ShaderProgram.Create = function (shaderList) {

    let shaderObjs = [];

    for (let i_sh = 0; i_sh < shaderList.length; ++i_sh) {
        let shderObj = this.CompileShader(shaderList[i_sh].source, shaderList[i_sh].stage);
        if (shderObj == 0)
            return 0;
        shaderObjs.push(shderObj);
    }

    let progObj = this.LinkProgram(shaderObjs);

    if (progObj != 0) {
        progObj.attribIndex = {};
        let noOfAttributes = gl.getProgramParameter(progObj, gl.ACTIVE_ATTRIBUTES);
        for (let i_n = 0; i_n < noOfAttributes; ++i_n) {
            let name = gl.getActiveAttrib(progObj, i_n).name;
            progObj.attribIndex[name] = gl.getAttribLocation(progObj, name);
        }
        progObj.unifomLocation = {};
        let noOfUniforms = gl.getProgramParameter(progObj, gl.ACTIVE_UNIFORMS);
        for (let i_n = 0; i_n < noOfUniforms; ++i_n) {
            let name = gl.getActiveUniform(progObj, i_n).name;
            progObj.unifomLocation[name] = gl.getUniformLocation(progObj, name);
        }
    }

    return progObj;
}

ShaderProgram.AttributeIndex = function (progObj, name) {
    return progObj.attribIndex[name];
}

ShaderProgram.UniformLocation = function (progObj, name) {
    return progObj.unifomLocation[name];
}

ShaderProgram.Use = function (progObj) {
    gl.useProgram(progObj);
}

ShaderProgram.SetUniformI1 = function (progObj, name, val) {
    if (progObj.unifomLocation[name])
        gl.uniform1i(progObj.unifomLocation[name], val);
}

ShaderProgram.SetUniformF1 = function (progObj, name, val) {
    if (progObj.unifomLocation[name])
        gl.uniform1f(progObj.unifomLocation[name], val);
}

ShaderProgram.SetUniformF2 = function (progObj, name, arr) {
    if (progObj.unifomLocation[name])
        gl.uniform2fv(progObj.unifomLocation[name], arr);
}

ShaderProgram.SetUniformF3 = function (progObj, name, arr) {
    if (progObj.unifomLocation[name])
        gl.uniform3fv(progObj.unifomLocation[name], arr);
}

ShaderProgram.SetUniformF4 = function (progObj, name, arr) {
    if (progObj.unifomLocation[name])
        gl.uniform4fv(progObj.unifomLocation[name], arr);
}

ShaderProgram.SetUniformM33 = function (progObj, name, mat) {
    if (progObj.unifomLocation[name])
        gl.uniformMatrix3fv(progObj.unifomLocation[name], false, mat);
}

ShaderProgram.SetUniformM44 = function (progObj, name, mat) {
    if (progObj.unifomLocation[name])
        gl.uniformMatrix4fv(progObj.unifomLocation[name], false, mat);
}

ShaderProgram.CompileShader = function (source, shaderStage) {
    let shaderScript = document.getElementById(source);

    if (shaderScript) {
        source = "";
        let node = shaderScript.firstChild;
        while (node) {
            if (node.nodeType == 3) source += node.textContent;
            node = node.nextSibling;
        }
    }

    let shaderObj = gl.createShader(shaderStage);
    gl.shaderSource(shaderObj, source);
    gl.compileShader(shaderObj);
    let status = gl.getShaderParameter(shaderObj, gl.COMPILE_STATUS);

    if (!status)
        alert(gl.getShaderInfoLog(shaderObj));

    return status ? shaderObj : 0;
}

ShaderProgram.LinkProgram = function (shaderObjs) {

    let prog = gl.createProgram();

    for (let i_sh = 0; i_sh < shaderObjs.length; ++i_sh)
        gl.attachShader(prog, shaderObjs[i_sh]);

    gl.linkProgram(prog);

    status = gl.getProgramParameter(prog, gl.LINK_STATUS);
    if (!status) alert("Could not initialise shaders");
    gl.useProgram(null);
    return status ? prog : 0;
}

function initShaders(gl, vert_code, frag_code) {

    let progDraw = ShaderProgram.Create(
        [
            { source: Vertex_Shader_Source, stage: gl.VERTEX_SHADER },
            { source: Fragment_Shader_Source, stage: gl.FRAGMENT_SHADER }
        ]
    );

    progDraw.inPos = gl.getAttribLocation(progDraw, "a_Position");

    if (progDraw == 0)
        return false;

    ShaderProgram.Use(progDraw);

    gl.program = progDraw;
    return true;
}

function initArrayBuffers(gl, zoom, trans) {

    let SPHERE_DIV = 20;
    let i, ai, si, ci;
    let j, aj, sj, cj;
    let p1, p2;
    let vertices = [], indices = [];

    for (j = 0; j <= SPHERE_DIV; j++) {

        aj = (j * Math.PI / SPHERE_DIV);
        sj = 0.9 * Math.sin(aj);
        cj = Math.cos(aj) + trans;

        for (i = 0; i <= SPHERE_DIV; i++) {

            ai = i * 2 * Math.PI / SPHERE_DIV;
            si = Math.sin(ai);
            ci = Math.cos(ai);
            vertices.push(si * sj * zoom / 2);
            vertices.push(cj * zoom / 2);
            vertices.push(ci * sj * zoom / 2);

        }

    }

    for (j = 0; j < SPHERE_DIV; j++) {
        for (i = 0; i < SPHERE_DIV; i++) {

            p1 = j * (SPHERE_DIV + 1) + i;
            p2 = p1 + (SPHERE_DIV + 1);

            indices.push(p1);
            indices.push(p2);
            indices.push(p1 + 1);
            indices.push(p1 + 1);
            indices.push(p2);
            indices.push(p2 + 1);

        }
    }

    let vertexBuffer = gl.createBuffer();

    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }


    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    let indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return indices.length;

}

let n = 0;
let zoomval = 0.3;
let zoom_step = 0.01
let transval = 1;
let trans_step = 0.05;
function drawScene() {
    if (zoomval > 0.5) {
        zoom_step = -zoom_step;
		/*	
			while(zoomval > 0.4){
		 		zoomval += zoom_step		
		 	}
			zoom_step = 0.01
		*/
    }
    if (zoomval < 0.15) {
        zoom_step = -zoom_step;
        while (zoomval < 0.15) {
            zoomval += zoom_step;
        }
        zoom_step = 0.01;
    }
    zoomval += zoom_step;
    zoom_step = 0.999 * zoom_step;
    if (transval > 2) {
        trans_step = -trans_step;
		/* 
			while(transval > 0.4){
		 		transval += trans_step		
			}
			trans_step = 0.01
		*/
    }
    if (transval < -2) {
        trans_step = -trans_step;
        while (transval < -2) {
            transval += trans_step;
        }
        trans_step = 0.05;
    }
    transval += trans_step;
    trans_step = 0.999 * trans_step;
    n = initArrayBuffers(gl, zoomval, transval);
    let canvas = document.getElementById("glow-canvas");
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(0.2, 0.4, 0.6, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
}

let gl;

function anim() {
    let canvas = document.getElementById("glow-canvas");
    let vp = [canvas.width, canvas.height];
    gl = canvas.getContext("experimental-webgl");
    if (!gl)
        return;

    if (!initShaders(gl, Vertex_Shader_Source, Fragment_Shader_Source)) {
        console.log('Initializing shaders failed.');
        return;
    }

    setInterval(drawScene, 60);
}