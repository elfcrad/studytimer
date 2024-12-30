let subjects = [];
let currentSubjectIndex = 0;
let timeLeft = 0;
let timerId = null;
let isPaused = false;
let isBreakTime = false;
let breakTimeMinutes = 5;

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function updateStatusDisplay() {
    const statusDisplay = document.getElementById('status-display');
    statusDisplay.className = 'current-status ' + (isBreakTime ? 'status-break' : 'status-study');
    
    if (subjects.length === 0) {
        statusDisplay.textContent = '科目を設定してください';
    } else if (isBreakTime) {
        statusDisplay.textContent = '休憩時間です！';
    } else {
        statusDisplay.textContent = `現在の科目: ${subjects[currentSubjectIndex].name} (${subjects[currentSubjectIndex].minutes}分)`;
    }
}

function addSubject() {
    const subjectSelect = document.getElementById('subject');
    const minutesInput = document.getElementById('minutes');
    const breakMinutesInput = document.getElementById('break-minutes');
    
    const subject = subjectSelect.value;
    const minutes = parseInt(minutesInput.value);
    const breakMinutes = parseInt(breakMinutesInput.value);
    
    if (subject && minutes > 0 && breakMinutes > 0) {
        subjects.push({
            name: subject,
            minutes: minutes,
            completed: false
        });
        breakTimeMinutes = breakMinutes;
        updateSubjectList();
        updateStatusDisplay();
        subjectSelect.value = '';
        minutesInput.value = '';
        breakMinutesInput.value = '';
        showNotification('科目を追加しました');
    } else {
        showNotification('科目、学習時間、休憩時間を正しく入力してください');
    }
}

function updateSubjectList() {
    const list = document.getElementById('subject-list');
    list.innerHTML = subjects.map((subject, index) => 
        `<div class="subject-list-item ${subject.completed ? 'completed' : ''}">${index + 1}. ${subject.name} - ${subject.minutes}分</div>`
    ).join('');
}

function startTimer() {
    if (subjects.length === 0) {
        showNotification('最低1つの科目を設定してください。');
        return;
    }
    
    document.getElementById('completion-message').style.display = 'none';
    
    if (!timerId) {
        if (!isPaused) {
            timeLeft = isBreakTime ? breakTimeMinutes * 60 : subjects[currentSubjectIndex].minutes * 60;
        }
        timerId = setInterval(updateTimer, 1000);
        isPaused = false;
        updateStatusDisplay();
    }
}

function pauseTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        isPaused = true;
        showNotification('タイマーを一時停止しました');
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isPaused = false;
    isBreakTime = false;
    timeLeft = 0;
    currentSubjectIndex = 0;
    subjects.forEach(subject => subject.completed = false);
    updateDisplay();
    updateStatusDisplay();
    updateSubjectList();
    document.getElementById('completion-message').style.display = 'none';
    showNotification('タイマーをリセットしました');
}

function resetSubjects() {
    subjects = [];
    currentSubjectIndex = 0;
    isBreakTime = false;
    timeLeft = 0;
    clearInterval(timerId);
    timerId = null;
    updateSubjectList();
    updateStatusDisplay();
    updateDisplay();
    document.getElementById('completion-message').style.display = 'none';
    showNotification('科目リストをリセットしました');
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
    } else {
        if (isBreakTime) {
            // 休憩時間終了
            isBreakTime = false;
            if (currentSubjectIndex < subjects.length - 1) {
                currentSubjectIndex++;
                timeLeft = subjects[currentSubjectIndex].minutes * 60;
                showNotification(`休憩時間終わりです！${subjects[currentSubjectIndex].name}を始めましょう！`);
            } else {
                completeAllSubjects();
            }
        } else {
            // 科目終了
            subjects[currentSubjectIndex].completed = true;
            if (currentSubjectIndex < subjects.length - 1) {
                isBreakTime = true;
                timeLeft = breakTimeMinutes * 60;
                showNotification('休憩時間です！');
            } else {
                completeAllSubjects();
            }
        }
        updateStatusDisplay();
        updateSubjectList();
    }
}

function completeAllSubjects() {
    clearInterval(timerId);
    timerId = null;
    document.getElementById('completion-message').style.display = 'block';
    showNotification('すべての学習が終了しました！お疲れ様でした！');
    updateStatusDisplay();
}

function updateDisplay() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    
    document.querySelector('.timer-display').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// 初期表示
updateStatusDisplay();
