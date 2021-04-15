var pageNumber = 0;
var tableid = 1;
var apis = [
  "http://run.mocky.io/v3/6f7a76ed-d6f5-4b54-be23-bf9a141c982a",
  "http://run.mocky.io/v3/07316365-b8d2-4574-9bc1-22b17b054e3b",
  "http://run.mocky.io/v3/1c56213e-1191-4b47-a54f-066736165ff3"
];
var sortingBy = "ascending";
var tbody = document.querySelector("#tbody");
var gridview = document.querySelector("#grid-view");
var loader = document.querySelector("#loader");
fetchData();

// function to change the view
function changeview(view) {
  if (view === "grid") {
    document.getElementById("grid-view").classList.remove("hide");
    document.getElementById("table-view").classList.add("hide");
    document.getElementById("grid").classList.add("active");
    document.getElementById("table").classList.remove("active");
  } else {
    document.getElementById("table-view").classList.remove("hide");
    document.getElementById("grid-view").classList.add("hide");
    document.getElementById("table").classList.add("active");
    document.getElementById("grid").classList.remove("active");
  }
}

// function to get the data from api
function fetchData() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      generateGrid(data);
      generateTable(data);
    }
  };
  xhttp.open("GET", apis[pageNumber], true);
  xhttp.send();
}

// function to create grid view
function generateGrid(data) {
  for (var y = 0; y < data.length; y++) {
    var cell = document.createElement("div");
    cell.classList.add("item-wrapper");
    cell.innerHTML = `
          <div class="image-wrapper"><img src="${data[y].image}" /></div>
          <h5>${data[y].name}</h5>
          <p>${data[y].description}</p>`;
    gridview.appendChild(cell);
  }
  loader.classList.add("hide");
}

// function to create table view
function generateTable(data) {
  for (var y = 0; y < data.length; y++) {
    var cell = document.createElement("tr");
    cell.id = tableid++;
    cell.innerHTML = `<td><div class="tabimage-wrapper"><img src="${data[y].image}" /></div></td><td><h5>${data[y].name}</h5></td><td><p>${data[y].description}</p></td>`;
    tbody.appendChild(cell);
  }
  if (tbody.childElementCount > 80) {
    reduceElementTop();
  }
  loader.classList.add("hide");
}

// scroll for table view
tbody.addEventListener("scroll", function (event) {
  var element = event.target;
  if (element.scrollHeight - element.scrollTop === element.clientHeight) {
    loader.classList.remove("hide");
    getNextPageData();
  } else if (element.scrollTop == 0) {
    if (tbody.childElementCount > 80) {
      reduceElementBottom();
    }
  }
});

// scroll for grid view
window.addEventListener(
  "scroll",
  () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      loader.classList.remove("hide");
      getNextPageData();
    } else if (scrollTop == 0) {
      if (gridview.childElementCount > 80) {
        reduceElementBottom();
      }
    }
  },
  {
    passive: true
  }
);

// to infinite scroll get new page
function getNextPageData() {
  if (pageNumber === 2) {
    pageNumber = 0;
  } else {
    pageNumber++;
  }
  fetchData();
}

// items to remove from top
function reduceElementTop() {
  var elementCount = tbody.childElementCount;
  var CountToRemove = elementCount - 80;
  var elements = tbody.children;
  var gridElements = document.querySelectorAll(".item-wrapper");
  for (let i = 0; i < elements.length; i++) {
    if (i < CountToRemove) {
      elements[i].classList.add("hide");
      gridElements[i].classList.add("hide");
    } else {
      elements[i].classList.remove("hide");
      gridElements[i].classList.remove("hide");
    }
  }
}

// items to remove from bottom
function reduceElementBottom() {
  var elementCount = tbody.childElementCount;
  var CountToRemove = elementCount - 80;
  var elements = tbody.children;
  var gridElements = document.querySelectorAll(".item-wrapper");
  for (let i = elements.length - 1; i >= 0; i--) {
    if (i >= CountToRemove) {
      elements[i].classList.add("hide");
      gridElements[i].classList.add("hide");
    } else {
      elements[i].classList.remove("hide");
      gridElements[i].classList.remove("hide");
    }
  }
}

// function to search elements
function searchData(searchText) {
  var elements = document.querySelectorAll(".item-wrapper h5:nth-child(2)");
  elements.forEach((item) => {
    if (!item.innerHTML.toLowerCase().includes(searchText.toLowerCase())) {
      item.parentElement.classList.add("hide");
    } else {
      item.parentElement.classList.remove("hide");
    }
  });
  var telements = document.querySelectorAll("#tbody tr");
  telements.forEach((item) => {
    if (
      !item.children[1].children[0].innerHTML
        .toLowerCase()
        .includes(searchText.toLowerCase())
    ) {
      item.classList.add("hide");
    } else {
      item.classList.remove("hide");
    }
  });
}

// function to sort table by name
function sortTableByName() {
  loader.classList.remove("hide");
  var table, i, x, y;
  table = document.getElementById("table-scroll");
  var switching = true;

  while (switching) {
    switching = false;
    var rows = table.rows;

    for (i = 1; i < rows.length - 1; i++) {
      var Switch = false;

      firstElement = rows[i]
        .getElementsByTagName("td")[1]
        .getElementsByTagName("h5")[0];
      secondElement = rows[i + 1]
        .getElementsByTagName("td")[1]
        .getElementsByTagName("h5")[0];

      if (sortingBy == "ascending") {
        if (
          firstElement.innerHTML.toLowerCase() >
          secondElement.innerHTML.toLowerCase()
        ) {
          Switch = true;
          break;
        }
      } else if (sortingBy == "descending") {
        if (
          firstElement.innerHTML.toLowerCase() <
          secondElement.innerHTML.toLowerCase()
        ) {
          Switch = true;
          break;
        }
      } else if (sortingBy == "id") {
        if (parseInt(rows[i].id) > parseInt(rows[i + 1].id)) {
          Switch = true;
          break;
        }
      }
    }
    if (Switch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
  if (sortingBy == "ascending") {
    sortingBy = "descending";
    document.querySelector("#down").classList.add("hide");
    document.querySelector("#up").classList.remove("hide");
  } else if (sortingBy == "descending") {
    sortingBy = "id";
    document.querySelector("#up").classList.add("hide");
    document.querySelector("#down").classList.remove("hide");
  } else if (sortingBy == "id") {
    sortingBy = "ascending";
    document.querySelector("#up").classList.remove("hide");
    document.querySelector("#down").classList.remove("hide");
  }
  setTimeout(() => {
    loader.classList.add("hide");
  }, 500);
}
