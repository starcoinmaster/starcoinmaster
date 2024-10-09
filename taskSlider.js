let currentTaskIndex = 0;
const tasks = document.querySelectorAll('.task-item');
const taskSlider = document.querySelector('.task-slider');

function showTask(index) {
    const taskWidth = tasks[0].offsetWidth;
    taskSlider.style.transform = `translateX(-${taskWidth * index}px)`;
}

// Automatically change tasks every 3 seconds
setInterval(() => {
    currentTaskIndex = (currentTaskIndex + 1) % tasks.length; // Loop back to the first task
    showTask(currentTaskIndex);
}, 3000);
