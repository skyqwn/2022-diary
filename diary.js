const diaryForm = document.querySelector("#diary-form");
const diaryTitle = document.querySelector("#diary-form input");
const diaryContent = document.querySelector("#diary-content");
const monthSelect = document.querySelector("#month-select");
const daySelect = document.querySelector("#day-select");
const diarySave = document.querySelector("#diart-save");
const checkBtn = document.querySelector("#check-btn");
const filterMonth = document.querySelector("#filter-month");
const checkDiary = document.querySelector("#check-diary");

let diaryArr = JSON.parse(localStorage.getItem("diary")) || [];

const paintMonthDay = () => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (i = 1; i < 13; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.innerText = `${i}월`;
    if (i === month) {
      option.selected = true;
    }
    monthSelect.append(option);
  }

  for (i = 1; i < 32; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.innerText = `${i}일`;
    if (i === day) {
      option.selected = true;
    }
    daySelect.append(option);
  }

  for (i = 1; i < 13; i++) {
    const option = document.createElement("option");
    option.innerText = i;
    filterMonth.append(option);
  }
};

const paintDiary = (diary) => {
  const div = document.createElement("div");
  div.id = diary.id;
  const month = document.createElement("h1");
  month.innerText = `${diary.month}월 ${diary.day}일`;
  const title = document.createElement("span");
  title.innerText = diary.title;
  const content = document.createElement("span");
  content.innerText = diary.content;
  const editBtn = document.createElement("button");
  editBtn.innerText = "🔨";
  editBtn.addEventListener("click", handleEdit);
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "❌";
  deleteBtn.addEventListener("click", handelDelete);
  div.append(month);
  div.append(title);
  div.append(content);
  div.append(editBtn);
  div.append(deleteBtn);
  checkDiary.append(div);
};

const handleEdit = (e) => {
  const div = e.target.parentElement;
  const { id, title, content } = diaryArr.find((diary) => diary.id === div.id);

  diaryTitle.value = title;
  diaryContent.value = content;

  const button = document.createElement("button");
  button.innerText = "수정";
  button.addEventListener("click", (e) => {
    e.preventDefault();
    button.remove();
    diaryUpdate(id);
  });
  diaryForm.append(button);
};

const diaryUpdate = (id) => {
  const title = diaryTitle.value;
  const content = diaryContent.value;

  if (!title || !content) {
    return alert("변경 값을 입력해주세요");
  }

  const data = {
    title,
    content,
    id,
  };
  updateDiary(data);
  alert("수정되었습니다.");
  checkDiary.innerHTML = "";
  arrangeMonth(diaryArr);
};

const updateDiary = ({ id, content, title }) => {
  const updateArr = diaryArr.map((diary) => {
    if (diary.id === id) {
      diary = { ...diary, content, title };
    }
    return diary;
  });
  diaryArr = updateArr;
  localStorage.setItem("diary", JSON.stringify(diaryArr));
};

const handelDelete = (e) => {
  const div = e.target.parentElement;
  removeDiary(div.id);
  div.remove();
};

const removeDiary = (id) => {
  const removeArr = diaryArr.filter((diary) => {
    return diary.id !== id;
  });
  diaryArr = removeArr;
  localStorage.setItem("diary", JSON.stringify(diaryArr));
};

const handleSubmit = (e) => {
  e.preventDefault();
  const title = diaryTitle.value;
  const content = diaryContent.value;
  const month = monthSelect.value;
  const day = daySelect.value;

  if (!title || !content) {
    return alert("값을 입력해주세요!");
  }

  const diaryObj = {
    title,
    content,
    month,
    day,
    id: Date.now().toString(),
  };

  saveDiary(diaryObj);
  checkDiary.innerHTML = "";
  arrangeMonth(diaryArr);
  diaryTitle.value = "";
  diaryContent.value = "";
};

const saveDiary = (diary) => {
  diaryArr.push(diary);
  localStorage.setItem("diary", JSON.stringify(diaryArr));
  alert("저장되었습니다.");
};

const arrangeMonth = (diaryArr) => {
  diaryArr.sort((a, b) => {
    if (a.month < b.month) {
      return -1;
    }
    if (a.month > b.month) {
      return 1;
    }
    return 0;
  });
  diaryArr.forEach((diary) => {
    paintDiary(diary);
  });
};

const handelAllCheck = () => {
  checkDiary.innerHTML = "";
  arrangeMonth(diaryArr);
};

const filterBtn = () => {
  const filterArr = diaryArr.filter((diary) => {
    if (diary.month === filterMonth.value) {
      return diary;
    }
  });
  checkDiary.innerHTML = "";
  arrangeMonth(filterArr);
};

const init = () => {
  paintMonthDay();
  diaryForm.addEventListener("submit", handleSubmit);
  checkBtn.addEventListener("click", handelAllCheck);
  filterMonth.addEventListener("change", filterBtn);
};

init();
