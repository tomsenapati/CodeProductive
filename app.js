// MAIN /////////////////////////////////////////////

  // GITHUB API RESPONSE /////////////////////////////

  class Github {
    constructor() {
      this.config = {
        headers: {
          Authorization: 'token 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'
        }
      }

    }
    async getUser(user) {
      const profileResponse = await fetch(
        `https://api.github.com/users/${user}`,
        this.config
      )
   
      const profile = await profileResponse.json()
   
      return {
        profile
      }
    }
  }

  // LOGIN UI ////////////////////////////////////////////////

class UI {
  constructor() {
    this.profile = document.querySelector('#profile');
    this.searchUser = document.getElementById('searchUser');
    this.welcomeBanner = document.getElementById ('welcome-banner');
    this.idDisplay = document.getElementById('id-display');
    this.idImgSmall = document.getElementById('id-img-small');
  }

  showProfile(user) {
    this.profile.innerHTML = `
    <div class="card black darken-1">
      <div class="row">
      <br>
        <div class="col m3">
          <img id="profile-img" class="col-content responsive-img circle" src="${user.avatar_url}">
        </div>
        <div class="col m9">
          <span class="col-content">
          <p id="profile-name" class="center-align">${user.name}</p>
          </span>
          <div class="divider"></div>
          <span class="col-content" >
          <p class="center-align">Company: ${user.company}</p>
          </span>
          <div class="divider"></div>
          <span class="col-content" >
          <p class="center-align">Email: ${user.email}</p>
          </span>
        </div>
      </div>
    </div>
    `;

  }

  clearProfile() {
    this.profile.innerHTML = '';
  }

  changeUser() {

    const firstName = localStorage.getItem('name').split(' ').slice(0, -1).join(' ');


  if (localStorage.getItem('name') === 'null') {
  this.idDisplay.innerHTML = 
  `
  <div class="chip profile-card">
          <img class="circle responsive-img" src="${localStorage.getItem('img')}"> 
          ${localStorage.getItem('user')}
         </div>
  `

  this.idImgSmall.innerHTML = `
  <img class=" mobile-icon responsive-img circle hide-on-med-and-up" src="${localStorage.getItem('img')}">
  `

  this.welcomeBanner.innerHTML = `
    <h1>Welcome, ${localStorage.getItem('user')}.</h1>
  <div class="divider"></div>
<h3>What would you like to do today?</h3>
    `;

} else {
  this.idDisplay.innerHTML = 
  `
  <div class="chip profile-card">
          <img class="circle responsive-img" src="${localStorage.getItem('img')}"> ${localStorage.getItem('name')}
         </div>
  `
  this.idImgSmall.innerHTML = `
  <img class=" mobile-icon responsive-img circle hide-on-med-and-up" src="${localStorage.getItem('img')}">
  `

    this.welcomeBanner.innerHTML = `
    <h1>Welcome, ${firstName}.</h1>
    `;

  }}

}


  // MAIN APP ///////////////////////////////////////////

const github = new Github;
const ui = new UI;
const searchUser = document.getElementById('searchUser');
const modalSubmit = document.getElementById('modal-submit');
const elem = document.querySelector('#load-modal');
const instance = M.Modal.init(elem, {dismissible: false});

// Modal open on Load 

if (localStorage.getItem('user') !== null) {
  ui.changeUser();
  instance.close();
  } else {
instance.open();
  }

searchUser.addEventListener('keyup', (e) => {
  const userText = e.target.value;

  if(userText !== ''){
    github.getUser(userText)
    .then(data => {
      if(data.profile.message === 'Not Found'){
      ui.clearProfile();
      } else {
        ui.showProfile(data.profile);
      }
    })
  } else {
    ui.clearProfile();
  }
})

modalSubmit.addEventListener('click', (e) => {
  if (ui.profile.innerHTML == '') {

    alert("Please enter a valid username");

    searchUser.value = '';
    
  } else {

    const profileName = document.getElementById('profile-name').textContent;
    const profileImg = document.getElementById('profile-img').src;
    const searchValue = searchUser.value;

    localStorage.setItem('name', profileName);
    localStorage.setItem('img', profileImg);
    localStorage.setItem('user', searchValue);


    instance.close();
  }

  if (localStorage.getItem('user') !== null) {
  ui.changeUser();
  }
});

 
  


ui.idDisplay.addEventListener('click', e => {
  const logOutConfirm = confirm('Are you sure you want to log out of this session? All data will be lost')

  if (logOutConfirm == true) {
    localStorage.clear();
    location.reload();
  }
  })
ui.idImgSmall.addEventListener('click', e => {
  const logOutConfirm = confirm('Are you sure you want to log out of this session? All data will be lost')

  if (logOutConfirm == true) {
    localStorage.clear();
    location.reload();
  }
  })


// TASK LIST /////////////////////////////////////////

const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');

// Load all event listeners
loadEventListeners();

// Load all event listeners
function loadEventListeners() {
  // DOM Load event
  document.addEventListener('DOMContentLoaded', getTasks);
  // Add task event
  form.addEventListener('submit', addTask);
  // Remove task event
  taskList.addEventListener('click', removeTask);
  // Strike task event 
  taskList.addEventListener('click', strikeTask);
  // Clear task event
  clearBtn.addEventListener('click', clearTasks);
  // Filter tasks event
  filter.addEventListener('keyup', filterTasks);
}

// Get Tasks from Local
function getTasks() {

  let tasks;
  if(localStorage.getItem('tasks') === null){
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

// get strikes from Local
let strikes;
if(localStorage.getItem('strikes') === null) {
  strikes = [];
} else {
  strikes = JSON.parse(localStorage.getItem('strikes'));
}

let filteredTasks = [];
filteredTasks = tasks.filter( (el) => strikes.indexOf(el) <0);


filteredTasks.forEach((task) => {
  // Create li element
  const li = document.createElement('li');
  // Add class
  li.className = 'collection-item';
  // Create text node and append to li
  li.appendChild(document.createTextNode(task));
  // Create new link element
  const link = document.createElement('a');
  const link2 = document.createElement('a');
  // Add class
  link.className = 'delete-item secondary-content';
  link2.className = 'check-item secondary-content';
  // Add icon html
  link.innerHTML = '<i class="material-icons">clear</i>';
  link2.innerHTML = '<i class="material-icons">check</i>';
  // Append the link to li
  li.appendChild(link);
  li.appendChild(link2);

  // Append li to ul
  taskList.appendChild(li);
});

    strikes.forEach((strike) => {
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item strikethrough';
      // Create text node and append to li
      li.appendChild(document.createTextNode(strike));
      // Create new link element
      const link = document.createElement('a');
      const link2 = document.createElement('a');
      // Add class
      link.className = 'delete-item secondary-content';
      link2.className = 'check-item secondary-content';
      // Add icon html
      link.innerHTML = '<i class="material-icons">clear</i>';
      link2.innerHTML = '<i class="material-icons">remove</i>';
      // Append the link to li
      li.appendChild(link);
      li.appendChild(link2);
    
      // Append li to ul
      taskList.appendChild(li);
    })
    
  
    
  }


// Add Task
function addTask(e) {
  if(taskInput.value === '') {
    alert('Please add a task');
  } else {

  // Create li element
  const li = document.createElement('li');
  // Add class
  li.className = 'collection-item';
  // Create text node and append to li
  li.appendChild(document.createTextNode(taskInput.value));
  // Create new link element
  const link = document.createElement('a');
  const link2 = document.createElement('a');
  // Add class
  link.className = 'delete-item secondary-content';
  link2.className = 'check-item secondary-content';
  // Add icon html
  link.innerHTML = '<i class="material-icons">clear</i>';
  link2.innerHTML = '<i class="material-icons">check</i>';
  // Append the link to li
  li.appendChild(link);
  li.appendChild(link2);

  // Append li to ul
  taskList.appendChild(li);

  // Store in LS
  storeTaskInLocalStorage(taskInput.value);

  // Clear input
  taskInput.value = '';

  e.preventDefault();
}
};

// Store Task
function storeTaskInLocalStorage(task) {
  let tasks;
  if(localStorage.getItem('tasks') === null){
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.push(task);

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Remove Task
function removeTask(e) {
  if(e.target.parentElement.classList.contains ('delete-item')) {

    const removeConfirm = confirm('Are you sure you\'re finished with this for the day?')

    if (removeConfirm == true) {

      e.target.parentElement.parentElement.remove();
      if (e.target.parentElement.parentElement.classList.contains('strikethrough')) {
        
      removeStrikeLocalStorage(e.target.parentElement.parentElement);
    } else {
        removeTaskFromLocalStorage(e.target.parentElement.parentElement);
      }
    }
  }
}

// Strike Task

function strikeTask(e) {

  const strikeText = e.target.parentElement.parentElement.innerText
  const strikeArray = strikeText.split('');
  

  if(e.target.parentElement.classList.contains ('check-item')) {

    if (e.target.parentElement.parentElement.classList.contains('strikethrough')) {
      e.target.parentElement.parentElement.classList.remove('strikethrough');
      e.target.parentElement.innerHTML = '<i class="material-icons">check</i>';

      removeStrikeLocalStorage((strikeArray.slice(0, -13)).join(""));

    } else {

      e.target.parentElement.parentElement.classList.add('strikethrough');
      e.target.parentElement.innerHTML = '<i class="material-icons">remove</i>';
      
      addStrikeLocalStorage((strikeArray.slice(0, -12)).join(""));
      
    }
      
      }  
    }
  


// Remove task local storage
function removeTaskFromLocalStorage(taskItem) {
  let tasks
  if(localStorage.getItem('tasks') === null){
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.forEach((task, index) => {
    if(taskItem.textContent === `${task}clearcheck`){
      tasks.splice(index, 1);
      
    } else if (taskItem.textContent === `${task}clearremove`) {
      tasks.splice(index, 1);
    }
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}


// Add strike value in LS
function addStrikeLocalStorage (strike) {
  let strikes
  if(localStorage.getItem('strikes') === null){
    strikes = [];
  } else {
    strikes = JSON.parse(localStorage.getItem('strikes'));
  }

  strikes.push(strike);

  localStorage.setItem('strikes', JSON.stringify(strikes));
}

//remove strike value in LS
function removeStrikeLocalStorage(strike) {
  let strikes
  if(localStorage.getItem('strikes') === null){
    strikes = [];
  } else {
    strikes = JSON.parse(localStorage.getItem('strikes'));
  }

  strikes.forEach((str, index) => {
    if (strike === str) {
      
      strikes.splice(index, 1);

    } else if (strike.textContent === `${str}clearremove`) {
    
      strikes.splice(index, 1);
      removeTaskFromLocalStorage(strike);

    }
  })

 localStorage.setItem('strikes', JSON.stringify(strikes));
  

 
}


// Clear Tasks
function clearTasks() {

  const ClearConfirm = confirm('Are you sure you\'ve completed your goals for the day?')


  if (ClearConfirm == true) {

    while(taskList.firstChild) {
      taskList.removeChild(taskList.firstChild);
    }
  
    clearTasksFromLocalStorage();
  }

}

// Clear Tasks from LS
function clearTasksFromLocalStorage() {
  localStorage.removeItem('tasks');
  localStorage.removeItem('strikes');
}

// Filter Tasks
function filterTasks(e) {
  const text = e.target.value.toLowerCase();

  document.querySelectorAll('.collection-item').forEach(function(task){
    const item = task.firstChild.textContent;
    if(item.toLowerCase().indexOf(text) != -1){
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    }
  });
}

// POMODORO TIMER //////////////////////////////////////////////////

const outline = document.querySelector('.moving-outline circle')
const timeDisplay = document.querySelector('.time-display')
const outlineLength = outline.getTotalLength()
const focusDuration = document.getElementById('focus')
const downDuration = document.getElementById('down')
const timeSubmit = document.getElementById('time-submit')
const pomodoroCard = document.getElementById('pomodoro-timer-card')



outline.style.strokeDasharray = outlineLength;
outline.style.strokeDashoffset = outlineLength;





timeSubmit.addEventListener('click', (e) => {

  let totalDuration = 0;
  let focusLength = parseInt(focusDuration.value);
  let downLength = parseInt(downDuration.value);

  totalDuration = focusLength + downLength
 
  if (isNaN(totalDuration) || focusLength === 0 || downLength === 0) {

    alert('Please fill in both time fields with a valid length of time!')
    focusDuration = '';
    downDuration = '';

  } else {

    progress(totalDuration, focusLength, downLength);

    focusDuration.disabled = true;
    downDuration.disabled = true;
  }


e.preventDefault()
})


function progress(totalDuration, focusLength, downLength) {

  const startTimeMs = Date.now();
  let totalMs = totalDuration * 60 * 1000
  let focusMs = focusLength * 60 * 1000
  let downMs = downLength * 60 * 1000
  let elapsedMs = 0

  let minutes = totalDuration
  let seconds = 60
  timeDisplay.textContent = '0'+minutes+':00'

  
  clockTimer = setInterval(() => {
    let secondCount = Math.floor(elapsedMs/1000)

    // PROGRESS BAR
    elapsedMs = Date.now() - startTimeMs
    let outlineProgress = (elapsedMs / totalMs) * outlineLength
    outline.style.strokeDashoffset = outlineProgress

    //TIME CALC
    let elapsedS = Math.floor(elapsedMs/1000)
    if (secondCount < elapsedS ) {
      seconds--;

      if (seconds === 59){
        minutes--;
      }
    }
    if(elapsedS%60 === 0) {
      seconds = 60;
    }
    // DISPLAY TIME
    let secondsDisplay = seconds
    let minutesDisplay = minutes

    if (seconds === 60) {
      secondsDisplay = '00'
    }
  
  if (seconds < 10) {
    secondsDisplay = '0'+ seconds
  } 
  if (minutes < 10) {
    minutesDisplay = '0' + minutes
  }

  timeDisplay.textContent = minutesDisplay + ':' + secondsDisplay;

    // UI CHANGES
    if (elapsedMs > 0 && elapsedMs < 10) {
      startTimer()
    } else if (
      outlineProgress >= (focusMs / totalMs) * outlineLength && elapsedMs < totalMs
      ) {
        switchTimer()
    } else if (elapsedMs >= totalMs) {
      stopTimer()
    }
  }, 1)
}


function startTimer() {

  backgroundColorSet('teal')
}
function switchTimer() {

  backgroundColorRemove('teal')
  backgroundColorSet('red')
  
}
function stopTimer() {
  
  backgroundColorRemove('red')
  clearInterval(clockTimer)
  resetTimer()
  

}


function backgroundColorSet(color) {
  if (pomodoroCard.classList.contains(color)) {
  } else {
    pomodoroCard.classList.add(color);
  }
};

function backgroundColorRemove(color) {
  if (pomodoroCard.classList.contains(color)) {
    pomodoroCard.classList.remove(color)
  }
};

function resetTimer() {
  focusDuration.value = '';
  downDuration.value = '';
  outline.style.strokeDashoffset = outline.getTotalLength;
  focusDuration.disabled = false;
  downDuration.disabled = false;
}



