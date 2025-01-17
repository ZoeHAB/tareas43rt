"use strict";

/* 
//
//Ejemplo estructura tarea
let task = {
  id: 1,
  text: "Comprar pan",
  done: false,
  important: false,
  date: new Date(),
};
//

 */

//Selecciono los elementos necesarios
let [form] = document.forms;
let taskUl = document.querySelector("#listaTareas");

let cleanButton = document.querySelector("#limpiar");
let resetButton = document.querySelector("#borrar");
console.log(cleanButton, resetButton);

//Recupero las tareas guardadas
let savedTasks = localStorage.getItem("taskList");

//Variable para almacenar todas las tareas
//Si habia guardadas, serán las guardadas, si no, un array vacío
let taskList = JSON.parse(savedTasks) || [];

console.log(taskList);

//Añado las tareas almacenadas al DOM
///creo un fragment
const fragment = document.createDocumentFragment();
///Las recorro
for (const task of taskList) {
  //Por cada una genero su HTML
  let taskHTML = generateTaskHTML(task);

  //la añado al fragment
  fragment.append(taskHTML);
}

//Al terminar el bucle, añado el fragment al ul
taskUl.append(fragment);

//Función para generar tareas
function generateTask(text, important) {
  //Averiguo el id de la ultima tarea
  let lastId = taskList[taskList.length - 1]?.id;
  return {
    text,
    done: false,
    important,
    date: formatDate(new Date()),
    id: lastId ? lastId + 1 : 1, //uno más que el id de la última o 1
  };
}

//Función para el submit del formulario
function handleSubmit(e) {
  try {
    //Cancelo el comportamiento para que no reinicie
    e.preventDefault();

    //Cojo los datos del formulario
    //Trim quita espacios del principio y final
    let text = form.new.value.trim();
    let important = form.important.checked;

    //Validamos la longitud del texto
    if (text.length < 4 || text.length > 20) {
      //Recordad que para lanzar errores tenemos que estar en un try
      throw new Error("longitud no adecuada");
    }

    //Genero un nuevo objeto tarea
    let newTask = generateTask(text, important);

    //Añado la tarea
    addTask(newTask);

    //Limpio el formulario
    form.reset();
  } catch (e) {
    alert(e.message);
  }
}

//Asocio la función al evento submit
form.addEventListener("submit", handleSubmit);

//Función para generar el html de una tarea
function generateTaskHTML(task) {
  //Creo el li de la tarea
  let taskLi = document.createElement("li");

  //Si es importante, le pongo la clase
  if (task.important) {
    taskLi.classList.add("important");
  }

  //Si está hecha, le pongo la clase
  if (task.done) {
    taskLi.classList.add("done");
  }

  //Versión "trabajosa"

  /*   //Creo el input para el checkbox
  let checkbox = document.createElement("input");

  //Le asigno el tipo
  checkbox.setAttribute("type", "checkbox");

  //Le pongo el checked
  checkbox.checked = task.done

  //Creo el h2
  let h2 = document.createElement("h2");

  //Le meto el texto
  h2.textContent = task.text;

  //Creo el párrafo de la fecha
  let dateP = document.createElement("p");

  //Le meto la fecha
  dateP.textContent = task.date;

  //Añado todo al li
  taskLi.append(checkbox, h2, dateP); */

  //Hasta aquí la versión "trabajosa"

  //Atajo:

  //Genero un string con el contenido
  let content = `
  <input type="checkbox" ${task.done ? "checked" : ""}/>
          <h2>${task.text}</h2>
          <p class="date">${task.date}</p>
  `;

  //Meto el string como innerHTML
  taskLi.innerHTML = content;

  //Añado el id de la tarea
  taskLi.dataset.id = task.id;

  //Hasta aquí el atajo

  return taskLi;
}

//Función auxiliar para formatear la fecha
function formatDate(date) {
  //Convierto a string para poder aplicar padStart para que siempre mida dos digitos (si no, rellena con 0)
  let day = String(date.getDate()).padStart(2, "0");

  let month = String(date.getMonth() + 1).padStart(2, "0"); //sumo 1 porque empieza en 0

  let year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

//Función para añadir tarea
function addTask(task) {
  //Genero el HTML de la tarea
  let taskHtml = generateTaskHTML(task);

  //Lo añado al ul y a la lista
  //Prepend y unshift si quiero que vaya al principio, append y push si quiero que vaya al final
  taskUl.append(taskHtml);
  taskList.push(task);

  //Guardo/actualizo la lista en el localStorage
  localStorage.setItem("taskList", JSON.stringify(taskList));
}

function handleDoneChange(e) {
  let target = e.target;

  //Si el target es un checkbox
  if (target.matches('[type="checkbox"]')) {
    //Aquí aplico la lógica

    //Cojo al padre
    let taskLi = target.parentElement;

    //Alertno la clase
    taskLi.classList.toggle("done");

    //Busco la tarea en la lista
    ////El id de la tarea
    let id = taskLi.dataset.id;
    ////Busco la tarea con ese id

    let taskObj = taskList.find((task) => task.id === +id);

    //Modifico la propiedad done  en el objeto
    taskObj.done = !taskObj.done;

    //Guardo la lista actualizada
    localStorage.setItem("taskList", JSON.stringify(taskList));
  }
}

taskUl.addEventListener("click", handleDoneChange);

//////////////////

//Botón para limpiar

function handleClean() {
  //Pasan el filtro las tareas que NO están hechas
  taskList = taskList.filter((task) => !task.done);

  //Selecciono todos los hijos del ul
  let lis = taskUl.children;

  //Los recorro
  for (const li of lis) {
    //Si tiene la clase done
    if (li.classList.contains("done")) {
      //Lo elimino
      li.remove();
    }
  }

  //Actualizo el localStorage
  localStorage.setItem("taskList", JSON.stringify(taskList));
}

cleanButton.addEventListener("click", handleClean);

/////////////////

function handleReset() {
  //Lo borro del DOM
  taskUl.innerHTML = "";

  //Borro de la lista
  taskList = [];

  //actualizo el localStorage
  localStorage.removeItem("taskList");

  console.log("borrar todo");
}

resetButton.addEventListener("click", handleReset);
