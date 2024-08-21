const canvas = document.querySelector(".canvas");
const inputSize = document.querySelector(".input-size");
const inputColor = document.querySelector(".input-color");
const usedColors = document.querySelector(".used-colors");
const buttonSave = document.querySelector(".button-save");
const colResize = document.querySelector(".resize");
const main = document.querySelector("main");
const buttonEraser = document.querySelector(".button-eraser");
const buttonPaint = document.querySelector(".button-paint");

const MIN_CANVAS_SIZE = 4;

let isPainting = true;
let isDragPainting = false;
let isResizing = false;
let isEraserActive = false;

const createElement = (tag, className = "") => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

const setPixelColor = (pixel) => {
    if (isEraserActive) {
      pixel.style.backgroundColor = "#fff"; // Cor padrão para apagar
    } else {
      pixel.style.backgroundColor = inputColor.value; // Cor para pintar
    }
};

const createPixel = () => {
    const pixel = createElement("div", "pixel");
  
    // PINTAR OU APAGAR AO CLICAR
    pixel.addEventListener("mousedown", () => {
      isDragPainting = true; // Inicia a pintura ao arrastar
      setPixelColor(pixel);
    });
  
    // PINTAR OU APAGAR AO ARRASTAR
    pixel.addEventListener("mouseover", () => {
      if (isDragPainting) setPixelColor(pixel);
    });
  
    return pixel;
};

const loadCanvas = () => {
  const length = inputSize.value;
  canvas.innerHTML = "";
  for (let i = 0; i < length; i += 1) {
    const row = createElement("div", "row");

    for (let j = 0; j < length; j += 1) {
      row.append(createPixel());
    }

    canvas.append(row);
  }
};

const updateCanvasSize = () => {
  if (inputSize.value >= MIN_CANVAS_SIZE) {
    loadCanvas();
  } else {
    alert("Valor mínimo: 4");
  }
};

const changeColor = () => {
  const button = createElement("button", "button-color");
  const currentColor = inputColor.value;
  button.style.backgroundColor = currentColor;
  button.setAttribute("data-color", currentColor);
  button.addEventListener("click", () => (inputColor.value = currentColor));

  const savedColors = Array.from(usedColors.children);

  const check = (btn) => btn.getAttribute("data-color") != currentColor;

  if (savedColors.every(check)) {
    usedColors.append(button);
  }

  console.log(savedColors);
};

const resizeCanvas = (cursorPositionX) => {
  if (!isResizing) return;

  const canvaOffset = canvas.getBoundingClientRect().left;
  const width = `${cursorPositionX - canvaOffset - 20}px`;

  canvas.style.maxWidth = width;
  colResize.style.height = width;
  // console.log("Resizing")
};

const saveCanvas = () => {
  html2canvas(canvas).then((image) => {
    const img = image.toDataURL("image/png");
    const link = createElement("a");

    link.href = img;
    link.download = "pixelart.png";

    link.click();
  });
};

const activeButton = (button) => {
    buttonPaint.classList.remove("button-active");
    buttonEraser.classList.remove("button-active");

    button.classList.add("button-active");
}

// Evento para iniciar a pintura ao arrastar
canvas.addEventListener("mousedown", () => (isDragPainting = true));

// Evento para parar a pintura ao arrastar
main.addEventListener("mouseup", () => (isDragPainting = false));

inputSize.addEventListener("change", updateCanvasSize);
inputColor.addEventListener("change", changeColor);

colResize.addEventListener("mousedown", () => (isResizing = true));
main.addEventListener("mouseup", () => (isResizing = false));
main.addEventListener("mousemove", ({ clientX }) => resizeCanvas(clientX));

buttonPaint.addEventListener("click", () => {
    isEraserActive = false;
    isPainting = true; // Ativa a pintura
    
    activeButton(buttonPaint);
    console.log(isPainting);
});

buttonEraser.addEventListener("click", () => {
    isEraserActive = !isEraserActive;
    isPainting = false;
    
    activeButton(buttonEraser);
    console.log(isEraserActive);
});

buttonSave.addEventListener("click", saveCanvas);

activeButton(buttonPaint);
loadCanvas();
