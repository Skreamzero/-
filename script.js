// Функция подсчета количества символов без пробелов в тексте
function countChar() {
  var count_char = document.getElementById("count_char");
  var count_char_textarea = document.getElementById("count_char_textarea");

  count_char.value = count_char_textarea.value.replace(
    / *\n*\r*\t*/g,
    ""
  ).length;
}

// Функция для обработки клика по строке
function rowClickHandler(event) {
  // Используем srcElement для поддержки IE8
  var target = event.target || event.srcElement;

  // Получаем значение из первой ячейки строки
  var firstColumnValue =
    target.parentNode.getElementsByTagName("td")[0].innerText;

  // Убираем выделение у предыдущей выделенной строки
  var selectedRow = document.querySelector(".selected-row");
  if (selectedRow) {
    selectedRow.className = "";
  }

  // Выделяем текущую строку
  target.parentNode.className = "selected-row";

  highlightWord(firstColumnValue);
}

// Функция для добавления обработчиков к строкам таблицы
function addClickHandlersToRows() {
  // Получаем все строки таблицы
  var rows = document
    .getElementById("table")
    .getElementsByTagName("tbody")[0]
    .getElementsByTagName("tr");

  // Назначаем обработчик клика на каждую строку
  for (var i = 0; i < rows.length; i++) {
    // Используем attachEvent для поддержки IE8
    if (rows[i].attachEvent) {
      rows[i].attachEvent("onclick", rowClickHandler);
    } else {
      rows[i].addEventListener("click", rowClickHandler);
    }
  }
}

var tableRows = [];
var tableRowsUp = [];
var alsortUp = [];
var alsortDown = [];
var userText = [];

// Функция для парсинга слов
function doParsing() {
  var count_char_textarea = document.getElementById("count_char_textarea");
  words = count_char_textarea.value;
  words = words.replace(/<\/?[^>]+(>|$)/g, ""); //Удалить теги
  words = words.replace(/ - /g, " ").replace(/ — /g, " "); //Удалить тире
  var wordsarr = words.split(/\s+/); //Разбить по пробельному разделителю
  var filteredWordsArr = [];
  for (var i = 0; i < wordsarr.length; i++) {
    var n = wordsarr[i];
    if (n !== undefined && n !== "") {
      filteredWordsArr.push(n);
    }
  }
  wordsarr = filteredWordsArr;
  //Отфильтровать пустые элементы
  var totalCount = wordsarr.length; //Найти количество слов
  var count_words = document.getElementById("count_words");
  count_words.value = totalCount;

  // Создать таблицу с частотой употребления слов
  var wordFrequency = {};
  for (var k = 0; k < wordsarr.length; k++) {
    var st = wordsarr[k]
      .replace(/[^A-Za-z0-9А-Яа-яЁё_\-\s]/g, "")
      .toLowerCase();

    if (wordFrequency.hasOwnProperty(st)) {
      wordFrequency[st]++;
    } else {
      wordFrequency[st] = 1;
    }
  }

  var tableBody = document
    .getElementById("table")
    .getElementsByTagName("tbody")[0];
  var table = document.getElementById("table");
  var tbody = table.getElementsByTagName("tbody")[0];

  // Очистить таблицу
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  tableRows = [];
  tableRowsUp = [];
  alsortUp = [];
  alsortDown = [];
  userText = [];

  for (var word in wordFrequency) {
    if (wordFrequency.hasOwnProperty(word) && word.length > 3) {
      var row = tableBody.insertRow();
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);

      cell1.innerHTML = word;
      cell2.innerHTML = wordFrequency[word];

      // Добавить третью колонку с процентным соотношением
      var percentage = ((wordFrequency[word] / totalCount) * 100).toFixed(2);
      cell3.innerHTML = percentage + "%";
    }
  }

  // Сортировка таблицы
  for (var i = 0; i < tableBody.rows.length; i++) {
    tableRows.push(tableBody.rows[i]);
    tableRowsUp.push(tableBody.rows[i]);
    alsortUp.push(tableBody.rows[i]);
    alsortDown.push(tableBody.rows[i]);
  }

  // Сортировка по убыванию частотности
  tableRows.sort(function (rowA, rowB) {
    var percentageA = parseFloat(rowA.cells[2].innerText.replace("%", ""));
    var percentageB = parseFloat(rowB.cells[2].innerText.replace("%", ""));
    return percentageB - percentageA; // Сортировка в порядке убывания
  });

  // Сортировка по возрастанию частотности (создание массива)
  tableRowsUp.sort(function (tblUpA, tblUpB) {
    var percA = parseFloat(tblUpA.cells[2].innerText.replace("%", ""));
    var percB = parseFloat(tblUpB.cells[2].innerText.replace("%", ""));
    return percA - percB; // Сортировка в порядке убывания
  });

  // Удаление текущих строк из таблицы
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  // Вставка отсортированных строк обратно в таблицу
  for (var j = 0; j < tableRows.length; j++) {
    tbody.appendChild(tableRows[j]);
  }

  // Сортировка по алфавиту вверх (создание массива)
  alsortUp.sort(function (rowUpA, rowUpB) {
    var sortUpA = rowUpA.cells[0].innerText;
    var sortUpB = rowUpB.cells[0].innerText;

    return compareValues(sortUpB, sortUpA);
  });

  // Сортировка по алфавиту вниз (создание массива)
  alsortDown.sort(function (rowDownA, rowDownB) {
    var sortDownA = rowDownA.cells[0].innerText;
    var sortDownB = rowDownB.cells[0].innerText;

    var comp = compareValues(sortDownB, sortDownA);
    var inv = comp * -1;

    return inv;
  });

  // Замена текста "Введите или вставьте текст" на новый
  var startText = document.getElementById("start_text");
  var finalText = document.createElement("h3");

  finalText.id = "final_text";
  finalText.innerHTML = "Ваш текст:";

  var parentText = startText.parentNode;
  parentText.removeChild(startText);
  parentText.appendChild(finalText);

  // Замена textarea на div с текстом
  var contentDiv = document.createElement("div");

  contentDiv.id = "content";

  // Присваиваем innerHTML с текстом из textarea
  var newText = count_char_textarea.value;
  newText = newText.replace(/\n/g, "<br>");
  userText = newText;
  contentDiv.innerHTML = newText;

  // Заменяем count_char_textarea на contentDiv
  var parent = count_char_textarea.parentNode;
  parent.removeChild(count_char_textarea);
  parent.appendChild(contentDiv);
  // Замена блока кнопок на новую кнопку
  var startButtons = document.getElementById("start_buttons");
  var finalButtons = document.createElement("div");

  finalButtons.id = "final_buttons";
  finalButtons.innerHTML =
    '<input class="disabled" type="button" value="Анализ" onclick="doParsing()" /> <input class="disabled" type="button" value="Очистить" onclick="doClearing()" /> <input class="but" type="button" value="Редактировать текст" onclick="editText(), updateText()" />';

  var parentButtons = startButtons.parentNode;
  parentButtons.removeChild(startButtons);
  parentButtons.appendChild(finalButtons);

  addClickHandlersToRows();
}
// Функция для очистки таблицы
function doClearing() {
  var multilineText = document.getElementById("count_char_textarea");
  multilineText.value = "";
  var count_char = document.getElementById("count_char");
  count_char.value = "0";
}

// Функция сортировки таблицы
function sortTable(columnIndex) {
  var table, tbody, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("table");
  tbody = table.getElementsByTagName("tbody")[0];
  switching = true;

  if (columnIndex === "0") {
    // Удаление текущих строк из таблицы
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    // Вставка отсортированных строк обратно в таблицу
    for (var i = 0; i < alsortDown.length; i++) {
      tbody.appendChild(alsortDown[i]);
    }
  } else if (columnIndex === "1") {
    // Удаление текущих строк из таблицы
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    // Вставка отсортированных строк обратно в таблицу
    for (var i = 0; i < alsortUp.length; i++) {
      tbody.appendChild(alsortUp[i]);
    }
  } else if (columnIndex === "2") {
    // Удаление текущих строк из таблицы
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    // Вставка отсортированных строк обратно в таблицу
    for (var i = 0; i < tableRowsUp.length; i++) {
      tbody.appendChild(tableRowsUp[i]);
    }
  } else if (columnIndex === "3") {
    // Удаление текущих строк из таблицы
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    // Вставка отсортированных строк обратно в таблицу
    for (var i = 0; i < tableRows.length; i++) {
      tbody.appendChild(tableRows[i]);
    }
  }
}

function compareValues(x, y) {
  // Сравниваем значения с учетом приоритета
  if (isRussianLetter(x) && !isRussianLetter(y)) {
    return -1;
  } else if (!isRussianLetter(x) && isRussianLetter(y)) {
    return 1;
  } else if (isNumeric(x) && !isNumeric(y)) {
    return -1;
  } else if (!isNumeric(x) && isNumeric(y)) {
    return 1;
  } else {
    return x.localeCompare(y, "ru", { sensitivity: "base" });
  }
}

function isRussianLetter(str) {
  return /[а-яё]/i.test(str);
}

function isNumeric(str) {
  return /^\d+$/.test(str);
}

// Функция для подсветки слова в тексте
function highlightWord(word) {
  var contentDiv = document.getElementById("content");

  // Ищем слова в тексте
  var pattern = new RegExp(
    "(?:^|\\s|[.,;:?!<>()\"',«»])" +
      escapeRegExp(word) +
      "(?:[.,;:?!<>()\"',«»]|\\s|$)",
    "gi"
  );
  var highlightedText = userText.replace(pattern, function (match) {
    var withoutChars = match.replace(/[.,;:?!<>()"'\s«»]/g, "");
    var newString =
      '<span id="highlight" class="highlight">' + withoutChars + "</span>";
    return match.replace(withoutChars, newString);
  });

  // Присваиваем innerHTML с замененным текстом
  contentDiv.innerHTML = highlightedText;
}

// Функция для экранирования спецсимволов в регулярном выражении
function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
// Функция копирования текста
function countCharTwo() {
  var textarea = document.getElementById("count_char_textarea");
  var buttonCopy = document.getElementById("copy_button");
  if (textarea.value.trim() !== "") {
    buttonCopy.disabled = false;
    buttonCopy.classList.add("undisabled");
    buttonCopy.classList.remove("disabled");
  } else {
    buttonCopy.disabled = true;
    buttonCopy.classList.add("disabled");
    buttonCopy.classList.remove("undisabled");
  }
}
function doCopy() {
  var textarea = document.getElementById("count_char_textarea");
  textarea.select();
  document.execCommand("copy");
  alert("Текст скопирован в буфер обмена");
}
function unHighlightWord() {
  var unHighlightWord = document.getElementById("highlight");
  unHighlightWord.classList.remove("highlight");
}
function editText() {
  var contentDiv = document.getElementById("content");
  var newTextarea = document.createElement("textarea");
  newTextarea.id = "count_char_textarea";
  newTextarea.className = "input-text";
  newTextarea.value = userText;

  // Назначаем обработчики событий
  newTextarea.addEventListener("input", function () {
    countChar();
    countCharTwo();
  });

  // Заменяем contentDiv на textarea
  var parent = contentDiv.parentNode;
  parent.removeChild(contentDiv);
  parent.appendChild(newTextarea);

  // Возвращаем блок кнопок обратно
  var finalButtons = document.getElementById("final_buttons");
  var startButtons = document.createElement("div");
  startButtons.id = "start_buttons";
  startButtons.innerHTML =
    '<input class="but" type="button" value="Анализ" onclick="doParsing()" /> <input class="but" type="button" value="Очистить" onclick="doClearing()" /> <input class="but" type="button" value="Редактировать текст" onclick="editText(), updateText(), doClearing()" />';
  var parentButtons = finalButtons.parentNode;
  parentButtons.removeChild(finalButtons); // Удалить блок кнопок
  parent.appendChild(startButtons); // Добавить стартовые кнопки

  // Очистить таблицу
  var tableBody = document
    .getElementById("table")
    .getElementsByTagName("tbody")[0];
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }

  // Вызываем функцию обновления текста
  resetAnalysis();
  updateText();
  countWords();
}
function resetAnalysis() {
  // Сброс значений счетчиков
  var count_char = document.getElementById("count_char");
  var count_words = document.getElementById("count_words");
  count_char.value = "0";
  count_words.value = "0";

  // Очистка текста и таблицы результатов
  var contentDiv = document.getElementById("content");
  var count_char_textarea = document.getElementById("count_char_textarea");
  var tableBody = document
    .getElementById("table")
    .getElementsByTagName("tbody")[0];

  contentDiv.innerHTML = "."; // Очистка текста
  count_char_textarea.value = ""; // Очистка текстового поля ввода

  // Удаление строк из таблицы результатов
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
}
