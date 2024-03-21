// ссылка на блок веб-страницы, в котором будет отображаться графика
let container;

// переменные: камера, сцена и отрисовщик
let camera, scene, renderer;

init();
animate();

function init() {
    container = document.getElementById('container');
  
    scene = new THREE.Scene();
  
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 2, 4000);
  
    camera.position.set(5, 5, 5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    const color = 0x0000FF;
    const intensity = 200;
    const light = new THREE.SpotLight(color, intensity);
    scene.add(light);
    scene.add(light.target);
    const helper = new THREE.SpotLightHelper(light);
    scene.add(helper);
  
    renderer = new THREE.WebGLRenderer({ antialias: false });
  
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setClearColor(0x000000ff, 1);

    container.appendChild(renderer.domElement); 
  
    window.addEventListener('resize', onWindowResize, false);
  }
  
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  
  function animate() {
    requestAnimationFrame(animate);
    render();
  }
  
  function render() {
    renderer.render(scene, camera);
  }
  
// let geometry = new THREE.Geometry();

/*  geometry.vertices.push(new THREE.Vector3(1.0, 1.0, 3.0));
  geometry.vertices.push(new THREE.Vector3(0.0, 3.0, 0.0));
  geometry.vertices.push(new THREE.Vector3(3.0, 0.0, 1.0));

  geometry.faces.push(new THREE.Face3(0, 1, 2));

  geometry.faces[0].vertexColors[0] = new THREE.Color(0xff0000);
  geometry.faces[0].vertexColors[1] = new THREE.Color(0x00ff00);
  geometry.faces[0].vertexColors[2] = new THREE.Color(0x0000ff);

  let triangleMaterial = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        wireframe: true,
        side: THREE.DoubleSide
    });

    let triangleMesh = new THREE.Mesh(geometry, triangleMaterial);
    triangleMesh.position.set(0.0, 0.0, 0.0);
    
    scene.add(triangleMesh);
*/
//Разработать программу, отображающую на экране регулярную полигональную сетку заданного размера. 
//Размер задаётся в блоке объявления глобальных переменных в виде константы.
let geometry = new THREE.Geometry();
let n = 3;

createTerrain(n);

function createTerrain(n){

    // Рассчитываем общее количество вершин и треугольников
    let numberVertices = n * n;
    let numberTriangles = 2 * (n - 1) * (n - 1);  // Исправлено: исправлено вычисление общего количества треугольников

    // Создаем массив вершин
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            geometry.vertices.push(new THREE.Vector3(j, 0, i));
        }
    }

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - 1; j++) {
            let index = i * n + j;
            let faceA = new THREE.Face3(index, index + n + 1, index + 1);
            let faceB = new THREE.Face3(index, index + n, index + n + 1);
            geometry.faces.push(faceA, faceB);
            
            geometry.faceVertexUvs[0].push([
                new THREE.Vector2(j / n, i / n),
                new THREE.Vector2((j + 1) / n, i / n),
                new THREE.Vector2((j + 1) / n, (i + 1) / n)
            ]);

            geometry.faceVertexUvs[0].push([
                new THREE.Vector2(j / n, i / n),
                new THREE.Vector2((j + 1) / n, (i + 1) / n),
                new THREE.Vector2(j / n, (i + 1) / n)
            ]);
        }
    }


    let loader = new THREE.TextureLoader();
    let tex = loader.load('pics/grasstile.jpg');
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; 
    tex.repeat.set(n, n);

    let mat = new THREE.MeshBasicMaterial({
        map: tex, // источник цвета - текстура
        wireframe: false,
        side:THREE.DoubleSide
        });

    let imageData;
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let img = new Image();

    img.onload = function (){
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        imageData = context.getImageData(0, 0, img.width, img.height);
    }

    // Создаем объект Mesh и добавляем его в сцену

    let mesh = new THREE.Mesh(geometry, mat);

    scene.add(mesh);
}

