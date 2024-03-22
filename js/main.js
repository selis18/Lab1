// Ссылка на блок веб-страницы, где будет отображаться графика
let container;

// Переменные: камера, сцена и отрисовщик
let camera, scene, renderer;
let n = 255;

let imagedata;
init();
animate();

function init() {
    container = document.getElementById('container');

    scene = new THREE.Scene();

    // Инициализация камеры
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);

    camera.position.set(n/2, n/2, n*1.5); // Позиция камеры
    camera.lookAt(new THREE.Vector3(n/2, 0, n/2)); // Направление взгляда камеры

    const color = 0x0000FF;
    const intensity = 140;
    const light = new THREE.SpotLight(color, intensity);
    scene.add(light); // Добавление направленного света в сцену
    scene.add(light.target);
    

    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setClearColor(0x000000ff, 1); // Установка цвета фона сцены
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    // Загрузка изображения для использования карты высот
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let img = new Image();

    img.onload = function()
    {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        imagedata = context.getImageData(0, 0, img.width, img.height);

        createTerrain(n); // Создание террейна с учетом карты высот
    }

    img.src = 'pics/plateau.jpg';
}

// Функция обновления размеров при изменении окна
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Функция анимации
function animate() {
    requestAnimationFrame(animate);

    render();
}

// Функция отрисовки сцены
function render() {
    renderer.render(scene, camera);
}

// Создание сетки террейна
function createTerrain(n) {
    let geometry = new THREE.Geometry();

    // Создание массива вершин по высотам из карты высот
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            let y = getPixel(imagedata, i, j)/ 10.0;  // Получение высоты из карты и масштабирование
            geometry.vertices.push(new THREE.Vector3(j, y, i));
        }
    }

    // Создание треугольников для фейсинга
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
    
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    // Загрузка текстурной карты и настройка материала
    let loader = new THREE.TextureLoader();
    let tex = loader.load('pics/grasstile.jpg');

    let mat = new THREE.MeshLambertMaterial({
        map: tex,
        wireframe: false,
        side: THREE.DoubleSide
    });

    // Создаем объект Mesh и добавляем его в сцену
    let mesh = new THREE.Mesh(geometry, mat);
    scene.add(mesh);

    // Получение цвета пикселя из карты высот
    function getPixel(imagedata, x, y) {
        let position = (x + imagedata.width * y) * 4;
        return imagedata.data[position];
    }

    // Создание точечного источника освещения и его добавление в сцену
    let spotlight = new THREE.PointLight(0xffffff);
    spotlight.position.set(100, 100, 100);
    scene.add(spotlight);

}
